import re, sys, os
ROOT = r"e:\AmanShariah Website\aman-website"
targets = [("DESKTOP (1400x900)", "_test_out.html"), ("MOBILE (390x844)", "_test_mob.html")]
grand_fail = 0

for title, fn in targets:
    body = open(os.path.join(ROOT, fn), encoding="utf-8").read()
    m = re.search(r"ZRESULTSTART(.*?)ZRESULTEND", body, re.S)
    print("=" * 66)
    print(title)
    print("=" * 66)
    if not m:
        t = re.search(r'id="TESTOUT">(.*?)</div>', body, re.S)
        print("  !! harness did not finish:", (t.group(1)[:160] if t else "no TESTOUT"))
        grand_fail += 1
        continue
    rs = [r.strip() for r in m.group(1).split("~") if r.strip()]
    dbg = [r for r in rs if r.startswith("DEBUG")]
    rs = [r for r in rs if not r.startswith("DEBUG")]
    fails = [r for r in rs if not r.startswith("PASS")]
    for r in rs:
        print("  " + r)
    if dbg:
        print("  " + "-" * 40)
        for d in dbg:
            print("  " + d)
    grand_fail += len(fails)
    print(f"  -> {len(rs) - len(fails)}/{len(rs)} passed")
    print()

print("=" * 66)
print("OVERALL: ALL TESTS PASSED" if grand_fail == 0 else f"OVERALL: {grand_fail} FAILURE(S)")

