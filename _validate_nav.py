import re, os, html.parser, sys

ROOT = r"e:\AmanShariah Website\aman-website"
src = open(os.path.join(ROOT, "js", "components.js"), encoding="utf-8").read()

# --- 1. Extract NAV_ITEMS by translating the JS array to Python ---
block = re.search(r"const NAV_ITEMS = \[(.*?)\n  \];", src, re.S).group(1)
items = []
for entry in re.finditer(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", block, re.S):
    raw = entry.group(0)
    label = re.search(r'label:\s*"([^"]+)"', raw).group(1)
    href = re.search(r'href:\s*"([^"]+)"', raw).group(1)
    mid = re.search(r'matchId:\s*"([^"]+)"', raw)
    foot = re.search(r'foot:\s*\{\s*label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', raw, re.S)
    kids = []
    for k in re.finditer(r"\{[^{}]*\}", raw):
        if "children" in raw.split(k.group(0))[0][-40:]:
            pass
    items.append({"label": label, "href": href,
                  "match": mid.group(1) if mid else None,
                  "foot": foot.groups() if foot else None,
                  "children": None})

# children per top-level item
tops = re.findall(r"\{\s*id:\s*\"[a-z]+\",\s*label:\s*\"[^\"]+\",\s*href:\s*\"[^\"]+\",\s*children:\s*\[(.*?)\n      \]", block, re.S)
labels = re.findall(r"id:\s*\"([a-z]+)\",\s*label", block)

print("=" * 62)
print("NAV STRUCTURE")
print("=" * 62)
ci = 0
for t in tops:
    ci += 1
    kids = re.findall(r'label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', t)
    mids = re.findall(r'matchId:\s*"([^"]+)"', t)
    print(f"  Dropdown #{ci}: {len(kids)} items")
    for k, (lbl, hrf) in enumerate(kids):
        print(f"     - {lbl:32s} -> {hrf:24s} matchId={mids[k] if k < len(mids) else '-'}")

# --- 2. Every href must resolve to a real file, and anchors must exist ---
print("\n" + "=" * 62)
print("LINK INTEGRITY")
print("=" * 62)
all_hrefs = []
for entry in re.finditer(r'href:\s*"([^"]+)"', block):
    all_hrefs.append(entry.group(1))

bad = 0
for h in sorted(set(all_hrefs)):
    if h.startswith("#") or h.startswith("http"):
        continue
    path, _, frag = h.partition("#")
    fp = os.path.join(ROOT, path)
    if not os.path.exists(fp):
        print(f"  MISSING FILE : {h}")
        bad += 1
        continue
    if frag:
        body = open(fp, encoding="utf-8").read()
        if f'id="{frag}"' not in body:
            print(f"  MISSING ANCHOR: {h}")
            bad += 1
            continue
    print(f"  ok  {h}")
print(f"\n  -> {'ALL LINKS VALID' if bad == 0 else str(bad) + ' BROKEN'}")

# --- 3. data-active values on every page must map to a nav entry ---
print("\n" + "=" * 62)
print("ACTIVE-STATE MAPPING (per page)")
print("=" * 62)
known = set(labels)
matched_ids = set(re.findall(r'matchId:\s*"([a-z]+)"', block))
for f in sorted(os.listdir(ROOT)):
    if not f.endswith(".html"):
        continue
    body = open(os.path.join(ROOT, f), encoding="utf-8").read()
    m = re.search(r'id="site-header"\s+data-active="([a-z]+)"', body)
    if not m:
        continue
    a = m.group(1)
    if a in known:
        state = "top-level link"
    elif a in matched_ids:
        state = "highlighted inside a dropdown"
    else:
        state = "!! NO NAV ITEM MATCHES !!"
    print(f"  {f:20s} data-active={a:14s} {state}")
