
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatbox = document.getElementById("chatbox");
const fileInput = document.getElementById("fileInput");
const imageBtn = document.getElementById("imageBtn");

// Tu API Key directamente (solo para uso personal)
const API_KEY = "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";

// Enviar mensaje de texto
sendBtn.addEventListener("click", async () => {
  const texto = userInput.value;
  if (!texto) return;

  appendMessage("Tú: " + texto, "user");
  userInput.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: texto }]
      })
    });
    const data = await response.json();
    appendMessage("IA: " + data.choices[0].message.content, "bot");
  } catch {
    appendMessage("Error al conectarse con la IA.", "bot");
  }
});

// Generar imagen
imageBtn.addEventListener("click", async () => {
  const texto = userInput.value;
  if (!texto) return;

  appendMessage("Tú (imagen): " + texto, "user");
  userInput.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: texto,
        n: 1,
        size: "512x512"
      })
    });
    const data = await response.json();
    appendMessageImage(data.data[0].url);
  } catch {
    appendMessage("Error al generar imagen.", "bot");
  }
});

// Subir archivos
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    appendMessage("Archivo cargado: " + file.name, "user");
  }
});

// Funciones para mostrar mensajes
function appendMessage(text, cls) {
  const div = document.createElement("div");
  div.classList.add("message", cls);
  div.textContent = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function appendMessageImage(url) {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  const img = document.createElement("img");
  img.src = url;
  div.appendChild(img);
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}
