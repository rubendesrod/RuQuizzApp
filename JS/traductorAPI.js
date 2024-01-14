async function traducirPregunta(pregunta) {
  const preguntaEnIngles = pregunta;
  const subscriptionKey = 'TU_CLAVE_DE_SUBSCRIPCIÓN'; // Obtén tu clave de suscripción gratuita desde Azure
  const endpoint = 'https://api.cognitive.microsofttranslator.com';
  const region = 'northeurope'; // Por ejemplo, 'westus'

  const url = `${endpoint}/translate?api-version=3.0&to=es`;

  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Ocp-Apim-Subscription-Region': region,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ Text: preguntaEnIngles }]),
  });

  const data = await respuesta.json();
  const preguntaEnEspanol = data[0].translations[0].text;

  // Haz algo con la pregunta traducida
  console.log(preguntaEnEspanol);
}