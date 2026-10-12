import os
ROOT = r"e:\AmanShariah Website\aman-website"
src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

# Disable transitions so layout/state is observable immediately under virtual time.
src = src.replace("</head>", "<style>*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}</style></head>")

MOBILE_JS = r"""
<div id="TESTOUT">PENDING</div>
<script>
var R = [];
function ok(n, c) { R.push((c ? "PASS" : "FAIL") + " :: " + n); }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
window.addEventListener("load", function () { setTimeout(async function () {
  try {
    var burger = document.getElementById("hamburger");
    var drawer = document.getElementById("navLinks");
    var overlay = document.getElementById("navOverlay");
    var svc = document.querySelector("[data-dropdown]");
    var toggle = svc.querySelector(".nav-dropdown-toggle");
    var panel = svc.querySelector(".dropdown");

    ok("viewport is mobile width", window.innerWidth <= 820);
    ok("hamburger is visible", getComputedStyle(burger).display !== "none");
    ok("drawer starts off-screen", drawer.getBoundingClientRect().left >= window.innerWidth - 1);

    burger.click();
    await wait(60);
    ok("hamburger opens drawer", drawer.classList.contains("open"));
    ok("hamburger aria-expanded=true", burger.getAttribute("aria-expanded") === "true");
    ok("overlay shown", overlay.classList.contains("show"));

    var panelH = function () { return panel.getBoundingClientRect().height; };
    ok("accordion starts collapsed", panelH() < 1);
    ok("parent link and caret share one row",
       Math.abs(svc.querySelector(".nav-link-parent").getBoundingClientRect().top
              - toggle.getBoundingClientRect().top) < 2);

    toggle.click();
    await wait(60);
    ok("caret button expands accordion", svc.classList.contains("open"));
    ok("accordion now has real height", panelH() > 40);
    ok("sub-item is reachable and visible",
       svc.querySelector(".dropdown-link").getBoundingClientRect().height > 10);
    ok("sub-item sits inside the drawer, indented",
       svc.querySelector(".dropdown-link").getBoundingClientRect().left
         >= drawer.getBoundingClientRect().left);

    toggle.click();
    await wait(60);
    ok("caret button collapses accordion", !svc.classList.contains("open") && panelH() < 1);

    toggle.click(); await wait(60);
    svc.querySelector(".dropdown-link").click();
    await wait(60);
    ok("clicking a sub-item closes the drawer", !drawer.classList.contains("open"));
    ok("clicking a sub-item collapses the accordion", !svc.classList.contains("open"));

    var cta = document.querySelector(".nav-cta");
    ok("CTA stretches full width in drawer",
       Math.abs(cta.getBoundingClientRect().width - drawer.getBoundingClientRect().width) < 40);

    ok("no horizontal page overflow", document.documentElement.scrollWidth <= 391);
  } catch (err) { R.push("ERROR :: " + err.message); }
  document.getElementById("TESTOUT").textContent = "ZRESULTSTART" + R.join(" ~ ") + "ZRESULTEND";
}, 700); });
</script>
"""

open(os.path.join(ROOT, "_test_mobile.html"), "w", encoding="utf-8").write(src.replace("</body>", MOBILE_JS + "</body>"))
print("mobile harness written")



# Disable transitions so layout/state is observable immediately under virtual time.
src = src.replace("</head>", "<style>*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}</style></head>")

MOBILE_JS = r"""
<div id="TESTOUT">PENDING</div>
<script>
var R = [];
function ok(n, c) { R.push((c ? "PASS" : "FAIL") + " :: " + n); }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
window.addEventListener("load", function () { setTimeout(async function () {
  try {
    var burger = document.getElementById("hamburger");
    var drawer = document.getElementById("navLinks");
    var overlay = document.getElementById("navOverlay");
    var svc = document.querySelector("[data-dropdown]");
    var toggle = svc.querySelector(".nav-dropdown-toggle");
    var panel = svc.querySelector(".dropdown");

    ok("viewport is mobile width", window.innerWidth <= 820);
    ok("hamburger is visible", getComputedStyle(burger).display !== "none");
    ok("drawer starts off-screen", drawer.getBoundingClientRect().left >= window.innerWidth - 1);

    burger.click();
    await wait(60);
    ok("hamburger opens drawer", drawer.classList.contains("open"));
    ok("hamburger aria-expanded=true", burger.getAttribute("aria-expanded") === "true");
    ok("overlay shown", overlay.classList.contains("show"));

    var panelH = function () { return panel.getBoundingClientRect().height; };
    ok("accordion starts collapsed", panelH() < 1);
    ok("parent link and caret share one row",
       Math.abs(svc.querySelector(".nav-link-parent").getBoundingClientRect().top
              - toggle.getBoundingClientRect().top) < 2);

    toggle.click();
    await wait(60);
    ok("caret button expands accordion", svc.classList.contains("open"));
    ok("accordion now has real height", panelH() > 40);
    ok("sub-item is reachable and visible",
       svc.querySelector(".dropdown-link").getBoundingClientRect().height > 10);
    ok("sub-item sits inside the drawer, indented",
       svc.querySelector(".dropdown-link").getBoundingClientRect().left
         >= drawer.getBoundingClientRect().left);

    toggle.click();
    await wait(60);
    ok("caret button collapses accordion", !svc.classList.contains("open") && panelH() < 1);

    toggle.click(); await wait(60);
    svc.querySelector(".dropdown-link").click();
    await wait(60);
    ok("clicking a sub-item closes the drawer", !drawer.classList.contains("open"));
    ok("clicking a sub-item collapses the accordion", !svc.classList.contains("open"));

    var cta = document.querySelector(".nav-cta");
    ok("CTA stretches full width in drawer",
       Math.abs(cta.getBoundingClientRect().width - drawer.getBoundingClientRect().width) < 34);

    document.documentElement.style.width = "390px";
    ok("no horizontal page overflow", document.documentElement.scrollWidth <= 391);
  } catch (err) { R.push("ERROR :: " + err.message); }
  document.getElementById("TESTOUT").textContent = "ZRESULTSTART" + R.join(" ~ ") + "ZRESULTEND";
}, 700); });
</script>
"""

open(os.path.join(ROOT, "_test_mobile.html"), "w", encoding="utf-8").write(src.replace("</body>", MOBILE_JS + "</body>"))
print("mobile harness written")
