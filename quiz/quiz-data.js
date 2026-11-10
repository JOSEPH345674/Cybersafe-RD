/* ==========================================================
   CyberSafe RD - Cyber Quiz: contenido del cuestionario
   Este es el ÚNICO archivo que necesitas editar para cambiar
   preguntas, recomendaciones o mensajes. No toques quiz.js.

   Cómo se escribe una pregunta:
   {
     tema: "phishing",                 // debe existir en "temas" (más abajo)
     pregunta: "Texto de la pregunta",
     opciones: ["A", "B", "C", "D"],   // siempre 4 opciones
     correcta: 2,                      // posición de la correcta: 0 = primera, 1 = segunda, 2 = tercera, 3 = cuarta
     explicacion: "Por qué es la correcta."
   }
   El orden de las opciones se mezcla solo en cada intento.
   ========================================================== */

window.CYBERQUIZ_DATOS = {

  preguntas: [
    {
      tema: "phishing",
      pregunta: "Recibes un correo que dice: «Tu cuenta bancaria será bloqueada en 2 horas. Haz clic aquí para verificar tus datos». ¿Qué debes hacer?",
      opciones: [
        "Hacer clic de inmediato para evitar que bloqueen la cuenta",
        "Responder el correo pidiendo más información",
        "No hacer clic y verificar entrando por la app oficial o llamando al número oficial del banco",
        "Reenviar el correo a tus contactos para advertirles"
      ],
      correcta: 2,
      explicacion: "La urgencia y la amenaza son señales típicas de phishing. Lo seguro es no usar el enlace y confirmar por un canal que tú conozcas, como la app oficial o el número que aparece en tu tarjeta."
    },
    {
      tema: "phishing",
      pregunta: "En el enlace https://banco.seguridad-cuentas.com/ingreso, ¿cuál es el dominio real del sitio?",
      opciones: [
        "banco.com",
        "seguridad-cuentas.com",
        "ingreso",
        "https"
      ],
      correcta: 1,
      explicacion: "El dominio real es la parte que está justo antes de la terminación (.com) y de la primera barra «/». Poner «banco» al inicio es un truco para parecer legítimo."
    },
    {
      tema: "contrasenas",
      pregunta: "¿Cuál de estas contraseñas es la más segura?",
      opciones: [
        "Maria2008!",
        "12345678901234",
        "P@ssw0rd",
        "nube-tambor-cocina-pelota"
      ],
      correcta: 3,
      explicacion: "Una frase larga de palabras al azar es difícil de adivinar y fácil de recordar. Las demás usan datos personales, secuencias o sustituciones muy conocidas."
    },
    {
      tema: "contrasenas",
      pregunta: "¿Para qué sirve principalmente un gestor de contraseñas?",
      opciones: [
        "Para generar y guardar contraseñas únicas y cifradas, recordando solo una contraseña maestra",
        "Para compartir tus contraseñas con tus contactos",
        "Para que no necesites activar la verificación en dos pasos",
        "Para cambiar tu contraseña automáticamente cada semana"
      ],
      correcta: 0,
      explicacion: "Un gestor crea contraseñas largas y distintas para cada cuenta y las protege con una sola contraseña maestra. No reemplaza a la MFA: lo ideal es usar ambas."
    },
    {
      tema: "mfa",
      pregunta: "¿Qué es la autenticación multifactor (MFA)?",
      opciones: [
        "Usar una contraseña muy larga",
        "Tener la misma contraseña en todas las cuentas",
        "Pedir dos o más pruebas distintas de identidad, como una contraseña y un código de una app",
        "Cerrar sesión cada vez que terminas de usar una cuenta"
      ],
      correcta: 2,
      explicacion: "La MFA combina distintos tipos de prueba: algo que sabes (contraseña), algo que tienes (tu teléfono o una llave) o algo que eres (tu huella). Así, una contraseña robada no basta para entrar."
    },
    {
      tema: "mfa",
      pregunta: "Alguien te llama diciendo ser del banco y te pide el código que acabas de recibir por SMS. ¿Qué haces?",
      opciones: [
        "Se lo das, porque es del banco",
        "Cuelgas, no compartes el código y llamas tú al número oficial del banco",
        "Se lo das solo si dice tu nombre completo",
        "Le das solo la mitad del código"
      ],
      correcta: 1,
      explicacion: "Ninguna entidad legítima te pide códigos de verificación. Si alguien los solicita, probablemente ya tiene tu contraseña y está intentando entrar a tu cuenta."
    },
    {
      tema: "malware",
      pregunta: "¿Cuál es la forma más segura de instalar un programa en tu computadora?",
      opciones: [
        "Descargarlo de la primera página que aparezca en el buscador",
        "Abrir el archivo que te envía un desconocido por WhatsApp",
        "Instalar una versión «crackeada» gratuita de un programa de pago",
        "Descargarlo desde el sitio oficial del fabricante o desde una tienda de aplicaciones reconocida"
      ],
      correcta: 3,
      explicacion: "El malware suele esconderse en programas pirateados, archivos de desconocidos y sitios no oficiales. Descarga solo de fuentes oficiales y mantén tu sistema actualizado."
    },
    {
      tema: "wifi",
      pregunta: "¿Qué medida protege mejor el Wi-Fi de un pequeño negocio?",
      opciones: [
        "Cambiar la contraseña de fábrica del router, usar cifrado WPA2 o WPA3 y crear una red aparte para invitados",
        "Dejar la contraseña de fábrica del router para no olvidarla",
        "Compartir la contraseña del Wi-Fi del negocio con todos los clientes",
        "Dejar la red sin contraseña para que sea más cómoda"
      ],
      correcta: 0,
      explicacion: "Las contraseñas de fábrica son conocidas por los atacantes. Un buen cifrado y una red separada para invitados evitan que clientes o visitantes lleguen a los equipos del negocio."
    },
    {
      tema: "datos",
      pregunta: "Un ransomware cifra los archivos de tu negocio y pide un pago para devolverlos. ¿Qué te permite recuperarte sin pagar?",
      opciones: [
        "Pagar rápido para que no se pierda nada",
        "Apagar el router y esperar unos días",
        "Tener copias de seguridad recientes guardadas fuera del equipo infectado",
        "Cambiar el fondo de pantalla de la computadora"
      ],
      correcta: 2,
      explicacion: "Con respaldos recientes, hechos con la regla 3-2-1 y guardados fuera del equipo, puedes restaurar tus datos sin pagar. Pagar no garantiza recuperar los archivos y alimenta nuevos ataques."
    },
    {
      tema: "basica",
      pregunta: "¿Por qué es importante mantener actualizados el sistema y las aplicaciones?",
      opciones: [
        "Solo para que cambien de aspecto",
        "Porque las actualizaciones corrigen fallos de seguridad que los atacantes aprovechan",
        "Para que el equipo gaste más batería",
        "Porque así se eliminan las contraseñas viejas"
      ],
      correcta: 1,
      explicacion: "Muchas actualizaciones cierran vulnerabilidades ya conocidas. Un equipo sin actualizar es una puerta abierta para el malware y otros ataques."
    }
  ],

  /* Temas: nombre visible, consejo que se muestra si fallaste preguntas de ese tema
     y la lección de Academy a la que enlaza (ruta desde quiz/index.html). */
  temas: {
    phishing: {
      nombre: "Phishing",
      recomendacion: "Antes de hacer clic, revisa el remitente y la dirección real del enlace, desconfía de la urgencia y confirma por otro canal.",
      leccion: { texto: "Repasar la lección de phishing", url: "../academy/phishing.html" }
    },
    contrasenas: {
      nombre: "Contraseñas",
      recomendacion: "Usa frases largas y distintas para cada cuenta, y considera un gestor de contraseñas para no tener que memorizarlas.",
      leccion: { texto: "Repasar la lección de contraseñas", url: "../academy/contrasenas.html" }
    },
    mfa: {
      nombre: "MFA",
      recomendacion: "Activa la verificación en dos pasos en tu correo, tu banca y tus redes, y nunca compartas los códigos que recibes.",
      leccion: { texto: "Repasar la lección de MFA", url: "../academy/mfa.html" }
    },
    malware: {
      nombre: "Malware",
      recomendacion: "Instala programas solo desde fuentes oficiales, evita el software pirata y mantén activa la protección de tu equipo.",
      leccion: { texto: "Ver cómo proteger tus dispositivos", url: "../academy/negocios.html#dispositivos" }
    },
    wifi: {
      nombre: "Redes Wi-Fi",
      recomendacion: "Cambia la contraseña de fábrica del router, usa WPA2 o WPA3 y separa la red de invitados de la del negocio.",
      leccion: { texto: "Ver cómo proteger la red y el Wi-Fi", url: "../academy/negocios.html#red" }
    },
    datos: {
      nombre: "Protección de datos",
      recomendacion: "Haz copias de seguridad con la regla 3-2-1 y comprueba de vez en cuando que puedes restaurarlas.",
      leccion: { texto: "Ver cómo hacer copias de seguridad", url: "../academy/negocios.html#respaldos" }
    },
    basica: {
      nombre: "Seguridad básica",
      recomendacion: "Activa las actualizaciones automáticas, el bloqueo de pantalla y usa cuentas sin permisos de administrador para el trabajo diario.",
      leccion: { texto: "Ver cómo proteger tus dispositivos", url: "../academy/negocios.html#dispositivos" }
    }
  },

  /* Mensajes según la puntuación. Van de mayor a menor: se usa el primero cuyo "min" se alcance. */
  niveles: [
    { min: 90, titulo: "¡Excelente!", texto: "Dominas lo esencial de la ciberseguridad. Sigue practicando estos hábitos y compártelos con tu familia, tus compañeros o tu equipo." },
    { min: 70, titulo: "¡Muy bien!", texto: "Tienes una buena base. Repasa los temas donde fallaste y pronto estarás listo para detectar la mayoría de los riesgos." },
    { min: 50, titulo: "Vas por buen camino", texto: "Ya conoces varias ideas importantes, pero todavía hay huecos. Las recomendaciones de abajo te dicen por dónde empezar." },
    { min: 0,  titulo: "Es un buen punto de partida", texto: "Nadie nace sabiendo ciberseguridad. Repasa las lecciones de Academy y vuelve a intentarlo: vas a notar la diferencia." }
  ],

  mensajePerfecto: "No fallaste ninguna pregunta. Para seguir aprendiendo, revisa las lecciones de Academy y comparte lo que sabes con otras personas."
};