namespace LEGAL.Shared.Helpers;
public static class EnvLoader
{
    public static void Load(params string[] paths)
    {
        var sp = paths.Length > 0 ? paths : new[] { ".env", "../.env", "../../.env" };
        foreach (var path in sp) { var fp = Path.GetFullPath(path); if (!File.Exists(fp)) continue;
            foreach (var line in File.ReadAllLines(fp)) { var t = line.Trim(); if (string.IsNullOrEmpty(t) || t.StartsWith('#')) continue;
                var eq = t.IndexOf('='); if (eq < 0) continue; var k = t[..eq].Trim(); var v = t[(eq + 1)..].Trim();
                Environment.SetEnvironmentVariable(k, v); } } }
}
