/* ==========================================================
   CyberSafe RD - Cyber Quiz: lógica del cuestionario
   Las preguntas viven en quiz-data.js (ahí se editan).
   Nada se guarda ni se envía: todo ocurre en la memoria del navegador.

   Organización:
   1. Referencias y estado
   2. Utilidades
   3. Pantallas: inicio, pregunta, resultados
   4. Eventos
   ========================================================== */
(function () {
  "use strict";

  const datos = window.CYBERQUIZ_DATOS;
  const tarjeta = document.getElementById("quiz");
  if (!datos || !tarjeta) return;

  /* ---------- 1. Referencias y estado ---------- */
  const $ = (id) => document.getElementById(id);
  const total = datos.preguntas.length;
  const LETRAS = ["A", "B", "C", "D"];
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pantallas = {
    inicio: $("quiz-inicio"),
    pregunta: $("quiz-pregunta"),
    resultados: $("quiz-resultados")
  };

  let preguntas = [];     // preguntas del intento actual (con opciones mezcladas)
  let indice = 0;         // pregunta que se muestra
  let respuestas = [];    // { indice, elegida, acierto } por cada pregunta respondida
  let bloqueada = false;  // evita responder dos veces la misma pregunta
  let animacion = null;

  /* ---------- 2. Utilidades ---------- */
  function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;   // textContent: nunca interpreta HTML
    return elemento;
  }

  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // Copia las preguntas y mezcla las opciones, recordando cuál es la correcta
  function prepararPreguntas() {
    return datos.preguntas.map((p) => ({
      tema: p.tema,
      pregunta: p.pregunta,
      explicacion: p.explicacion,
      opciones: mezclar(p.opciones.map((texto, i) => ({ texto, correcta: i === p.correcta })))
    }));
  }

  function nombreTema(clave) {
    return datos.temas[clave] ? datos.temas[clave].nombre : clave;
  }

  function mostrarPantalla(nombre) {
    Object.keys(pantallas).forEach((clave) => {
      pantallas[clave].hidden = clave !== nombre;
    });
    const activa = pantallas[nombre];
    activa.classList.remove("quiz-entra");
    void activa.offsetWidth;                 // reinicia la animación de entrada
    activa.classList.add("quiz-entra");
  }

  function irAlInicioDeLaTarjeta() {
    tarjeta.scrollIntoView({ block: "start", behavior: menosMovimiento ? "auto" : "smooth" });
  }

  // Avisa en la consola si una pregunta está mal escrita (ayuda al editar quiz-data.js)
  function validarDatos() {
    datos.preguntas.forEach((p, n) => {
      if (!p.opciones || p.opciones.length !== 4) console.warn("Cyber Quiz: la pregunta " + (n + 1) + " debe tener 4 opciones.");
      if (!(p.correcta >= 0 && p.correcta < 4)) console.warn("Cyber Quiz: la pregunta " + (n + 1) + " tiene un valor 'correcta' inválido.");
      if (!datos.temas[p.tema]) console.warn("Cyber Quiz: la pregunta " + (n + 1) + " usa el tema '" + p.tema + "', que no existe en 'temas'.");
    });
  }

  /* ---------- 3. Pantallas ---------- */
  function empezar() {
    preguntas = prepararPreguntas();
    indice = 0;
    respuestas = [];
    mostrarPregunta();
    mostrarPantalla("pregunta");
    $("quiz-texto").focus({ preventScroll: true });
    irAlInicioDeLaTarjeta();
  }

  function mostrarPregunta() {
    const p = preguntas[indice];
    bloqueada = false;

    $("quiz-contador").textContent = "Pregunta " + (indice + 1) + " de " + total;
    $("quiz-tema").textContent = nombreTema(p.tema);
    $("quiz-texto").textContent = p.pregunta;

    const barra = $("quiz-progreso");
    barra.max = total;
    barra.value = indice;                    // preguntas completadas hasta ahora

    const lista = $("quiz-opciones");
    lista.textContent = "";
    p.opciones.forEach((opcion, i) => {
      const item = document.createElement("li");
      const boton = crear("button", "quiz-opcion");
      boton.type = "button";
      boton.appendChild(crear("span", "quiz-letra", LETRAS[i]));
      boton.appendChild(crear("span", "quiz-opcion-texto", opcion.texto));
      boton.addEventListener("click", () => responder(i));
      item.appendChild(boton);
      lista.appendChild(item);
    });

    $("quiz-feedback-zona").textContent = "";
    $("quiz-acciones").hidden = true;
  }

  function responder(i) {
    if (bloqueada) return;
    bloqueada = true;

    const p = preguntas[indice];
    const acierto = p.opciones[i].correcta;
    const letraCorrecta = LETRAS[p.opciones.findIndex((o) => o.correcta)];
    respuestas.push({ indice, elegida: i, acierto });

    // Marca las opciones: la correcta en verde y, si fallaste, la elegida en rojo
    $("quiz-opciones").querySelectorAll(".quiz-opcion").forEach((boton, k) => {
      boton.disabled = true;
      const contenido = boton.querySelector(".quiz-opcion-texto");
      if (p.opciones[k].correcta) {
        boton.classList.add("is-correcta");
        contenido.appendChild(crear("span", "quiz-estado", "✓ Respuesta correcta"));
      } else if (k === i) {
        boton.classList.add("is-incorrecta");
        contenido.appendChild(crear("span", "quiz-estado", "✗ Tu respuesta"));
      }
    });

    // Retroalimentación con la explicación (la zona avisa a los lectores de pantalla)
    const feedback = crear("div", "quiz-feedback " + (acierto ? "ok" : "error"));
    feedback.appendChild(crear("p", "quiz-feedback-titulo", acierto ? "✓ ¡Correcto!" : "✗ Incorrecto"));
    feedback.appendChild(crear("p", "", (acierto ? "" : "La respuesta correcta es la " + letraCorrecta + ". ") + p.explicacion));
    $("quiz-feedback-zona").textContent = "";
    $("quiz-feedback-zona").appendChild(feedback);

    $("quiz-progreso").value = indice + 1;
    $("quiz-siguiente").textContent = indice === total - 1 ? "Ver resultados" : "Siguiente pregunta";
    $("quiz-acciones").hidden = false;
    $("quiz-siguiente").focus({ preventScroll: true });
    $("quiz-acciones").scrollIntoView({ block: "nearest", behavior: menosMovimiento ? "auto" : "smooth" });
  }

  function siguiente() {
    if (indice < total - 1) {
      indice++;
      mostrarPregunta();
      $("quiz-texto").focus({ preventScroll: true });
      irAlInicioDeLaTarjeta();
    } else {
      mostrarResultados();
    }
  }

  // Cuenta animada del anillo de puntuación
  function fijarPuntaje(valor) {
    $("quiz-puntaje").style.setProperty("--p", valor);
    $("quiz-puntaje-numero").textContent = valor;
  }

  function animarPuntaje(objetivo) {
    cancelAnimationFrame(animacion);
    if (menosMovimiento || objetivo === 0) {
      fijarPuntaje(objetivo);
      return;
    }
    const inicio = performance.now();
    const duracion = 900;
    fijarPuntaje(0);
    function paso(ahora) {
      const t = Math.min((ahora - inicio) / duracion, 1);
      fijarPuntaje(Math.round(objetivo * (1 - Math.pow(1 - t, 3))));
      if (t < 1) animacion = requestAnimationFrame(paso);
    }
    animacion = requestAnimationFrame(paso);
  }

  function mostrarResultados() {
    const correctas = respuestas.filter((r) => r.acierto).length;
    const incorrectas = total - correctas;
    const puntaje = Math.round((correctas / total) * 100);
    const nivel = datos.niveles.find((n) => puntaje >= n.min) || datos.niveles[datos.niveles.length - 1];

    $("quiz-puntaje").setAttribute("aria-label", "Puntuación: " + puntaje + " sobre 100");
    $("quiz-resultado-titulo").textContent = nivel.titulo;
    $("quiz-resultado-texto").textContent = nivel.texto;
    $("quiz-stat-correctas").textContent = correctas;
    $("quiz-stat-incorrectas").textContent = incorrectas;

    mostrarRecomendaciones();
    mostrarRevision();

    mostrarPantalla("resultados");
    animarPuntaje(puntaje);
    $("quiz-resultado-titulo").focus({ preventScroll: true });
    irAlInicioDeLaTarjeta();
  }

  // Un consejo por cada tema donde hubo errores, empezando por el que más falló
  function mostrarRecomendaciones() {
    const errores = {};
    respuestas.forEach((r) => {
      if (!r.acierto) {
        const tema = preguntas[r.indice].tema;
        errores[tema] = (errores[tema] || 0) + 1;
      }
    });

    const lista = $("quiz-recs");
    lista.textContent = "";
    const temas = Object.keys(errores).sort((a, b) => errores[b] - errores[a]);

    if (temas.length === 0) {
      const item = document.createElement("li");
      item.className = "quiz-rec";
      item.appendChild(crear("h4", "", "¡Sin errores!"));
      item.appendChild(crear("p", "", datos.mensajePerfecto));
      lista.appendChild(item);
      return;
    }

    temas.forEach((tema) => {
      const info = datos.temas[tema] || { nombre: tema, recomendacion: "" };
      const item = document.createElement("li");
      item.className = "quiz-rec";
      item.appendChild(crear("h4", "", info.nombre + " · " + errores[tema] + (errores[tema] === 1 ? " error" : " errores")));
      if (info.recomendacion) item.appendChild(crear("p", "", info.recomendacion));
      if (info.leccion) {
        const enlace = crear("a", "", info.leccion.texto + " →");
        enlace.href = info.leccion.url;
        item.appendChild(enlace);
      }
      lista.appendChild(item);
    });
  }

  // Lista desplegable con cada pregunta, tu respuesta y la correcta
  function mostrarRevision() {
    const lista = $("quiz-revision-lista");
    lista.textContent = "";
    respuestas.forEach((r) => {
      const p = preguntas[r.indice];
      const item = document.createElement("li");
      const cabecera = crear("p", "quiz-rev-pregunta");
      cabecera.appendChild(crear("strong", "quiz-tag " + (r.acierto ? "ok" : "error"), r.acierto ? "✓ Correcta" : "✗ Incorrecta"));
      cabecera.appendChild(document.createTextNode(" " + p.pregunta));
      item.appendChild(cabecera);
      if (!r.acierto) item.appendChild(crear("p", "quiz-rev-linea", "Tu respuesta: " + p.opciones[r.elegida].texto));
      item.appendChild(crear("p", "quiz-rev-linea", "Respuesta correcta: " + p.opciones.find((o) => o.correcta).texto));
      lista.appendChild(item);
    });
  }

  /* ---------- 4. Eventos ---------- */
  document.querySelectorAll("[data-quiz-total]").forEach((el) => { el.textContent = total; });
  $("quiz-comenzar").addEventListener("click", empezar);
  $("quiz-siguiente").addEventListener("click", siguiente);
  $("quiz-repetir").addEventListener("click", empezar);

  validarDatos();
})();
