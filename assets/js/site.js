/* ============================================================
 * THE CANDOR — site behaviour
 *
 * Vanilla, no dependencies, deferred. Every visual effect here
 * is progressive: with JS off the page is fully readable, and
 * anything animated is skipped under prefers-reduced-motion.
 * ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---- Reveal on scroll ------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    // No observer, no motion preference: just show everything.
    for (var i = 0; i < reveals.length; i++) {
      reveals[i].classList.add("is-in");
    }
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    for (var j = 0; j < reveals.length; j++) {
      // Stagger within a group without touching layout.
      reveals[j].style.transitionDelay = Math.min(j % 6, 5) * 45 + "ms";
      io.observe(reveals[j]);
    }
  }

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
