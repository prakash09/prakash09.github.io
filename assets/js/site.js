/* ============================================================
 * THE CANDOR — site behaviour
 *
 * Vanilla, no dependencies, deferred. Every visual effect here
 * is progressive: with JS off the page is fully readable, and
 * anything animated is skipped under prefers-reduced-motion.
 * ============================================================ */
(function () {
  "use strict";

  /* ---- Masthead: earn the border only once scrolled --------- */
  var masthead = document.getElementById("masthead");
  var progress = document.getElementById("progress");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (masthead) {
      masthead.classList.toggle("is-stuck", y > 8);
    }

    if (progress) {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? y / scrollable : 0;
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;
      // scaleX only — this can never trigger layout.
      progress.style.transform = "scaleX(" + ratio + ")";
    }
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ---- Mobile nav ------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navSheet = document.getElementById("navSheet");

  if (navToggle && navSheet) {
    var setNav = function (open) {
      navSheet.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", function () {
      setNav(!navSheet.classList.contains("is-open"));
    });

    // Same-page anchors would otherwise leave the sheet covering the
    // thing the reader just asked to see.
    navSheet.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navSheet.classList.contains("is-open")) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ---- Theme toggle ------------------------------------------ */
  // The system setting decides until the reader picks; the pick is stored
  // and applied by the inline script in <head> on every later page.
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
  }

  function syncTheme() {
    // Browser chrome follows the page, including an explicit choice that
    // disagrees with the system setting.
    var canvas = window.getComputedStyle(root).getPropertyValue("--c-canvas").trim();
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var c = 0; c < metas.length; c++) metas[c].setAttribute("content", canvas);

    if (themeToggle) {
      var other = currentTheme() === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", "Switch to " + other + " theme");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("theme", next);
      } catch (e) {}
      syncTheme();
    });
  }

  if (systemDark.addEventListener) systemDark.addEventListener("change", syncTheme);
  syncTheme();

  /* ---- Code blocks: language label + copy -------------------- */
  var blocks = document.querySelectorAll(".prose div.highlighter-rouge");

  var addCodeBar = function (block) {
    var code = block.querySelector("pre code") || block.querySelector("pre");
    if (!code) return;

    var bar = document.createElement("div");
    bar.className = "code__bar";

    var lang = (block.className.match(/language-([\w+#-]+)/) || [])[1];
    if (lang && lang !== "plaintext") {
      var label = document.createElement("span");
      label.textContent = lang;
      bar.appendChild(label);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      var copy = document.createElement("button");
      copy.className = "code__copy";
      copy.type = "button";
      copy.textContent = "Copy";

      copy.addEventListener("click", function () {
        navigator.clipboard.writeText(code.textContent).then(function () {
          copy.textContent = "Copied";
          copy.classList.add("is-done");
          window.setTimeout(function () {
            copy.textContent = "Copy";
            copy.classList.remove("is-done");
          }, 1800);
        }, function () {});
      });

      bar.appendChild(copy);
    }

    if (bar.firstChild) block.insertBefore(bar, block.firstChild);
  };

  for (var b = 0; b < blocks.length; b++) addCodeBar(blocks[b]);

  /* ---- Wrap wide tables so the page never scrolls sideways --- */
  var tables = document.querySelectorAll(".prose table");
  for (var t = 0; t < tables.length; t++) {
    var table = tables[t];
    if (table.parentNode.classList.contains("table-scroll")) continue;
    var wrap = document.createElement("div");
    wrap.className = "table-scroll";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  }

  /* ---- Table of contents + scroll-spy ----------------------- */
  var toc = document.getElementById("toc");
  var body = document.getElementById("postBody");

  if (toc && body) {
    var headings = body.querySelectorAll("h2, h3");
    var links = [];

    if (headings.length >= 3) {
      var list = document.createElement("ul");
      list.className = "toc__list";

      for (var h = 0; h < headings.length; h++) {
        var heading = headings[h];

        if (!heading.id) {
          heading.id =
            "s-" +
            heading.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") +
            "-" +
            h;
        }

        var item = document.createElement("li");
        item.className =
          "toc__item toc__item--" + heading.tagName.toLowerCase();

        var link = document.createElement("a");
        link.className = "toc__link";
        link.href = "#" + heading.id;
        link.textContent = heading.textContent;

        item.appendChild(link);
        list.appendChild(item);
        links.push({ link: link, heading: heading });
      }

      toc.appendChild(list);
      toc.hidden = false;

      // Scroll-spy: the last heading above the read-line wins.
      var spy = function () {
        var line = window.scrollY + 140;
        var active = null;

        for (var k = 0; k < links.length; k++) {
          if (links[k].heading.offsetTop <= line) active = links[k];
        }

        for (var m = 0; m < links.length; m++) {
          links[m].link.classList.toggle(
            "is-active",
            active !== null && links[m] === active
          );
        }
      };

      var spyTicking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (spyTicking) return;
          spyTicking = true;
          window.requestAnimationFrame(function () {
            spy();
            spyTicking = false;
          });
        },
        { passive: true }
      );
      spy();
    }
  }

  /* ---- Copy link -------------------------------------------- */
  var copyBtn = document.getElementById("copyLink");
  var toast = document.getElementById("copied");

  if (copyBtn && toast) {
    copyBtn.addEventListener("click", function () {
      var url = copyBtn.getAttribute("data-url") || window.location.href;

      var done = function () {
        toast.classList.add("is-shown");
        window.setTimeout(function () {
          toast.classList.remove("is-shown");
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () {});
      }
    });
  }

  /* ---- Search: focus with / or Cmd-K ------------------------ */
  var search = document.getElementById("search-input");

  if (search) {
    document.addEventListener("keydown", function (e) {
      var typing =
        document.activeElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);

      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        search.focus();
        search.select();
      }

      if (e.key === "Escape" && document.activeElement === search) {
        search.blur();
      }
    });
  }
})();
