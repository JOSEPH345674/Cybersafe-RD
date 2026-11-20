/* ==========================================================
   CyberSafe RD - JavaScript (versión 1)
   Funciones:
   1. Marcar que JavaScript está activo
   2. Menú de navegación en móvil
   3. Resaltar el enlace de la sección visible
   4. Año actual en el pie de página
   5. Listas de verificación de las lecciones de Academy
   6. Animaciones al hacer scroll
   7. Temas y actividades de las secciones Estudiantes y Negocios
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
      [".section-heading, .section .glass-card, .tema-progreso, .tema-lista", ""],
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

  // 7. Temas y actividades de Estudiantes y Negocios.
  //    Pestañas accesibles (también con flechas del teclado) y actividades de comprobación.
  //    Todo ocurre en la página: no se guarda ni se envía nada.
  document.querySelectorAll("[data-temas]").forEach((zona) => {
    const pestanas = Array.from(zona.querySelectorAll('[role="tab"]'));
    const paneles = pestanas.map((p) => document.getElementById(p.getAttribute("aria-controls")));
    const total = pestanas.length;
    const textoProgreso = zona.querySelector(".tema-progreso-texto");
    const barra = zona.querySelector(".tema-barra");
    const botonReiniciar = zona.querySelector(".tema-reiniciar");

    function seleccionar(indice, opciones) {
      const { desplazar = false, enfocarPanel = false } = opciones || {};
      pestanas.forEach((pestana, k) => {
        const activa = k === indice;
        pestana.setAttribute("aria-selected", String(activa));
        pestana.tabIndex = activa ? 0 : -1;
        paneles[k].classList.toggle("is-activo", activa);
      });
      const panel = paneles[indice];
      if (!menosMovimiento) {
        panel.classList.remove("tema-entra");
        void panel.offsetWidth;                      // reinicia la animación
        panel.classList.add("tema-entra");
      }
      if (enfocarPanel) panel.focus({ preventScroll: true });
      if (desplazar) {
        const arriba = panel.getBoundingClientRect().top;
        if (arriba > window.innerHeight * 0.55 || arriba < 70) {
          panel.scrollIntoView({ block: "start", behavior: menosMovimiento ? "auto" : "smooth" });
        }
      }
    }

    pestanas.forEach((pestana, k) => {
      pestana.addEventListener("click", () => seleccionar(k, { desplazar: true }));
      pestana.addEventListener("keydown", (evento) => {
        let destino = null;
        if (evento.key === "ArrowRight" || evento.key === "ArrowDown") destino = (k + 1) % total;
        if (evento.key === "ArrowLeft" || evento.key === "ArrowUp") destino = (k - 1 + total) % total;
        if (evento.key === "Home") destino = 0;
        if (evento.key === "End") destino = total - 1;
        if (destino === null) return;
        evento.preventDefault();
        seleccionar(destino);
        pestanas[destino].focus();
      });
    });

    paneles.forEach((panel, k) => {
      const boton = panel.querySelector("[data-siguiente]");
      if (boton) boton.addEventListener("click", () => seleccionar((k + 1) % total, { desplazar: true, enfocarPanel: true }));
    });

    // Progreso: cuenta las actividades comprobadas y los aciertos
    function actualizarProgreso() {
      const hechas = paneles.filter((p) => p.dataset.estado).length;
      const aciertos = paneles.filter((p) => p.dataset.estado === "ok").length;
      let texto = "Actividades completadas: " + hechas + " de " + total;
      if (hechas > 0) texto += " · Aciertos: " + aciertos;
      if (hechas === total) texto += " · ¡Sección completada!";
      textoProgreso.textContent = texto;
      barra.value = hechas;
      botonReiniciar.hidden = hechas === 0;
    }

    function marcarPestana(indice, estado) {
      const pestana = pestanas[indice];
      if (estado) pestana.dataset.estado = estado; else delete pestana.dataset.estado;
      pestana.querySelector(".tema-estado").textContent = estado === "ok" ? "✓ Correcta" : estado === "error" ? "Repasar" : "";
    }

    function reiniciarActividad(indice) {
      const panel = paneles[indice];
      const actividad = panel.querySelector("[data-actividad]");
      actividad.querySelectorAll(".tema-opcion").forEach((o) => {
        o.disabled = false;
        o.setAttribute("aria-pressed", "false");
        o.classList.remove("is-correcta", "is-incorrecta");
      });
      actividad.querySelector(".tema-comprobar").hidden = false;
      actividad.querySelector(".tema-comprobar").disabled = true;
      actividad.querySelector(".tema-reintentar").hidden = true;
      actividad.querySelector(".tema-feedback").hidden = true;
      delete panel.dataset.estado;
      marcarPestana(indice, null);
    }

    paneles.forEach((panel, k) => {
      const actividad = panel.querySelector("[data-actividad]");
      const opciones = Array.from(actividad.querySelectorAll(".tema-opcion"));
      const comprobar = actividad.querySelector(".tema-comprobar");
      const reintentar = actividad.querySelector(".tema-reintentar");
      const feedback = actividad.querySelector(".tema-feedback");

      opciones.forEach((opcion) => {
        opcion.addEventListener("click", () => {
          if (opcion.disabled) return;
          opciones.forEach((o) => o.setAttribute("aria-pressed", String(o === opcion)));
          comprobar.disabled = false;
        });
      });

      comprobar.addEventListener("click", () => {
        const elegida = opciones.find((o) => o.getAttribute("aria-pressed") === "true");
        if (!elegida) return;
        const acierto = elegida.hasAttribute("data-correcta");
        opciones.forEach((o) => {
          o.disabled = true;
          if (o.hasAttribute("data-correcta")) o.classList.add("is-correcta");
          else if (o === elegida) o.classList.add("is-incorrecta");
        });
        feedback.className = "tema-feedback " + (acierto ? "ok" : "error");
        feedback.querySelector(".tema-feedback-titulo").textContent = acierto
          ? "✓ ¡Correcto!"
          : "✗ No es la mejor opción. La respuesta correcta está resaltada.";
        feedback.querySelector(".tema-feedback-texto").textContent = actividad.querySelector(".tema-explicacion").textContent;
        feedback.hidden = false;
        comprobar.hidden = true;
        reintentar.hidden = false;
        panel.dataset.estado = acierto ? "ok" : "error";
        marcarPestana(k, acierto ? "ok" : "error");
        actualizarProgreso();
      });

      reintentar.addEventListener("click", () => {
        reiniciarActividad(k);
        actualizarProgreso();
        opciones[0].focus();
      });
    });

    botonReiniciar.addEventListener("click", () => {
      paneles.forEach((_, k) => reiniciarActividad(k));
      actualizarProgreso();
      seleccionar(0, { desplazar: true });
    });

    actualizarProgreso();
  });
});