/* ==========================================================
   CyberSafe RD - JavaScript (versión 1)
   Funciones:
   1. Marcar que JavaScript está activo
   2. Menú de navegación en móvil
   3. Resaltar el enlace de la sección visible
   4. Año actual en el pie de página
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
});