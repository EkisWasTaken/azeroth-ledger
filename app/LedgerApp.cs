// Azeroth Ledger for Windows: installs the FunStats addon and uploads its stats in the background.
//
// Run it once. It copies itself to %LOCALAPPDATA%\AzerothLedger, starts with Windows, sits in the
// tray, installs or updates the addon in every WoW folder it finds, and uploads FunStats.lua
// whenever WoW saves it (on logout or /reload). Players never have to do anything else.
//
// Build: app\build.cmd (uses the C# compiler that ships with Windows; no downloads).

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

[assembly: AssemblyTitle("Azeroth Ledger")]
[assembly: AssemblyProduct("Azeroth Ledger")]
[assembly: AssemblyDescription("Uploads FunStats addon stats to the Azeroth Ledger website")]
[assembly: AssemblyVersion("1.1.0.0")]

namespace AzerothLedger
{
    static class Config
    {
        public const string SupabaseUrl = "https://nznnybzrqplsqyhotlnd.supabase.co";
        public const string PublishableKey = "sb_publishable_RNaALyd2OI4jthFr0FvFRA_2CCRxzRE";
        // The website's address (empty: no "Open the Ledger" menu item and no update checks).
        // The app checks SiteUrl/app-version.txt for a newer version of itself; build.cmd writes that file.
        public const string SiteUrl = "https://azeroth-ledger.pages.dev";
        public const string AppName = "Azeroth Ledger";
        public const string RunValue = "AzerothLedger";
        public const int MaxRowsPerBatch = 40;
        public const int MaxBatchChars = 1500000;
    }

    // ------------------------------------------------------------------ Lua SavedVariables reader

    // Reads the subset of Lua that WoW writes into SavedVariables: tables, strings, numbers,
    // booleans and nil. Values are Dictionary<string, object>, List<object>, double, bool, string.
    class LuaReader
    {
        readonly string s;
        int i;

        LuaReader(string src) { s = src; }

        public static Dictionary<string, object> Parse(string src)
        {
            var r = new LuaReader(src);
            var outp = new Dictionary<string, object>();
            for (;;)
            {
                r.Skip();
                if (r.i >= r.s.Length) break;
                string id = r.Ident();
                if (id == null) r.Fail("Expected a variable name");
                r.Skip();
                if (r.Peek() != '=') r.Fail("Expected =");
                r.i++;
                object v = r.Value();
                if (v != null) outp[id] = v;
            }
            return outp;
        }

        void Fail(string msg) { throw new FormatException(msg + " (at character " + i + ")"); }
        char Peek() { return i < s.Length ? s[i] : '\0'; }

        void Skip()
        {
            for (;;)
            {
                while (i < s.Length && char.IsWhiteSpace(s[i])) i++;
                if (i + 1 < s.Length && s[i] == '-' && s[i + 1] == '-')
                {
                    int j = i + 2, eq = 0;
                    if (j < s.Length && s[j] == '[')
                    {
                        int k = j + 1;
                        while (k < s.Length && s[k] == '=') { eq++; k++; }
                        if (k < s.Length && s[k] == '[')
                        {
                            string close = "]" + new string('=', eq) + "]";
                            int e = s.IndexOf(close, k, StringComparison.Ordinal);
                            i = e < 0 ? s.Length : e + close.Length;
                            continue;
                        }
                    }
                    int nl = s.IndexOf('\n', i);
                    i = nl < 0 ? s.Length : nl + 1;
                    continue;
                }
                break;
            }
        }

        string Ident()
        {
            if (i >= s.Length || !(char.IsLetter(s[i]) || s[i] == '_') || s[i] > 127) return null;
            int st = i;
            while (i < s.Length && s[i] < 128 && (char.IsLetterOrDigit(s[i]) || s[i] == '_')) i++;
            return s.Substring(st, i - st);
        }

        string Str()
        {
            char q = s[i++];
            var sb = new StringBuilder();
            while (i < s.Length && s[i] != q)
            {
                char c = s[i++];
                if (c != '\\') { sb.Append(c); continue; }
                if (i >= s.Length) break;
                c = s[i++];
                switch (c)
                {
                    case 'n': sb.Append('\n'); break;
                    case 't': sb.Append('\t'); break;
                    case 'r': sb.Append('\r'); break;
                    case 'a': sb.Append('\a'); break;
                    case 'b': sb.Append('\b'); break;
                    case 'f': sb.Append('\f'); break;
                    case 'v': sb.Append('\v'); break;
                    case '\n': sb.Append('\n'); break;
                    default:
                        if (c >= '0' && c <= '9')
                        {
                            int d = c - '0', n = 1;
                            while (n < 3 && i < s.Length && s[i] >= '0' && s[i] <= '9') { d = d * 10 + (s[i++] - '0'); n++; }
                            sb.Append((char)d);
                        }
                        else sb.Append(c);
                        break;
                }
            }
            if (i >= s.Length) Fail("Unfinished text");
            i++;
            return sb.ToString();
        }

        object Number()
        {
            int st = i;
            if (Peek() == '-') i++;
            if (i + 1 < s.Length && s[i] == '0' && (s[i + 1] == 'x' || s[i + 1] == 'X'))
            {
                i += 2;
                int hs = i;
                while (i < s.Length && Uri.IsHexDigit(s[i])) i++;
                double hv = (double)long.Parse(s.Substring(hs, i - hs), NumberStyles.HexNumber, CultureInfo.InvariantCulture);
                return s[st] == '-' ? -hv : hv;
            }
            while (i < s.Length && (char.IsDigit(s[i]) || s[i] == '.')) i++;
            if (i < s.Length && (s[i] == 'e' || s[i] == 'E'))
            {
                i++;
                if (i < s.Length && (s[i] == '+' || s[i] == '-')) i++;
                while (i < s.Length && char.IsDigit(s[i])) i++;
            }
            string t = s.Substring(st, i - st);
            double v;
            if (!double.TryParse(t, NumberStyles.Float, CultureInfo.InvariantCulture, out v)) Fail("Bad number");
            return v;
        }

        object Value()
        {
            Skip();
            char c = Peek();
            if (c == '{') return Table();
            if (c == '"' || c == '\'') return Str();
            if (char.IsDigit(c) || c == '.' || (c == '-' && i + 1 < s.Length && (char.IsDigit(s[i + 1]) || s[i + 1] == '.'))) return Number();
            string id = Ident();
            if (id != null)
            {
                if (id == "true") return true;
                if (id == "false") return false;
                if (id == "nil") return null;
                return null;
            }
            Fail("Unexpected symbol");
            return null;
        }

        object Table()
        {
            i++;
            var obj = new Dictionary<string, object>();
            var order = new List<string>();
            int pos = 1;
            bool keyed = false;
            for (;;)
            {
                Skip();
                if (i >= s.Length) Fail("Unfinished table");
                if (s[i] == '}') { i++; break; }
                string key = null;
                if (s[i] == '[')
                {
                    i++;
                    key = KeyString(Value());
                    Skip();
                    if (Peek() != ']') Fail("Expected ]");
                    i++;
                    Skip();
                    if (Peek() != '=') Fail("Expected =");
                    i++;
                    keyed = true;
                }
                else
                {
                    int save = i;
                    string id = Ident();
                    if (id != null)
                    {
                        int j = i;
                        while (j < s.Length && char.IsWhiteSpace(s[j])) j++;
                        if (j < s.Length && s[j] == '=' && !(j + 1 < s.Length && s[j + 1] == '='))
                        {
                            key = id;
                            i = j + 1;
                            keyed = true;
                        }
                        else i = save;
                    }
                }
                object v = Value();
                if (key == null) key = (pos++).ToString(CultureInfo.InvariantCulture);
                if (v != null)
                {
                    if (!obj.ContainsKey(key)) order.Add(key);
                    obj[key] = v;
                }
                Skip();
                if (Peek() == ',' || Peek() == ';') i++;
            }
            // Same rule as the website: keys exactly 1..n in order become a list.
            if (order.Count > 0)
            {
                bool seq = true;
                for (int k = 0; k < order.Count; k++)
                    if (order[k] != (k + 1).ToString(CultureInfo.InvariantCulture)) { seq = false; break; }
                if (seq) return order.Select(k => obj[k]).ToList();
            }
            if (order.Count == 0 && !keyed) return new List<object>();
            var ordered = new Dictionary<string, object>();
            foreach (var k in order) ordered[k] = obj[k];
            return ordered;
        }

        static string KeyString(object k)
        {
            if (k is double)
            {
                double d = (double)k;
                if (d == Math.Floor(d) && Math.Abs(d) < 1e15) return ((long)d).ToString(CultureInfo.InvariantCulture);
                return d.ToString("R", CultureInfo.InvariantCulture);
            }
            if (k is bool) return (bool)k ? "true" : "false";
            return Convert.ToString(k, CultureInfo.InvariantCulture);
        }
    }

    // ------------------------------------------------------------------ JSON

    static class Json
    {
        public static string Write(object v)
        {
            var sb = new StringBuilder();
            WriteTo(sb, v);
            return sb.ToString();
        }

        static void WriteTo(StringBuilder sb, object v)
        {
            if (v == null) { sb.Append("null"); return; }
            if (v is string) { Str(sb, (string)v); return; }
            if (v is bool) { sb.Append((bool)v ? "true" : "false"); return; }
            if (v is double || v is int || v is long)
            {
                double d = Convert.ToDouble(v, CultureInfo.InvariantCulture);
                if (double.IsNaN(d) || double.IsInfinity(d)) sb.Append('0');
                else if (d == Math.Floor(d) && Math.Abs(d) < 1e15) sb.Append(((long)d).ToString(CultureInfo.InvariantCulture));
                else sb.Append(d.ToString("R", CultureInfo.InvariantCulture));
                return;
            }
            var dict = v as Dictionary<string, object>;
            if (dict != null)
            {
                sb.Append('{');
                bool first = true;
                foreach (var kv in dict)
                {
                    if (!first) sb.Append(',');
                    first = false;
                    Str(sb, kv.Key);
                    sb.Append(':');
                    WriteTo(sb, kv.Value);
                }
                sb.Append('}');
                return;
            }
            var list = v as List<object>;
            if (list != null)
            {
                sb.Append('[');
                for (int k = 0; k < list.Count; k++)
                {
                    if (k > 0) sb.Append(',');
                    WriteTo(sb, list[k]);
                }
                sb.Append(']');
                return;
            }
            Str(sb, v.ToString());
        }

        static void Str(StringBuilder sb, string s)
        {
            sb.Append('"');
            foreach (char c in s)
            {
                switch (c)
                {
                    case '"': sb.Append("\\\""); break;
                    case '\\': sb.Append("\\\\"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    default:
                        if (c < 0x20) sb.Append("\\u").Append(((int)c).ToString("x4"));
                        else sb.Append(c);
                        break;
                }
            }
            sb.Append('"');
        }

        // Reads the small JSON answers from Supabase ({"saved":1,"skipped":0}).
        public static int ReadInt(string json, string field)
        {
            int at = json.IndexOf("\"" + field + "\"", StringComparison.Ordinal);
            if (at < 0) return 0;
            int c = json.IndexOf(':', at);
            int n = 0, k = c + 1;
            while (k < json.Length && char.IsWhiteSpace(json[k])) k++;
            while (k < json.Length && char.IsDigit(json[k])) n = n * 10 + (json[k++] - '0');
            return n;
        }
    }

    // ------------------------------------------------------------------ rows (same as the website)

    class Row
    {
        public string Kind, Key, Json;
        public string Name;
    }

    static class Rows
    {
        static List<object> AsList(object v)
        {
            var l = v as List<object>;
            if (l != null) return l;
            var d = v as Dictionary<string, object>;
            return d != null ? d.Values.ToList() : new List<object>();
        }

        static string Str(Dictionary<string, object> d, string k)
        {
            object v;
            return d.TryGetValue(k, out v) ? v as string : null;
        }

        static Dictionary<string, object> CharData(string key, Dictionary<string, object> c, string fallbackOwner)
        {
            var data = new Dictionary<string, object>(c);
            data.Remove("settings");
            data.Remove("killNames");
            data.Remove("secret");
            data["key"] = key;
            data["name"] = Str(data, "name") ?? key.Split('-')[0];
            data["owner"] = Str(data, "owner") ?? fallbackOwner;
            object deaths, notable, days;
            data.TryGetValue("deaths", out deaths);
            data.TryGetValue("notable", out notable);
            data.TryGetValue("days", out days);
            data["deaths"] = AsList(deaths);
            data["notable"] = AsList(notable);
            data["days"] = days as Dictionary<string, object> ?? new Dictionary<string, object>();
            return data;
        }

        static Dictionary<string, object> Section(Dictionary<string, object> db, string name)
        {
            object v;
            return db.TryGetValue(name, out v) ? v as Dictionary<string, object> ?? new Dictionary<string, object>() : new Dictionary<string, object>();
        }

        public static List<Row> Build(Dictionary<string, object> db)
        {
            string account = Str(db, "id") ?? "unknown";
            var rows = new List<Row>();
            var own = new HashSet<string>();
            foreach (var kv in Section(db, "chars"))
            {
                var c = kv.Value as Dictionary<string, object>;
                if (c == null) continue;
                own.Add(kv.Key);
                var d = CharData(kv.Key, c, account);
                rows.Add(Make("char", kv.Key, d));
            }
            foreach (var kv in Section(db, "synced"))
            {
                var c = kv.Value as Dictionary<string, object>;
                if (c == null || own.Contains(kv.Key)) continue;
                rows.Add(Make("relay", kv.Key, CharData(kv.Key, c, "char:" + kv.Key)));
            }
            foreach (var kv in Section(db, "observed"))
            {
                var o = kv.Value as Dictionary<string, object>;
                if (o == null || own.Contains(kv.Key)) continue;
                var d = new Dictionary<string, object>(o);
                d["key"] = kv.Key;
                d["name"] = Str(d, "name") ?? kv.Key.Split('-')[0];
                object deaths;
                d.TryGetValue("deaths", out deaths);
                d["deaths"] = AsList(deaths);
                rows.Add(Make("obs", kv.Key, d));
            }
            return rows;
        }

        static Row Make(string kind, string key, Dictionary<string, object> data)
        {
            var body = new Dictionary<string, object>();
            body["kind"] = kind;
            body["char_key"] = key;
            body["data"] = data;
            return new Row { Kind = kind, Key = key, Json = Json.Write(body), Name = data["name"] as string ?? key };
        }
    }

    // ------------------------------------------------------------------ finding WoW

    static class Wow
    {
        // Flavour folders that never run FunStats.
        static readonly string[] Skip = { "_retail_", "_ptr_", "_xptr_", "_beta_", "_alpha_" };

        public static List<string> Roots()
        {
            var found = new List<string>();
            Action<string> add = p =>
            {
                try
                {
                    if (string.IsNullOrEmpty(p)) return;
                    p = p.Trim().TrimEnd('\\', '/');
                    string name = Path.GetFileName(p);
                    if (name.StartsWith("_") && name.EndsWith("_")) p = Path.GetDirectoryName(p);
                    if (p != null && Directory.Exists(p) && Flavours(p).Count > 0 && !found.Any(f => string.Equals(f, p, StringComparison.OrdinalIgnoreCase)))
                        found.Add(p);
                }
                catch { /* unreadable folder */ }
            };
            foreach (var view in new[] { RegistryView.Registry32, RegistryView.Registry64 })
            {
                try
                {
                    using (var hk = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, view))
                    {
                        foreach (var sub in new[] { @"SOFTWARE\Blizzard Entertainment\World of Warcraft", @"SOFTWARE\WOW6432Node\Blizzard Entertainment\World of Warcraft" })
                        {
                            using (var k = hk.OpenSubKey(sub))
                            {
                                if (k == null) continue;
                                add(k.GetValue("InstallPath") as string);
                                add(k.GetValue("GamePath") as string);
                            }
                        }
                        using (var un = hk.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"))
                        {
                            if (un != null)
                                foreach (var n in un.GetSubKeyNames())
                                    using (var k = un.OpenSubKey(n))
                                    {
                                        var dn = k == null ? null : k.GetValue("DisplayName") as string;
                                        if (dn != null && dn.IndexOf("World of Warcraft", StringComparison.OrdinalIgnoreCase) >= 0)
                                            add(k.GetValue("InstallLocation") as string);
                                    }
                        }
                    }
                }
                catch { /* no registry access */ }
            }
            foreach (var drive in DriveInfo.GetDrives())
            {
                try
                {
                    if (drive.DriveType != DriveType.Fixed || !drive.IsReady) continue;
                    string r = drive.RootDirectory.FullName;
                    foreach (var rel in new[] { "World of Warcraft", @"Program Files (x86)\World of Warcraft", @"Program Files\World of Warcraft", @"Games\World of Warcraft", @"Battle.net\World of Warcraft", @"Blizzard\World of Warcraft" })
                        add(Path.Combine(r, rel));
                }
                catch { /* drive not ready */ }
            }
            // Extra folders, one per line, for unusual installs.
            string extra = Path.Combine(App.DataDir, "wow-folders.txt");
            if (File.Exists(extra)) foreach (var line in File.ReadAllLines(extra)) add(line);
            return found;
        }

        public static List<string> Flavours(string root)
        {
            var list = new List<string>();
            try
            {
                foreach (var d in Directory.GetDirectories(root, "_*_"))
                {
                    string n = Path.GetFileName(d).ToLowerInvariant();
                    if (Skip.Contains(n)) continue;
                    if (File.Exists(Path.Combine(d, "Wow.exe")) || File.Exists(Path.Combine(d, "WowClassic.exe")) || Directory.Exists(Path.Combine(d, "Interface")) || Directory.Exists(Path.Combine(d, "WTF")))
                        list.Add(d);
                }
            }
            catch { /* no access */ }
            return list;
        }

        public static List<string> SaveFiles(List<string> roots)
        {
            var files = new List<string>();
            foreach (var root in roots)
                foreach (var fl in Flavours(root))
                {
                    string acc = Path.Combine(fl, @"WTF\Account");
                    if (!Directory.Exists(acc)) continue;
                    try
                    {
                        foreach (var a in Directory.GetDirectories(acc))
                        {
                            string f = Path.Combine(a, @"SavedVariables\FunStats.lua");
                            if (File.Exists(f)) files.Add(f);
                        }
                    }
                    catch { /* no access */ }
                }
            return files;
        }
    }

    // ------------------------------------------------------------------ the app

    class App : ApplicationContext
    {
        public static readonly string DataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AzerothLedger");
        static readonly string InstalledExe = Path.Combine(DataDir, "AzerothLedger.exe");
        static readonly string StatePath = Path.Combine(DataDir, "uploaded.txt");
        static readonly string LogPath = Path.Combine(DataDir, "log.txt");

        readonly NotifyIcon tray;
        readonly ToolStripMenuItem statusItem, autoItem;
        readonly System.Windows.Forms.Timer timer;
        readonly Dictionary<string, string> sent = new Dictionary<string, string>();  // row id -> digest
        readonly Dictionary<string, DateTime> seen = new Dictionary<string, DateTime>(); // file -> last write handled
        List<string> roots = new List<string>();
        DateTime lastScan = DateTime.MinValue;
        DateTime lastUpdateCheck = DateTime.MinValue;
        int busy;

        [STAThread]
        static void Main(string[] args)
        {
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
            Directory.CreateDirectory(DataDir);

            if (args.Length >= 2 && args[0] == "--dry-run")
            {
                // Prints the rows a file would upload, for testing.
                var db = LuaReader.Parse(File.ReadAllText(args[1], Encoding.UTF8));
                object fs;
                db.TryGetValue("FunStatsDB", out fs);
                using (var stdout = Console.OpenStandardOutput())
                    foreach (var r in Rows.Build((Dictionary<string, object>)fs)) { var b = Encoding.UTF8.GetBytes(r.Json + "\n"); stdout.Write(b, 0, b.Length); }
                return;
            }
            if (args.Length >= 1 && args[0] == "--uninstall") { Uninstall(); return; }
            if (args.Length >= 1 && (args[0] == "--find" || args[0] == "--ping"))
            {
                // Diagnostics: list the WoW folders and save files found, or test the connection to the
                // website with an upload Supabase must refuse (an invalid upload code; nothing is stored).
                var sb = new StringBuilder();
                if (args[0] == "--find")
                {
                    var rs = Wow.Roots();
                    foreach (var r in rs) { sb.AppendLine("WoW: " + r); foreach (var fl in Wow.Flavours(r)) sb.AppendLine("  flavour: " + fl); }
                    foreach (var f in Wow.SaveFiles(rs)) sb.AppendLine("save file: " + f);
                    if (rs.Count == 0) sb.AppendLine("No World of Warcraft folder found.");
                }
                else sb.AppendLine(Post("/rest/v1/rpc/upload_ledger", "{\"p_secret\":\"test\",\"p_rows\":[]}") ?? "(refused; see log.txt)");
                if (File.Exists(LogPath)) sb.AppendLine("--- log ---").AppendLine(string.Join("\n", File.ReadAllLines(LogPath).Reverse().Take(3)));
                using (var stdout = Console.OpenStandardOutput()) { var b = Encoding.UTF8.GetBytes(sb.ToString()); stdout.Write(b, 0, b.Length); }
                return;
            }

            string me = Assembly.GetExecutingAssembly().Location;
            if (!string.Equals(Path.GetFullPath(me), Path.GetFullPath(InstalledExe), StringComparison.OrdinalIgnoreCase))
            {
                // First run (or a newer download, or an update): replace the running copy, start with Windows, launch it.
                try
                {
                    foreach (var p in Process.GetProcessesByName(Path.GetFileNameWithoutExtension(InstalledExe)))
                        if (p.Id != Process.GetCurrentProcess().Id) try { p.Kill(); p.WaitForExit(3000); } catch { }
                    File.Copy(me, InstalledExe, true);
                    SetAutostart(true);
                    Process.Start(new ProcessStartInfo(InstalledExe, args.Contains("--updated") ? "--updated" : "--welcome") { UseShellExecute = false });
                }
                catch (Exception e)
                {
                    MessageBox.Show("Azeroth Ledger couldn't install itself:\n" + e.Message, Config.AppName, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                return;
            }

            bool first;
            using (var mutex = new Mutex(true, "AzerothLedgerUploader", out first))
            {
                if (!first) return; // already running
                Application.EnableVisualStyles();
                if (args.Contains("--updated")) Log("Updated to version " + Assembly.GetExecutingAssembly().GetName().Version);
                Application.Run(new App(args.Contains("--welcome")));
            }
        }

        App(bool welcome)
        {
            LoadState();
            var menu = new ContextMenuStrip();
            statusItem = new ToolStripMenuItem("Starting…") { Enabled = false };
            menu.Items.Add(statusItem);
            menu.Items.Add(new ToolStripSeparator());
            if (Config.SiteUrl != "") menu.Items.Add("Open the Ledger", null, (s, e) => Open(Config.SiteUrl));
            menu.Items.Add("Upload now", null, (s, e) => { seen.Clear(); Tick(true); });
            menu.Items.Add("Show log", null, (s, e) => { if (File.Exists(LogPath)) Open(LogPath); });
            autoItem = new ToolStripMenuItem("Start with Windows", null, (s, e) => { SetAutostart(!autoItem.Checked); autoItem.Checked = IsAutostart(); });
            autoItem.Checked = IsAutostart();
            menu.Items.Add(autoItem);
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("Quit", null, (s, e) => { tray.Visible = false; ExitThread(); });

            tray = new NotifyIcon { Icon = MakeIcon(), Text = Config.AppName, ContextMenuStrip = menu, Visible = true };
            tray.DoubleClick += (s, e) => { if (File.Exists(LogPath)) Open(LogPath); };

            timer = new System.Windows.Forms.Timer { Interval = 15000 };
            timer.Tick += (s, e) => Tick(false);
            timer.Start();
            Tick(false);

            if (welcome)
            {
                int n = roots.Count;
                tray.ShowBalloonTip(8000, "Azeroth Ledger is running",
                    n > 0 ? "The FunStats addon is installed. Just play: your stats upload by themselves after you log out."
                          : "Couldn't find World of Warcraft yet. It will keep looking; your stats upload by themselves once it's installed.",
                    ToolTipIcon.Info);
            }
        }

        void Tick(bool manual)
        {
            if (Interlocked.Exchange(ref busy, 1) == 1) return;
            ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    // Look for WoW and refresh the addon every 10 minutes (and at start).
                    if (manual || (DateTime.UtcNow - lastScan).TotalMinutes >= 10)
                    {
                        lastScan = DateTime.UtcNow;
                        roots = Wow.Roots();
                        foreach (var r in roots) foreach (var fl in Wow.Flavours(r)) InstallAddon(fl);
                    }
                    var files = Wow.SaveFiles(roots);
                    foreach (var f in files)
                    {
                        DateTime w = File.GetLastWriteTimeUtc(f);
                        DateTime prev;
                        if (seen.TryGetValue(f, out prev) && prev == w) continue;
                        if ((DateTime.UtcNow - w).TotalSeconds < 4) continue; // WoW may still be writing
                        if (Upload(f)) seen[f] = w;
                    }
                    if (roots.Count == 0) SetStatus("Looking for World of Warcraft…");
                    else if (files.Count == 0) SetStatus("Waiting for your first logout in WoW");
                    CheckForUpdate();
                }
                catch (Exception e) { Log("Error: " + e.Message); }
                finally { Interlocked.Exchange(ref busy, 0); }
            });
        }

        // Every 6 hours (and at start), asks the website for sitepp-version.txt ("<version> <sha256>", written by
        // build.cmd). When it names a newer version, downloads the new app, checks it against the hash and starts it;
        // like a fresh download, it closes this copy and installs itself in its place. The addon comes with it.
        void CheckForUpdate()
        {
            if (Config.SiteUrl == "" || (DateTime.UtcNow - lastUpdateCheck).TotalHours < 6) return;
            lastUpdateCheck = DateTime.UtcNow;
            try
            {
                string site = Config.SiteUrl.TrimEnd('/');
                string[] parts;
                using (var wc = new WebClient()) parts = wc.DownloadString(site + "/app-version.txt?t=" + DateTime.UtcNow.Ticks).Trim().Split(' ');
                Version latest;
                if (parts.Length < 2 || !Version.TryParse(parts[0], out latest)) return;
                if (latest <= Assembly.GetExecutingAssembly().GetName().Version) return;
                byte[] exe;
                using (var wc = new WebClient()) exe = wc.DownloadData(site + "/AzerothLedger.exe?v=" + latest);
                string hash;
                using (var sha = SHA256.Create()) hash = BitConverter.ToString(sha.ComputeHash(exe)).Replace("-", "");
                if (!string.Equals(hash, parts[1], StringComparison.OrdinalIgnoreCase)) { Log("Update to " + latest + " skipped: the download didn't match app-version.txt"); return; }
                string path = Path.Combine(DataDir, "update", "AzerothLedger.exe");
                Directory.CreateDirectory(Path.GetDirectoryName(path));
                File.WriteAllBytes(path, exe);
                Log("Updating to version " + latest);
                Process.Start(new ProcessStartInfo(path, "--updated") { UseShellExecute = false });
            }
            catch (Exception e) { Log("Update check failed: " + e.Message); }
        }

        // Copies the addon bundled in this app into a flavour's AddOns folder when it's missing or different.
        void InstallAddon(string flavour)
        {
            try
            {
                string dir = Path.Combine(flavour, @"Interface\AddOns\FunStats");
                var asm = Assembly.GetExecutingAssembly();
                foreach (var name in new[] { "FunStats.toc", "FunStats.lua", "Sync.lua" })
                {
                    byte[] bytes;
                    using (var st = asm.GetManifestResourceStream("addon." + name))
                    {
                        if (st == null) return;
                        bytes = new byte[st.Length];
                        st.Read(bytes, 0, bytes.Length);
                    }
                    string target = Path.Combine(dir, name);
                    if (File.Exists(target) && File.ReadAllBytes(target).SequenceEqual(bytes)) continue;
                    Directory.CreateDirectory(dir);
                    File.WriteAllBytes(target, bytes);
                    Log("Installed " + name + " in " + dir);
                }
            }
            catch (Exception e) { Log("Couldn't install the addon in " + flavour + ": " + e.Message); }
        }

        bool Upload(string file)
        {
            string text;
            try { text = File.ReadAllText(file, Encoding.UTF8); }
            catch (IOException) { return false; } // locked; try again next tick
            Dictionary<string, object> db;
            try
            {
                object fs;
                LuaReader.Parse(text).TryGetValue("FunStatsDB", out fs);
                db = fs as Dictionary<string, object>;
            }
            catch (Exception e) { Log("Couldn't read " + file + ": " + e.Message); return true; }
            if (db == null) return true;
            object sec;
            db.TryGetValue("secret", out sec);
            string secret = sec as string;
            if (secret == null || secret.Length < 32) { Log("No upload code yet in " + file + " (log in once with the new addon)."); return true; }

            var rows = Rows.Build(db);
            string tag = secret.Substring(0, 8);
            var changed = rows.Where(r => { string d; return !sent.TryGetValue(Id(r, tag), out d) || d != Digest(r.Json); }).ToList();
            if (changed.Count == 0) { SetStatus("Up to date · " + DateTime.Now.ToString("t")); return true; }

            int saved = 0, skipped = 0;
            var batch = new List<Row>();
            int size = 0;
            Func<bool> flush = () =>
            {
                if (batch.Count == 0) return true;
                string body = "{\"p_secret\":" + Json.Write(secret) + ",\"p_rows\":[" + string.Join(",", batch.Select(r => r.Json)) + "]}";
                string answer = Post("/rest/v1/rpc/upload_ledger", body);
                if (answer == null) return false;
                saved += Json.ReadInt(answer, "saved");
                skipped += Json.ReadInt(answer, "skipped");
                foreach (var r in batch) sent[Id(r, tag)] = Digest(r.Json);
                batch.Clear();
                size = 0;
                return true;
            };
            foreach (var r in changed)
            {
                if (batch.Count > 0 && (batch.Count >= Config.MaxRowsPerBatch || size + r.Json.Length > Config.MaxBatchChars))
                    if (!flush()) { SetStatus("Upload failed, retrying soon"); return false; }
                batch.Add(r);
                size += r.Json.Length;
            }
            if (!flush()) { SetStatus("Upload failed, retrying soon"); return false; }
            SaveState();
            var mine = changed.Where(r => r.Kind == "char").Select(r => r.Name).Distinct().ToList();
            Log("Uploaded " + saved + " row(s)" + (mine.Count > 0 ? " for " + string.Join(", ", mine) : "") + (skipped > 0 ? ", " + skipped + " skipped (claimed by another upload code)" : ""));
            SetStatus("Uploaded " + DateTime.Now.ToString("t"));
            return true;
        }

        static string Post(string path, string body)
        {
            try
            {
                var req = (HttpWebRequest)WebRequest.Create(Config.SupabaseUrl + path);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Headers["apikey"] = Config.PublishableKey;
                req.Timeout = 60000;
                byte[] bytes = Encoding.UTF8.GetBytes(body);
                req.ContentLength = bytes.Length;
                using (var st = req.GetRequestStream()) st.Write(bytes, 0, bytes.Length);
                using (var res = (HttpWebResponse)req.GetResponse())
                using (var rd = new StreamReader(res.GetResponseStream(), Encoding.UTF8))
                    return rd.ReadToEnd();
            }
            catch (WebException e)
            {
                string detail = "";
                if (e.Response != null) using (var rd = new StreamReader(e.Response.GetResponseStream())) detail = rd.ReadToEnd();
                Log("Upload failed: " + e.Message + " " + detail);
                return null;
            }
        }

        static string Id(Row r, string tag) { return r.Kind + ":" + r.Key + ":" + tag; }

        static string Digest(string s)
        {
            using (var sha = SHA1.Create())
                return BitConverter.ToString(sha.ComputeHash(Encoding.UTF8.GetBytes(s))).Replace("-", "");
        }

        void LoadState()
        {
            try
            {
                if (!File.Exists(StatePath)) return;
                foreach (var line in File.ReadAllLines(StatePath))
                {
                    int t = line.LastIndexOf('\t');
                    if (t > 0) sent[line.Substring(0, t)] = line.Substring(t + 1);
                }
            }
            catch { /* start fresh */ }
        }

        void SaveState()
        {
            try { File.WriteAllLines(StatePath, sent.Select(kv => kv.Key + "\t" + kv.Value)); }
            catch (Exception e) { Log("Couldn't save state: " + e.Message); }
        }

        void SetStatus(string text)
        {
            try
            {
                tray.ContextMenuStrip.BeginInvoke((Action)(() =>
                {
                    statusItem.Text = text;
                    tray.Text = (Config.AppName + " · " + text).Length > 63 ? Config.AppName : Config.AppName + " · " + text;
                }));
            }
            catch { /* tray not ready */ }
        }

        static readonly object logLock = new object();
        static void Log(string msg)
        {
            lock (logLock)
            {
                try
                {
                    if (File.Exists(LogPath) && new FileInfo(LogPath).Length > 512 * 1024)
                    {
                        var keep = File.ReadAllLines(LogPath);
                        File.WriteAllLines(LogPath, keep.Skip(keep.Length / 2));
                    }
                    File.AppendAllText(LogPath, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + msg + Environment.NewLine);
                }
                catch { /* logging is optional */ }
            }
        }

        static void Open(string target)
        {
            try { Process.Start(new ProcessStartInfo(target) { UseShellExecute = true }); } catch { }
        }

        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run";

        static bool IsAutostart()
        {
            using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k != null && k.GetValue(Config.RunValue) != null;
        }

        static void SetAutostart(bool on)
        {
            using (var k = Registry.CurrentUser.CreateSubKey(RunKey))
            {
                if (on) k.SetValue(Config.RunValue, "\"" + InstalledExe + "\"");
                else if (k.GetValue(Config.RunValue) != null) k.DeleteValue(Config.RunValue);
            }
        }

        static void Uninstall()
        {
            SetAutostart(false);
            foreach (var p in Process.GetProcessesByName("AzerothLedger"))
                if (p.Id != Process.GetCurrentProcess().Id) try { p.Kill(); } catch { }
            MessageBox.Show("Azeroth Ledger no longer starts with Windows. You can delete " + DataDir + ". The FunStats addon stays installed; remove it from your AddOns folder if you like.", Config.AppName);
        }

        // The Ledger logo (shield with a sword, app\logo.ico) at the tray's size.
        static Icon MakeIcon()
        {
            using (var st = Assembly.GetExecutingAssembly().GetManifestResourceStream("logo.ico"))
            {
                if (st != null) return new Icon(st, SystemInformation.SmallIconSize);
            }
            return SystemIcons.Application;
        }
    }
}
