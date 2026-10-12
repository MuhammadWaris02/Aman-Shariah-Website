import re, os
ROOT = r"e:\AmanShariah Website\aman-website"
h = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

TEST_JS = r"""
<div id="TESTOUT">PENDING</div>
<script>
var R = [];
function ok(n, c) { R.push((c ? "PASS" : "FAIL") + " :: " + n); }
function key(el, k) { el.dispatchEvent(new KeyboardEvent("keydown", {key: k, bubbles: true, cancelable: true})); }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
window.addEventListener("load", function () { setTimeout(async function () {
  try {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-dropdown]"));
    ok("two dropdown groups rendered", items.length === 2);
    var svc = items[0], res = items[1];
    var st = svc.querySelector(".nav-dropdown-toggle"), rt = res.querySelector(".nav-dropdown-toggle");
    var panel = svc.querySelector(".dropdown");
    ok("aria-controls resolves to a real panel", !!document.getElementById(st.getAttribute("aria-controls")));
    ok("panel hidden by default", getComputedStyle(panel).visibility === "hidden");
    ok("Services has 6 sub-items + 1 footer link",
       svc.querySelectorAll(".dropdown-link").length === 6 && !!svc.querySelector(".dropdown-all"));

    st.click();
    ok("click opens Services", svc.classList.contains("open"));
    ok("click sets aria-expanded=true", st.getAttribute("aria-expanded") === "true");
    ok("panel is focusable straight after open (no deferred visibility)",
       (function () { panel.querySelector(".dropdown-link").focus();
                      return document.activeElement === panel.querySelector(".dropdown-link"); })());
    ok("caret rotates via .open rule", getComputedStyle(svc.querySelector(".nav-caret")).transform !== "none");

    rt.click();
    ok("only one menu open at a time", res.classList.contains("open") && !svc.classList.contains("open"));

    document.body.click();
    ok("outside click closes all", !res.classList.contains("open") && rt.getAttribute("aria-expanded") === "false");

    st.click(); await wait(60);
    key(document.activeElement || st, "Escape");
    ok("Escape closes menu", !svc.classList.contains("open"));

    st.focus(); key(st, "ArrowDown");
    var ae = document.activeElement;
    R.push("DEBUG::afterArrowDown open=" + svc.classList.contains("open")
      + " expanded=" + st.getAttribute("aria-expanded")
      + " activeElement=<" + ae.tagName + "." + ae.className + "> text=\"" + (ae.textContent || "").trim().slice(0, 28) + "\"");
    ok("ArrowDown opens and focuses FIRST item",
       svc.classList.contains("open") && svc.querySelector(".dropdown-link") === document.activeElement);
    key(document.activeElement, "ArrowDown");
    ok("ArrowDown moves to 2nd item", svc.querySelectorAll(".dropdown-link")[1] === document.activeElement);
    key(document.activeElement, "End");
    ok("End jumps to footer link", svc.querySelector(".dropdown-all") === document.activeElement);
    key(document.activeElement, "ArrowUp");
    ok("ArrowUp moves back to 6th item", svc.querySelectorAll(".dropdown-link")[5] === document.activeElement);
    key(document.activeElement, "Home");
    ok("Home jumps to first item", svc.querySelector(".dropdown-link") === document.activeElement);
    key(document.activeElement, "Escape");
    ok("Escape returns focus to caret button", document.activeElement === st);

    window.scrollTo({top: 600, behavior: "instant"});
    window.dispatchEvent(new Event("scroll"));
    await wait(150);
    ok("scroll actually moved (scrollY>40)", window.scrollY > 40);
    ok("menus close on scroll", !svc.classList.contains("open"));
    ok("navbar gains .scrolled on scroll", document.getElementById("navbar").classList.contains("scrolled"));

    window.scrollTo({top: 0, behavior: "instant"}); window.dispatchEvent(new Event("scroll"));
    await wait(120);
    var inner = document.querySelector(".nav-inner").getBoundingClientRect();
    var linksBox = document.querySelector(".nav-links").getBoundingClientRect();
    ok("desktop nav fits inside the viewport (no overflow)",
       inner.left >= -0.5 && linksBox.right <= window.innerWidth + 0.5);
    ok("brand and CTA do not overlap",
       document.querySelector(".brand").getBoundingClientRect().right <= linksBox.left + 0.5);
  } catch (err) { R.push("ERROR :: " + err.message); }
  document.getElementById("TESTOUT").textContent = "ZRESULTSTART" + R.join(" ~ ") + "ZRESULTEND";
}, 700); });
</script>
"""

h = h.replace("</body>", TEST_JS + "</body>")
open(os.path.join(ROOT, "_test_nav.html"), "w", encoding="utf-8").write(h)
print("harness written, bytes:", len(h))
