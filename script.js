/* ==========================================================
   CyberSafe RD - JavaScript (versión 1)
   Funciones:
   1. Marcar que JavaScript está activo
   2. Menú de navegación en móvil
   3. Resaltar el enlace de la sección visible
   4. Año actual en el pie de página
   5. Listas de verificación de las lecciones de Academy
   6. Animaciones al hacer scroll
   ========================================================== */

// 1. Le avisa al CSS que JavaScript funciona (el menú móvil queda cerrado por defecto)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const botonMenu = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#menu-principal");
  const enlaces = document.querySelectorAll(".nav-links a");

  // 2. Menú de navegación en móvil
  function abrirCerrarMenu(abrir) {
    menu.classList.toggle("is-open", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
  }

  botonMenu.addEventListener("click", () => {
    const estaAbierto = botonMenu.getAttribute("aria-expanded") === "true";
    abrirCerrarMenu(!estaAbierto);
  });

  // Cierra el menú al elegir un enlace
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", () => abrirCerrarMenu(false));
  });

  // Cierra el menú con la tecla Escape
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      abrirCerrarMenu(false);
    }
  });

  // 3. Resalta en el menú la sección que se está viendo
  const secciones = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            enlaces.forEach((enlace) => {
              const coincide = enlace.getAttribute("href") === "#" + entrada.target.id;
              enlace.classList.toggle("is-active", coincide);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" } // detecta la sección en el centro de la pantalla
    );

    secciones.forEach((seccion) => observador.observe(seccion));
  }

  // 4. Año actual en el pie de página
  const anio = document.querySelector("#anio-actual");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // 5. Listas de verificación de las lecciones (solo cuentan lo marcado; no se guarda nada)
  document.querySelectorAll("[data-checklist]").forEach((lista) => {
    const casillas = lista.querySelectorAll('input[type="checkbox"]');
    const barra = lista.querySelector(".checklist-bar");
    const contador = lista.querySelector(".checklist-count");

    function actualizar() {
      const hechas = lista.querySelectorAll('input[type="checkbox"]:checked').length;
      barra.value = hechas;
      contador.textContent =
        hechas === casillas.length
          ? "¡Lista completa! " + hechas + " de " + casillas.length
          : hechas + " de " + casillas.length + " completadas";
    }

    casillas.forEach((casilla) => casilla.addEventListener("change", actualizar));
    actualizar();
  });

  // 6. Animaciones al hacer scroll: cada elemento aparece una sola vez al entrar en pantalla.
  //    Se omiten si la persona prefiere menos movimiento o el navegador no soporta IntersectionObserver.
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !menosMovimiento) {
    // [selector, clase extra]. El orden define quién aparece primero cuando salen juntos.
    const grupos = [
      [".hero-visual", "reveal-zoom"],
      [".hero h1, .hero-description, .hero .btn", ""],
      [".section-heading, .section .glass-card", ""],
      [".lesson-hero .container > *", ""],
      [".lesson-section, .lesson-nav", ""]
    ];

    const elementos = new Set();
    grupos.forEach(([selector, extra]) => {
      document.querySelectorAll(selector).forEach((elemento) => {
        if (extra) elemento.classList.add(extra);
        elementos.add(elemento);
      });
    });

    const observadorReveal = new IntersectionObserver(
      (entradas) => {
        let orden = 0;
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          // Los elementos que aparecen a la vez se escalonan 0,08 s (máximo 0,32 s)
          entrada.target.style.setProperty("--retraso", Math.min(orden * 0.08, 0.32) + "s");
          entrada.target.classList.add("is-visible");
          observadorReveal.unobserve(entrada.target);
          orden++;
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    elementos.forEach((elemento) => {
      elemento.classList.add("reveal");
      observadorReveal.observe(elemento);
    });
  }
});