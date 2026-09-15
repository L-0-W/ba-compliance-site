(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var mobile = document.querySelector(".nav-mobile");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function scrollToHash(hash, smooth) {
    if (!hash || hash === "#") return;
    var id = hash.replace(/^#/, "");
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }

  // Same-page anchor clicks (nav + in-page links)
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href^='#']");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href || href.length < 2) return;
    var el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();
    history.pushState(null, "", href);
    scrollToHash(href, true);
    if (mobile) {
      mobile.classList.remove("open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Handle load with hash
  if (location.hash) {
    setTimeout(function () {
      scrollToHash(location.hash, false);
    }, 50);
  }

  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  var sections = [];
  tocLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  function highlightToc() {
    if (!sections.length) return;
    var offset = 100;
    var current = sections[0].id;
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top - offset <= 0) current = s.id;
    });
    tocLinks.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }

  if (sections.length) {
    window.addEventListener("scroll", highlightToc, { passive: true });
    highlightToc();
  }
})();
