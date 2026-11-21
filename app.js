// ==================== AVENTURA AZUL · PÁGINA ====================
(function () {
  var IDIOMAS = ["es", "en", "pt", "fr"];
  var NOMBRES = { // nombres de personajes que cambian según el idioma
    "Pirata": { en: "Pirate", fr: "Pirate" },
    "Astronauta": { en: "Astronaut", fr: "Astronaute" }
  };
  var selector = document.getElementById("idioma");

  function guardado() {
    try { return localStorage.getItem("idioma"); } catch (e) { return null; }
  }
  function guardar(i) {
    try { localStorage.setItem("idioma", i); } catch (e) {}
  }
  function delNavegador() {
    var l = (navigator.languages && navigator.languages[0]) || navigator.language || "es";
    l = l.slice(0, 2).toLowerCase();
    return IDIOMAS.indexOf(l) >= 0 ? l : "es";
  }

  function aplicar(idioma) {
    var t = window.I18N[idioma] || window.I18N.es;
    document.documentElement.lang = idioma;
    document.title = t["meta.title"];
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t["meta.desc"]);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n")];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-html")];
      if (typeof v === "string") el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-list]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-list")];
      if (!Array.isArray(v)) return;
      el.innerHTML = "";
      v.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; el.appendChild(li); });
    });
    document.querySelectorAll("[data-src-idioma]").forEach(function (img) {
      img.src = img.getAttribute("data-src-idioma").replace("{idioma}", idioma);
    });
    document.querySelectorAll(".personajes figcaption").forEach(function (fc) {
      var base = fc.getAttribute("data-base") || fc.textContent;
      fc.setAttribute("data-base", base);
      fc.textContent = (NOMBRES[base] && NOMBRES[base][idioma]) || base;
    });
    selector.value = idioma;
  }

  var inicial = guardado();
  if (IDIOMAS.indexOf(inicial) < 0) inicial = delNavegador();
  aplicar(inicial);
  selector.addEventListener("change", function () { guardar(selector.value); aplicar(selector.value); });

  // Menú en pantallas pequeñas
  var menu = document.getElementById("menu");
  var ham = document.getElementById("hamburguesa");
  ham.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    ham.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { menu.classList.remove("abierto"); ham.setAttribute("aria-expanded", "false"); });
  });

  // Sombra de la barra al bajar
  var barra = document.getElementById("barra");
  function sombra() { barra.classList.toggle("con-sombra", window.scrollY > 8); }
  window.addEventListener("scroll", sombra, { passive: true }); sombra();

  // Flechas de la galería
  var pista = document.getElementById("galeria-pista");
  function mover(dir) {
    var fig = pista.querySelector("figure");
    var paso = fig ? fig.getBoundingClientRect().width + 22 : 400;
    pista.scrollBy({ left: dir * paso, behavior: "smooth" });
  }
  document.getElementById("galeria-ant").addEventListener("click", function () { mover(-1); });
  document.getElementById("galeria-sig").addEventListener("click", function () { mover(1); });
})();
