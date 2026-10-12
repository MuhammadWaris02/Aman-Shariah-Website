import os
ROOT = r"e:\AmanShariah Website\aman-website"
for fn in ["_test_mobile.html", "_test_mob.html"]:
    p = os.path.join(ROOT, fn)
    b = open(p, encoding="utf-8", errors="replace").read()
    print("=" * 60)
    print(fn, "bytes:", len(b))
    print("  has TESTOUT :", "TESTOUT" in b)
    print("  has ZRESULT :", "ZRESULTSTART" in b)
    print("  has nav-item:", "nav-item" in b)
    print("  has </html> :", "</html>" in b)
    print("  last 200 chars:", repr(b[-200:]))
