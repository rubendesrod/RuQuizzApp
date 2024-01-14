/* APP */

// Funcion para cargar las preguntas en el DOM
const cargarPregunta = function () {
  // Saco el numero de pregunta actual y el total que hay
  numPreguntas.textContent = `${indicePregunta + 1}/${arrayPreguntas.length}`;

  // Obtengo la pregunta con el indicedePreguntas
  const pregunta = arrayPreguntas[indicePregunta];

  // Obtengo el enunciado del objeto
  enunciado.textContent = pregunta.question;

  // Hago un array con la pregunta correcta y las incorrectas
  let respuestas = [pregunta.correct_answer, ...pregunta.incorrect_answers];

  // Aleatorizo el orden de las preguntas para que no siempre sea la primera opcion
  respuestas = respuestas.sort(() => Math.random() - 0.5);

  // Aplico una respuesta a cada uno de los botones y un atributo value
  botones.forEach((boton, index) => {
    boton.textContent = respuestas[index];
    boton.value = respuestas[index];
  });
};

// funcion para comprobar la respuesta del quizz
const comprobarRespuesta = function (evento) {
  // Saco el contenido del texto del botón pulsado
  let respuesta = evento.target.value;

  // Obtengo la respuesta que es correcta de la pregunta actual
  const pregunta = arrayPreguntas[indicePregunta];
  let respuestaCorrecta = pregunta.correct_answer;

  evento.target.classList.remove("boton");
  // COmpruebo la que ha marcado el usuario con la correcta
  if (respuesta === respuestaCorrecta) {
    // Pregunta Acertada
    acertadas++;
    evento.target.classList.add("acertada");
  } else {
    // Pregunta Fallada
    falladas++;
    evento.target.classList.add("incorrecta");
    botones.forEach((boton) => {
      if (respuestaCorrecta == boton.value) {
        boton.classList.remove("boton");
        boton.classList.add("acertada");
      }
    });
  }

  // Deshabilitar botones temporalmente
  botones.forEach((boton) => {
    boton.disabled = true;
  });

  // Esperar 1 segundo antes de eliminar las clases y habilitar botones
  setTimeout(function () {
    // Eliminar las clases después de 1 segundo
    botones.forEach((boton) => {
      boton.classList.remove("acertada", "incorrecta");
      boton.classList.add("boton")
    });

    // Habilitar botones
    botones.forEach((boton) => {
      boton.disabled = false;
    });

    // Compruebo que no ha llegado a la última pregunta y puedo seguir mostrando
    if (indicePregunta >= 19) {
      // Llamo a la función mostrar resultados
      mostrarResultados();
    } else {
      // Incremento el índice de la pregunta y cargo la siguiente pregunta
      indicePregunta++;
      cargarPregunta();
    }
  }, 1300);
};

const mostrarResultados = function () {
  // Escondo la seccion de juego
  seccionJuego.style.display = "none";
  // Muestro la seccion de resultados
  seccionResultados.style.display = "block";

  let numAcertadas = document.getElementById("preguntasCorrectas");
  let numFalladas = document.getElementById("preguntasFalladas");
  let porcentaje = document.getElementById("porcentaje");

  // Agrego el evento al btnVolver
  document.getElementById("volver").addEventListener("click", function () {
    location.reload();
  });

  // Agrego el texto a los elementos
  numAcertadas.textContent = acertadas;
  numFalladas.textContent = falladas;

  // Calcular el porcentaje
  const totalPreguntas = arrayPreguntas.length;
  const porcentajeAciertos = (acertadas / totalPreguntas) * 100;

  porcentaje.textContent = `${porcentajeAciertos.toFixed(2)}%`;
};

/* GLOBAL VARIABLES */
let acertadas = 0;
let falladas = 0;
let indicePregunta = 0;
let arrayPreguntas;
let seccionEmpezar = document.getElementById("seccionEmpezar");
let seccionJuego = document.getElementById("seccionJuego");
let seccionResultados = document.getElementById("seccionResultados");
let botonEmpezar = document.getElementById("botonEmpezar");
let numPreguntas = document.getElementById("num-preguntas");
let enunciado = document.getElementById("pregunta");
let divRespuestas = document.querySelector(".respuestas");
let botones = divRespuestas.querySelectorAll("button");
botones.forEach((boton) => {
  boton.addEventListener("click", comprobarRespuesta);
});

// Aplica el evento nada mas se cargue la página
document.addEventListener("DOMContentLoaded", function () {
  // Agrega un evento al botón "EMPEZAR"
  botonEmpezar.addEventListener("click", async function () {
    // Oculta la sección de empezar
    seccionEmpezar.style.display = "none";

    // Saco el response y cogo el results que contiene el array de preguntas
    let api = await fetchQuizzAPI();
    arrayPreguntas = api.results;

    setTimeout(async () => {
      // Muestra la sección de juego después de la animación
      seccionJuego.style.display = "block";

      // invoco a la función que carga la pregunta
      cargarPregunta();
    }, 300); // Este tiempo debe coincidir con la duración de la animacion
  });
});

// Funcion para los datos de quizz API
async function fetchQuizzAPI() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=20&category=31&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar hacer el fetch de la API");
  }
}
