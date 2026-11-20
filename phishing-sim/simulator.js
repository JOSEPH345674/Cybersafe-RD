/* ==========================================================
   CyberSafe RD - Phishing Simulator
   Todo es FICTICIO: no se envía ni se abre nada real, no se piden
   datos y no se guarda información. Los dominios usan la terminación
   reservada ".example" (nunca existen en internet).

   Organización de este archivo:
   1. DATOS EDITABLES: escenarios, recomendaciones y niveles
   2. Lógica del simulador (no hace falta tocarla para cambiar contenido)

   Cómo se escribe un escenario (ver la sección 1):
   - Para resaltar una parte del mensaje con una pista usa [[n|texto]].
     "n" es el número de la pista (en "pistas") y "texto" lo que se resalta.
     Los resaltados solo se ven DESPUÉS de que la persona decide.
   - "tipo" puede ser "correo", "sms", "mensaje" o "servicio".
   - "esPhishing": true si es fraude, false si es legítimo.
   - "senales": categorías que se le pasaron a quien falla un phishing
     (dominio, urgencia, enlace, datos, pago, suplantacion).
   ========================================================== */

/* ==========================================================
   1. DATOS EDITABLES
   ========================================================== */

const ESCENARIOS = [
  {
    id: "banco-alerta",
    tipo: "correo",
    esPhishing: true,
    tema: "banco",
    contexto: "Eres cliente de Banco Ejemplo y llevas días sin recibir ningún aviso de tu cuenta.",
    remitente: { nombre: "Banco Ejemplo Seguridad", direccion: "seguridad@banco-ejemplo.[[1|cuentas-verificar.example]]" },
    para: "estudiante@example.com",
    asunto: "[[2|URGENTE]]: tu cuenta será bloqueada hoy",
    fecha: "Hoy, 7:42 a. m.",
    cuerpo: [
      "Estimado cliente:",
      "Detectamos actividad inusual en su cuenta. Si no verifica sus datos [[2|en las próximas 2 horas]], su cuenta será suspendida de forma permanente.",
      "Para evitarlo, ingrese ahora con su usuario, [[4|su clave y el código que recibirá por SMS]]:"
    ],
    enlaces: [
      { texto: "[[3|www.banco-ejemplo.example/verificar]]", destino: "https://banco-ejemplo.cuentas-verificar.example/ingreso", dominioReal: "cuentas-verificar.example" }
    ],
    pistas: [
      { n: 1, tipo: "alerta", titulo: "Dominio falso", texto: "La dirección termina en cuentas-verificar.example, no en banco-ejemplo.example. El dominio real es lo que está justo antes de la terminación; «banco-ejemplo» solo está puesto delante para engañar." },
      { n: 2, tipo: "alerta", titulo: "Urgencia artificial", texto: "Un plazo de 2 horas y la amenaza de suspender la cuenta buscan que actúes sin pensar." },
      { n: 3, tipo: "alerta", titulo: "Enlace engañoso", texto: "El texto del enlace parece del banco, pero el destino real (míralo tocando el enlace) es otro dominio." },
      { n: 4, tipo: "alerta", titulo: "Pide información sensible", texto: "Ningún banco pide tu clave ni el código SMS por un enlace." }
    ],
    senales: ["dominio", "urgencia", "enlace", "datos"],
    resumen: "Phishing: alerta bancaria falsa con un dominio que imita al del banco."
  },
  {
    id: "paquete-sms",
    tipo: "sms",
    esPhishing: true,
    tema: "paquetes",
    contexto: "No tienes ninguna compra ni envío pendiente en estos días.",
    remitente: { nombre: "[[1|+1 809 555 0142]]", direccion: "" },
    fecha: "Hoy, 10:05 a. m.",
    cuerpo: [
      "EnvíoRápido: tu paquete no pudo entregarse. [[2|Hoy es el último día]] para reprogramar. [[3|Paga una tasa de RD$85]] aquí:"
    ],
    enlaces: [
      { texto: "[[4|enviorapido-aduana.example/pago]]", destino: "http://enviorapido-aduana.example/pago", dominioReal: "enviorapido-aduana.example" }
    ],
    pistas: [
      { n: 1, tipo: "alerta", titulo: "Remitente desconocido", texto: "Llega desde un número cualquiera, no desde un canal que la empresa de envíos use contigo, y no trae número de rastreo." },
      { n: 2, tipo: "alerta", titulo: "Urgencia artificial", texto: "«Hoy es el último día» busca que no verifiques si realmente esperas un paquete." },
      { n: 3, tipo: "alerta", titulo: "Pago inesperado", texto: "Te piden pagar una tasa por un envío del que no tienes constancia. Es una forma típica de robar datos de tarjeta." },
      { n: 4, tipo: "alerta", titulo: "Enlace sospechoso", texto: "El dominio (enviorapido-aduana.example) no es el de una empresa de envíos conocida y ni siquiera usa https." }
    ],
    senales: ["urgencia", "pago", "enlace"],
    resumen: "Phishing: SMS de paquete retenido que pide pagar una falsa tasa."
  },
  {
    id: "reset-correo",
    tipo: "correo",
    esPhishing: false,
    tema: "contrasenas",
    contexto: "Hace un minuto pediste restablecer tu contraseña desde la app de MiNube.",
    remitente: { nombre: "MiNube", direccion: "no-responder@[[1|minube.example]]" },
    para: "estudiante@example.com",
    asunto: "Tu código para restablecer la contraseña",
    fecha: "Hoy, 8:30 a. m.",
    cuerpo: [
      "Hola, Carlos:",
      "Recibimos una solicitud para restablecer la contraseña de tu cuenta. [[2|Tu código es 483 920 y vence en 10 minutos.]]",
      "[[3|Si no fuiste tú, ignora este mensaje y no compartas este código con nadie.]] Nunca te pediremos tu contraseña por correo."
    ],
    enlaces: [
      { texto: "Ir a minube.example", destino: "https://minube.example/restablecer", dominioReal: "minube.example", marca: 4 }
    ],
    pistas: [
      { n: 1, tipo: "ok", titulo: "El dominio coincide con el servicio", texto: "El correo viene de minube.example, el mismo dominio del servicio." },
      { n: 2, tipo: "ok", titulo: "Responde a algo que hiciste tú", texto: "Llega justo después de tu solicitud y solo trae un código temporal; no te pide tu contraseña." },
      { n: 3, tipo: "ok", titulo: "Te advierte que no compartas el código", texto: "Los mensajes legítimos te dicen qué hacer si no fuiste tú y no te presionan." },
      { n: 4, tipo: "ok", titulo: "El enlace lleva al mismo dominio", texto: "Al tocarlo verás que el destino es minube.example, igual que el remitente." }
    ],
    senales: [],
    resumen: "Legítimo: respuesta a una solicitud tuya, con dominio coincidente y sin pedir datos."
  },
  {
    id: "premio-correo",
    tipo: "correo",
    esPhishing: true,
    tema: "premios",
    contexto: "No recuerdas haber participado en ningún sorteo.",
    remitente: { nombre: "Sorteos TiendaFácil", direccion: "premios@[[1|tiendafacil-sorteos.example]]" },
    para: "estudiante@example.com",
    asunto: "¡Felicidades! Ganaste un teléfono nuevo",
    fecha: "Ayer, 6:15 p. m.",
    cuerpo: [
      "¡Eres uno de los afortunados ganadores! [[2|Fuiste elegido entre miles de clientes]] para recibir un teléfono de última generación.",
      "[[3|Tienes solo 24 horas]] para reclamarlo. [[4|Paga RD$150 de envío con tu tarjeta]] y lo recibirás mañana mismo."
    ],
    enlaces: [
      { texto: "Reclamar mi premio", destino: "https://reclamar-premio.tiendafacil-sorteos.example/pago", dominioReal: "tiendafacil-sorteos.example", marca: 5 }
    ],
    pistas: [
      { n: 1, tipo: "alerta", titulo: "Dominio que imita a una tienda", texto: "La tienda real sería tiendafacil.example. Este dominio es otro: le añadieron la palabra «sorteos» para parecer oficial." },
      { n: 2, tipo: "alerta", titulo: "Premio que no pediste", texto: "No participaste en ningún sorteo. Los premios falsos usan la ilusión de ganar para bajar tus defensas." },
      { n: 3, tipo: "alerta", titulo: "Urgencia artificial", texto: "El plazo de 24 horas evita que investigues." },
      { n: 4, tipo: "alerta", titulo: "Piden pagar para recibir un «regalo»", texto: "Un premio real no te cobra el envío. Lo que buscan son los datos de tu tarjeta." },
      { n: 5, tipo: "alerta", titulo: "Enlace a un sitio de pago falso", texto: "El destino real es una página de pago en un dominio ajeno a la tienda." }
    ],
    senales: ["dominio", "urgencia", "pago", "datos"],
    resumen: "Phishing: premio falso que pide un pago para «reclamarlo»."
  },
  {
    id: "proveedor-empresa",
    tipo: "correo",
    esPhishing: true,
    tema: "empresa",
    contexto: "Tienes un pequeño negocio y pagas cada mes a Suministros Delta, tu proveedor de siempre.",
    remitente: { nombre: "Laura Pérez · Suministros Delta", direccion: "facturacion@suministros-delta.example" },
    responderA: "cobros@[[2|suministros-delta-pagos.example]]",
    para: "contabilidad@example.com",
    asunto: "Cambio de cuenta bancaria para la factura #1042",
    fecha: "Hoy, 11:20 a. m.",
    cuerpo: [
      "Buenos días:",
      "Les informamos que [[1|hemos cambiado nuestra cuenta bancaria]]. Por favor, paguen la factura #1042 (RD$48,500) a la nueva cuenta [[3|antes de las 3:00 p. m. de hoy]] para evitar recargos.",
      "Los datos de la nueva cuenta se los daremos por este mismo correo. [[4|No llamen a nuestro número anterior: estamos migrando la línea telefónica.]]"
    ],
    enlaces: [],
    pistas: [
      { n: 1, tipo: "alerta", titulo: "Cambio de cuenta inesperado", texto: "Los cambios de datos de pago por correo son una estafa muy común contra negocios. Un proveedor real avisa con tiempo y por varios canales." },
      { n: 2, tipo: "alerta", titulo: "«Responder a» con otro dominio", texto: "El remitente parece correcto, pero si respondes tu mensaje va a suministros-delta-pagos.example, un dominio distinto." },
      { n: 3, tipo: "alerta", titulo: "Plazo para presionar", texto: "Una hora límite y la amenaza de recargos buscan que pagues sin confirmar." },
      { n: 4, tipo: "alerta", titulo: "Te impide verificar", texto: "Pedirte que no llames al número conocido es la señal más clara: la verificación por teléfono desmontaría el engaño." }
    ],
    senales: ["suplantacion", "urgencia", "pago"],
    resumen: "Phishing empresarial: falso cambio de cuenta bancaria de un proveedor."
  },
  {
    id: "servicio-sesion",
    tipo: "servicio",
    esPhishing: false,
    tema: "servicios",
    contexto: "Hace un momento abriste tu cuenta de MiNube en la laptop de tu casa, como siempre.",
    remitente: { nombre: "MiNube", direccion: "Notificación de la app oficial" },
    asunto: "Nuevo inicio de sesión en tu cuenta",
    fecha: "Hoy, 8:15 a. m.",
    cuerpo: [
      "Detectamos un inicio de sesión [[2|desde una laptop con Windows en Santo Domingo, hoy a las 8:15 a. m.]]",
      "[[1|Si fuiste tú, no tienes que hacer nada.]] [[3|Si no reconoces este acceso, abre la app oficial o escribe tú mismo minube.example en tu navegador]] y cambia tu contraseña."
    ],
    enlaces: [
      { texto: "Revisar actividad de la cuenta", destino: "https://minube.example/seguridad", dominioReal: "minube.example", marca: 4 }
    ],
    pistas: [
      { n: 1, tipo: "ok", titulo: "No te presiona", texto: "Informa y te dice qué hacer en cada caso, sin plazos ni amenazas." },
      { n: 2, tipo: "ok", titulo: "Datos concretos y verificables", texto: "Menciona dispositivo, ciudad y hora; puedes comprobar si coincide con lo que hiciste." },
      { n: 3, tipo: "ok", titulo: "Te manda a un canal oficial", texto: "Te recomienda entrar por la app o escribir la dirección tú mismo, en lugar de pedirte que sigas un enlace ciego." },
      { n: 4, tipo: "ok", titulo: "El enlace coincide y no pide claves", texto: "El destino es minube.example y la página solo muestra tu actividad." }
    ],
    senales: [],
    resumen: "Legítimo: aviso informativo de seguridad, sin urgencia y con enlace coincidente."
  },
  {
    id: "banco-compra-sms",
    tipo: "sms",
    esPhishing: false,
    tema: "banco",
    contexto: "Acabas de pagar en un supermercado con tu tarjeta de Banco Ejemplo.",
    remitente: { nombre: "BancoEjemplo", direccion: "" },
    fecha: "Hoy, 12:48 p. m.",
    cuerpo: [
      "Banco Ejemplo: se aprobó una compra de [[1|RD$1,250 en SuperMercado Ejemplo con tu tarjeta terminada en 4821]]. [[2|Si no la reconoces, llama al número que aparece al reverso de tu tarjeta.]]"
    ],
    enlaces: [],
    pistas: [
      { n: 1, tipo: "ok", titulo: "Informa un hecho concreto", texto: "Da monto, comercio y terminación de tarjeta, y coincide con lo que acabas de hacer." },
      { n: 2, tipo: "ok", titulo: "Te manda a un canal que ya conoces", texto: "Te pide llamar al número impreso en tu tarjeta, no a uno que venga en el mensaje." },
      { n: 3, tipo: "ok", titulo: "No pide nada sensible", texto: "No incluye enlaces ni te pide claves, códigos ni datos de tarjeta." }
    ],
    senales: [],
    resumen: "Legítimo: aviso de compra sin enlaces, que no pide datos y remite al número oficial."
  },
  {
    id: "familiar-mensaje",
    tipo: "mensaje",
    esPhishing: true,
    tema: "familia",
    contexto: "Recibes este mensaje de un número que no tienes guardado.",
    remitente: { nombre: "+1 809 555 0177", direccion: "" },
    fecha: "Hoy, 3:02 p. m.",
    cuerpo: [
      "Hola mamá, [[1|cambié de número, este es el nuevo]]. Se me dañó el teléfono.",
      "Necesito un favor [[2|urgente]]: tengo que pagar una factura hoy y no puedo entrar al banco. [[3|¿Me haces una transferencia de RD$8,000 a esta cuenta?]] Mañana te los devuelvo.",
      "[[4|No me llames, estoy en una reunión.]]"
    ],
    enlaces: [],
    pistas: [
      { n: 1, tipo: "alerta", titulo: "Número nuevo que dice ser un familiar", texto: "Es una estafa muy extendida: alguien se hace pasar por un hijo o un familiar con un «nuevo número»." },
      { n: 2, tipo: "alerta", titulo: "Urgencia", texto: "La prisa evita que te detengas a verificar." },
      { n: 3, tipo: "alerta", titulo: "Pide dinero a una cuenta ajena", texto: "Una transferencia inesperada, a una cuenta que no conoces, es la señal central del engaño." },
      { n: 4, tipo: "alerta", titulo: "Evita que lo verifiques", texto: "Te pide que no llames porque una llamada al número de siempre descubriría el fraude." }
    ],
    senales: ["suplantacion", "urgencia", "pago"],
    resumen: "Phishing: falso familiar con número nuevo que pide dinero con urgencia."
  }
];

/* Recomendaciones según la señal que se le pasó a la persona (en phishing que no detectó). */
const RECOMENDACIONES = {
  dominio: {
    titulo: "Dominios sospechosos",
    texto: "Lee la dirección de derecha a izquierda: lo que está justo antes de la terminación (.com, .do, .example) es el dominio real. Las palabras añadidas delante no cambian quién envía el mensaje.",
    leccion: { texto: "Ver cómo verificar un enlace o sitio", url: "../academy/phishing.html#verificar" }
  },
  urgencia: {
    titulo: "Urgencia artificial",
    texto: "Si un mensaje te exige actuar en horas o amenaza con bloquear algo, detente: los estafadores usan la prisa para que no verifiques. Confirma siempre por otro canal.",
    leccion: { texto: "Ver las señales de alerta", url: "../academy/phishing.html#senales" }
  },
  enlace: {
    titulo: "Enlaces engañosos",
    texto: "Antes de tocar un enlace, revisa a dónde lleva realmente (pasa el cursor o mantén presionado). Si no coincide con quien dice enviarlo, no lo abras: entra escribiendo tú la dirección.",
    leccion: { texto: "Ver cómo verificar un enlace o sitio", url: "../academy/phishing.html#verificar" }
  },
  datos: {
    titulo: "Solicitudes de información sensible",
    texto: "Ninguna entidad seria te pide claves, códigos de verificación ni datos de tarjeta por mensaje. Si lo hace, es un fraude: no compartas nada.",
    leccion: { texto: "Repasar la lección de MFA", url: "../academy/mfa.html" }
  },
  pago: {
    titulo: "Pagos y transferencias inesperadas",
    texto: "Desconfía de cobros, tasas o cambios de cuenta que no esperabas. Antes de pagar, confirma llamando a un número que ya conocías, nunca al que viene en el mensaje.",
    leccion: { texto: "Ver cómo preparar a tu equipo", url: "../academy/negocios.html#equipo" }
  },
  suplantacion: {
    titulo: "Suplantación de identidad",
    texto: "Un mensaje puede aparentar venir de un familiar, un jefe o un proveedor. Verifica por un canal distinto (una llamada al número de siempre) antes de enviar dinero o datos.",
    leccion: { texto: "Ver los tipos de phishing", url: "../academy/phishing.html#tipos" }
  },
  legitimos: {
    titulo: "Reconocer mensajes legítimos",
    texto: "Desconfiar es bueno, pero no todo mensaje con un enlace es peligroso. Un mensaje legítimo suele coincidir con algo que hiciste, viene de un dominio que coincide con el servicio y no te pide claves ni te presiona. Ante la duda, entra por la app oficial.",
    leccion: { texto: "Ver cómo verificar un enlace o sitio", url: "../academy/phishing.html#verificar" }
  }
};

/* Mensajes según la puntuación (de mayor a menor: se usa el primero que se alcance). */
const NIVELES = [
  { min: 90, titulo: "¡Excelente criterio!", texto: "Distingues muy bien los mensajes legítimos de los fraudulentos. Sigue revisando el dominio, la urgencia y lo que te piden antes de actuar." },
  { min: 70, titulo: "¡Muy buen criterio!", texto: "Detectas la mayoría de los engaños. Repasa las recomendaciones de abajo para cerrar los huecos que quedan." },
  { min: 50, titulo: "Vas por buen camino", texto: "Algunos engaños todavía te pasan o dudas de mensajes legítimos. Practica las señales clave y vuelve a intentarlo." },
  { min: 0,  titulo: "Hay que entrenar la vista", texto: "Es normal: los estafadores son buenos imitando. Repasa la lección de phishing y repite la simulación para notar la diferencia." }
];

const MENSAJE_PERFECTO = "Clasificaste bien todos los mensajes. Para seguir aprendiendo, repasa las lecciones de Academy y comparte estas señales con tu familia o tu equipo.";

const ETIQUETA_TIPO = { correo: "Correo", sms: "SMS", mensaje: "Mensaje", servicio: "Servicio" };

/* ==========================================================
   2. LÓGICA DEL SIMULADOR
   ========================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const total = ESCENARIOS.length;
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MARCA = /\[\[(\d+)\|(.+?)\]\]/g;

  const pantallas = { intro: $("sim-intro"), app: $("sim-app"), resultados: $("sim-resultados") };

  let orden = [];          // escenarios del intento actual (mezclados)
  let decisiones = {};     // id -> "legitimo" | "phishing"
  let actualId = null;     // mensaje abierto

  /* ---------- Utilidades ---------- */
  function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;     // textContent: nunca interpreta HTML
    return el;
  }

  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  const plano = (texto) => texto.replace(MARCA, "$2");

  // Escribe un texto en el elemento convirtiendo [[n|texto]] en resaltados (visibles solo tras decidir)
  function conMarcas(contenedor, texto, esc) {
    let ultimo = 0, m;
    MARCA.lastIndex = 0;
    while ((m = MARCA.exec(texto)) !== null) {
      if (m.index > ultimo) contenedor.appendChild(document.createTextNode(texto.slice(ultimo, m.index)));
      const pista = esc.pistas.find((p) => String(p.n) === m[1]);
      const marca = crear("span", "sim-marca", m[2]);
      marca.dataset.n = m[1];
      marca.dataset.tipo = pista ? pista.tipo : "alerta";
      contenedor.appendChild(marca);
      ultimo = MARCA.lastIndex;
    }
    if (ultimo < texto.length) contenedor.appendChild(document.createTextNode(texto.slice(ultimo)));
  }

  function mostrarPantalla(nombre) {
    Object.keys(pantallas).forEach((k) => { pantallas[k].hidden = k !== nombre; });
    const activa = pantallas[nombre];
    activa.classList.remove("sim-entra");
    void activa.offsetWidth;
    activa.classList.add("sim-entra");
  }

  function irArriba() {
    $("sim-zona").scrollIntoView({ block: "start", behavior: menosMovimiento ? "auto" : "smooth" });
  }

  const porId = (id) => ESCENARIOS.find((e) => e.id === id);
  const acierto = (esc) => decisiones[esc.id] === (esc.esPhishing ? "phishing" : "legitimo");
  const clasificados = () => Object.keys(decisiones).length;

  /* ---------- Bandeja ---------- */
  function iniciar() {
    orden = mezclar(ESCENARIOS);
    decisiones = {};
    actualId = null;
    renderLista();
    actualizarBarra();
    $("sim-visor-contenido").hidden = true;
    $("sim-vacio").hidden = false;
    $("sim-app").dataset.vista = "lista";
    mostrarPantalla("app");
    irArriba();
  }

  function renderLista() {
    const lista = $("sim-lista");
    lista.textContent = "";
    orden.forEach((esc) => {
      const item = document.createElement("li");
      const boton = crear("button", "sim-item");
      boton.type = "button";
      boton.dataset.id = esc.id;
      boton.addEventListener("click", () => abrir(esc.id));

      const nombreRem = plano(esc.remitente.nombre);
      boton.appendChild(crear("span", "sim-avatar sim-avatar--" + esc.tipo, nombreRem.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ+]/g, "").charAt(0).toUpperCase() || "#"));
      const texto = crear("span", "sim-item-texto");
      const fila = crear("span", "sim-item-fila");
      fila.appendChild(crear("span", "sim-remitente", nombreRem));
      fila.appendChild(crear("span", "sim-hora", esc.fecha.replace("Hoy, ", "").replace("Ayer, ", "Ayer ")));
      texto.appendChild(fila);
      texto.appendChild(crear("span", "sim-asunto", esc.asunto ? plano(esc.asunto) : plano(esc.cuerpo[0])));
      texto.appendChild(crear("span", "sim-vista", ETIQUETA_TIPO[esc.tipo] + " · " + plano(esc.cuerpo[0]).slice(0, 60)));
      boton.appendChild(texto);
      boton.appendChild(crear("span", "sim-resultado-item"));
      item.appendChild(boton);
      lista.appendChild(item);
    });
    refrescarLista();
  }

  function refrescarLista() {
    document.querySelectorAll(".sim-item").forEach((boton) => {
      const esc = porId(boton.dataset.id);
      const hecho = boton.dataset.id in decisiones;
      boton.classList.toggle("is-hecho", hecho);
      boton.setAttribute("aria-current", String(boton.dataset.id === actualId));
      const marca = boton.querySelector(".sim-resultado-item");
      marca.textContent = hecho ? (acierto(esc) ? "✓" : "✗") : "";
      marca.className = "sim-resultado-item" + (hecho ? (acierto(esc) ? " ok" : " error") : "");
      marca.setAttribute("aria-label", hecho ? (acierto(esc) ? "Acertaste" : "Fallaste") : "");
    });
  }

  function actualizarBarra() {
    const n = clasificados();
    $("sim-contador").textContent = "Clasificados: " + n + " de " + total;
    const barra = $("sim-progreso");
    barra.max = total;
    barra.value = n;
    $("sim-ver-resultados").disabled = n < total;
  }

  /* ---------- Mensaje abierto ---------- */
  function abrir(id) {
    actualId = id;
    const esc = porId(id);
    renderMensaje(esc);
    $("sim-vacio").hidden = true;
    $("sim-visor-contenido").hidden = false;
    $("sim-app").dataset.vista = "mensaje";
    refrescarLista();
    $("sim-visor-titulo").focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 899px)").matches) irArriba();
  }

  function renderMensaje(esc) {
    const msg = $("sim-mensaje");
    msg.textContent = "";
    msg.className = "sim-mensaje sim-mensaje--" + esc.tipo;

    $("sim-visor-titulo").textContent = esc.asunto ? plano(esc.asunto) : "Mensaje de " + plano(esc.remitente.nombre);
    $("sim-contexto").textContent = "Situación: " + esc.contexto;

    // Cabecera
    const cab = crear("div", "sim-cab");
    cab.appendChild(crear("span", "sim-tipo", ETIQUETA_TIPO[esc.tipo]));
    if (esc.asunto) {
      const asunto = crear("p", "sim-asunto-grande");
      conMarcas(asunto, esc.asunto, esc);
      cab.appendChild(asunto);
    }
    const lineaDe = crear("p", "sim-linea");
    lineaDe.appendChild(crear("strong", "", esc.tipo === "correo" ? "De: " : "Remitente: "));
    if (esc.tipo === "correo") {
      lineaDe.appendChild(document.createTextNode(esc.remitente.nombre + " <"));
      conMarcas(lineaDe, esc.remitente.direccion, esc);
      lineaDe.appendChild(document.createTextNode(">"));
    } else {
      conMarcas(lineaDe, esc.remitente.nombre + (esc.remitente.direccion ? " · " + esc.remitente.direccion : ""), esc);
    }
    cab.appendChild(lineaDe);
    if (esc.para) {
      const p = crear("p", "sim-linea"); p.appendChild(crear("strong", "", "Para: ")); p.appendChild(document.createTextNode(esc.para)); cab.appendChild(p);
    }
    if (esc.responderA) {
      const p = crear("p", "sim-linea"); p.appendChild(crear("strong", "", "Responder a: ")); conMarcas(p, esc.responderA, esc); cab.appendChild(p);
    }
    cab.appendChild(crear("p", "sim-linea", esc.fecha));
    msg.appendChild(cab);

    // Cuerpo
    const cuerpo = crear("div", "sim-cuerpo-msg");
    const burbuja = esc.tipo === "sms" || esc.tipo === "mensaje" ? crear("div", "sim-burbuja") : cuerpo;
    esc.cuerpo.forEach((parrafo) => {
      const p = document.createElement("p");
      conMarcas(p, parrafo, esc);
      burbuja.appendChild(p);
    });

    // Enlaces: son botones; no abren nada. Al tocarlos muestran el destino real.
    esc.enlaces.forEach((enlace) => {
      const b = crear("button", "sim-enlace" + (burbuja !== cuerpo ? " sim-enlace--texto" : ""));
      b.type = "button";
      if (enlace.marca) {
        const marcado = "[[" + enlace.marca + "|" + enlace.texto + "]]";
        conMarcas(b, marcado, esc);
      } else {
        conMarcas(b, enlace.texto, esc);
      }
      const mostrar = () => mostrarDestino(enlace);
      b.addEventListener("click", mostrar);
      b.addEventListener("mouseenter", mostrar);
      b.addEventListener("focus", mostrar);
      burbuja.appendChild(b);
    });
    if (burbuja !== cuerpo) cuerpo.appendChild(burbuja);
    msg.appendChild(cuerpo);

    // Barra de estado simulada
    const estado = $("sim-estado");
    estado.textContent = "";
    estado.appendChild(crear("span", "", esc.enlaces.length
      ? "Toca o pasa el cursor sobre un enlace para ver su destino real. Aquí no se abre nada."
      : "Este mensaje no incluye enlaces."));

    // Decisión
    $("sim-decision").hidden = false;
    document.querySelectorAll(".sim-decidir").forEach((b) => {
      b.disabled = false;
      b.classList.remove("is-elegida");
    });
    $("sim-feedback-zona").textContent = "";
    $("sim-acciones").hidden = true;
    msg.classList.remove("sim-revelado");

    if (esc.id in decisiones) mostrarFeedback(esc, false);
  }

  function mostrarDestino(enlace) {
    const estado = $("sim-estado");
    estado.textContent = "";
    estado.appendChild(crear("span", "sim-estado-etq", "Destino real del enlace: "));
    const url = crear("span", "sim-url");
    const i = enlace.destino.indexOf(enlace.dominioReal);
    if (i >= 0) {
      url.appendChild(document.createTextNode(enlace.destino.slice(0, i)));
      url.appendChild(crear("strong", "", enlace.dominioReal));
      url.appendChild(document.createTextNode(enlace.destino.slice(i + enlace.dominioReal.length)));
    } else {
      url.textContent = enlace.destino;
    }
    estado.appendChild(url);
    estado.appendChild(crear("span", "sim-estado-nota", " El dominio real está resaltado."));
  }

  /* ---------- Decisión y retroalimentación ---------- */
  function decidir(valor) {
    if (!actualId || actualId in decisiones) return;
    const esc = porId(actualId);
    decisiones[esc.id] = valor;
    actualizarBarra();
    refrescarLista();
    mostrarFeedback(esc, true);
  }

  function mostrarFeedback(esc, enfocar) {
    const valor = decisiones[esc.id];
    const ok = acierto(esc);
    $("sim-mensaje").classList.add("sim-revelado");

    document.querySelectorAll(".sim-decidir").forEach((b) => {
      b.disabled = true;
      b.classList.toggle("is-elegida", b.dataset.valor === valor);
    });

    const fb = crear("div", "sim-feedback " + (ok ? "ok" : "error"));
    fb.appendChild(crear("p", "sim-feedback-titulo",
      (ok ? "✓ ¡Correcto! " : "✗ Incorrecto. ") + (esc.esPhishing ? "Era un mensaje de phishing." : "Era un mensaje legítimo.")));
    fb.appendChild(crear("p", "", esc.resumen));
    fb.appendChild(crear("p", "sim-pistas-titulo", esc.esPhishing ? "Señales de alerta" : "Por qué es legítimo"));
    const lista = crear("ul", "sim-pistas");
    esc.pistas.forEach((pista) => {
      const li = document.createElement("li");
      li.className = "sim-pista";
      li.appendChild(crear("span", "sim-pista-n " + pista.tipo, String(pista.n)));
      const cuerpo = crear("span", "sim-pista-texto");
      cuerpo.appendChild(crear("strong", "", pista.titulo));
      cuerpo.appendChild(document.createTextNode(pista.texto));
      li.appendChild(cuerpo);
      lista.appendChild(li);
    });
    fb.appendChild(lista);
    const zona = $("sim-feedback-zona");
    zona.textContent = "";
    zona.appendChild(fb);

    const hecho = clasificados() === total;
    $("sim-siguiente").textContent = hecho ? "Ver resultados" : "Siguiente mensaje";
    $("sim-acciones").hidden = false;
    if (enfocar) {
      $("sim-siguiente").focus({ preventScroll: true });
      $("sim-feedback-zona").scrollIntoView({ block: "nearest", behavior: menosMovimiento ? "auto" : "smooth" });
    }
  }

  function siguiente() {
    if (clasificados() === total) { mostrarResultados(); return; }
    const i = orden.findIndex((e) => e.id === actualId);
    for (let k = 1; k <= total; k++) {
      const candidato = orden[(i + k) % total];
      if (!(candidato.id in decisiones)) { abrir(candidato.id); return; }
    }
  }

  /* ---------- Resultados ---------- */
  function fijarPuntaje(valor) {
    $("sim-puntaje").style.setProperty("--p", valor);
    $("sim-puntaje-numero").textContent = valor;
  }

  let animacion = null;
  function animarPuntaje(objetivo) {
    cancelAnimationFrame(animacion);
    if (menosMovimiento || objetivo === 0) { fijarPuntaje(objetivo); return; }
    const inicio = performance.now();
    fijarPuntaje(0);
    function paso(ahora) {
      const t = Math.min((ahora - inicio) / 900, 1);
      fijarPuntaje(Math.round(objetivo * (1 - Math.pow(1 - t, 3))));
      if (t < 1) animacion = requestAnimationFrame(paso);
    }
    animacion = requestAnimationFrame(paso);
  }

  function mostrarResultados() {
    const aciertos = ESCENARIOS.filter(acierto).length;
    const errores = total - aciertos;
    const puntaje = Math.round((aciertos / total) * 100);
    const nivel = NIVELES.find((n) => puntaje >= n.min) || NIVELES[NIVELES.length - 1];
    const phishing = ESCENARIOS.filter((e) => e.esPhishing);
    const legitimos = ESCENARIOS.filter((e) => !e.esPhishing);

    $("sim-puntaje").setAttribute("aria-label", "Puntuación: " + puntaje + " sobre 100");
    $("sim-resultado-titulo").textContent = nivel.titulo;
    $("sim-resultado-texto").textContent = nivel.texto;
    $("sim-stat-aciertos").textContent = aciertos;
    $("sim-stat-errores").textContent = errores;
    $("sim-stat-phishing").textContent = phishing.filter(acierto).length + " de " + phishing.length;
    $("sim-stat-legitimos").textContent = legitimos.filter(acierto).length + " de " + legitimos.length;

    mostrarRecomendaciones();
    mostrarRevision();
    mostrarPantalla("resultados");
    animarPuntaje(puntaje);
    $("sim-resultado-titulo").focus({ preventScroll: true });
    irArriba();
  }

  // Recomendaciones personalizadas: según las señales de los phishing que no detectó
  // y según los mensajes legítimos que marcó como sospechosos
  function mostrarRecomendaciones() {
    const conteo = {};
    let falsosPositivos = 0;
    ESCENARIOS.forEach((esc) => {
      if (acierto(esc)) return;
      if (esc.esPhishing) esc.senales.forEach((s) => { conteo[s] = (conteo[s] || 0) + 1; });
      else falsosPositivos++;
    });

    const claves = Object.keys(conteo).sort((a, b) => conteo[b] - conteo[a]);
    if (falsosPositivos > 0) claves.push("legitimos");

    const lista = $("sim-recs");
    lista.textContent = "";
    $("sim-recs-intro").textContent = "";

    if (claves.length === 0) {
      const li = crear("li", "sim-rec");
      li.appendChild(crear("h4", "", "¡Sin errores!"));
      li.appendChild(crear("p", "", MENSAJE_PERFECTO));
      lista.appendChild(li);
      return;
    }

    const caidos = ESCENARIOS.filter((e) => e.esPhishing && !acierto(e)).length;
    const partes = [];
    if (caidos) partes.push("diste por legítimos " + caidos + (caidos === 1 ? " mensaje fraudulento" : " mensajes fraudulentos"));
    if (falsosPositivos) partes.push("marcaste como sospechosos " + falsosPositivos + (falsosPositivos === 1 ? " mensaje legítimo" : " mensajes legítimos"));
    $("sim-recs-intro").textContent = "En esta simulación " + partes.join(" y ") + ". Estas son las señales en las que más te conviene practicar:";

    claves.forEach((clave) => {
      const info = RECOMENDACIONES[clave];
      const li = crear("li", "sim-rec");
      const veces = clave === "legitimos" ? falsosPositivos : conteo[clave];
      li.appendChild(crear("h4", "", info.titulo + " · " + veces + (veces === 1 ? " mensaje" : " mensajes")));
      li.appendChild(crear("p", "", info.texto));
      const enlace = crear("a", "", info.leccion.texto + " →");
      enlace.href = info.leccion.url;
      li.appendChild(enlace);
      lista.appendChild(li);
    });
  }

  function mostrarRevision() {
    const lista = $("sim-revision-lista");
    lista.textContent = "";
    orden.forEach((esc) => {
      const ok = acierto(esc);
      const li = document.createElement("li");
      const cab = crear("p", "sim-rev-cab");
      cab.appendChild(crear("strong", "sim-tag " + (ok ? "ok" : "error"), ok ? "✓ Acierto" : "✗ Error"));
      cab.appendChild(document.createTextNode(" " + ETIQUETA_TIPO[esc.tipo] + " de " + plano(esc.remitente.nombre)));
      li.appendChild(cab);
      li.appendChild(crear("p", "sim-rev-linea", "Tu decisión: " + (decisiones[esc.id] === "phishing" ? "sospechoso / phishing" : "legítimo") +
        " · Era: " + (esc.esPhishing ? "phishing" : "legítimo")));
      li.appendChild(crear("p", "sim-rev-linea", esc.resumen));
      lista.appendChild(li);
    });
  }

  /* ---------- Eventos ---------- */
  document.querySelectorAll("[data-sim-total]").forEach((el) => { el.textContent = total; });
  $("sim-comenzar").addEventListener("click", iniciar);
  $("sim-repetir").addEventListener("click", iniciar);
  $("sim-siguiente").addEventListener("click", siguiente);
  $("sim-ver-resultados").addEventListener("click", mostrarResultados);
  $("sim-volver").addEventListener("click", () => {
    $("sim-app").dataset.vista = "lista";
    irArriba();
  });
  document.querySelectorAll(".sim-decidir").forEach((b) => b.addEventListener("click", () => decidir(b.dataset.valor)));
})();
