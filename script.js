const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatbox = document.getElementById("chatbox");
const fileInput = document.getElementById("fileInput");
const imageBtn = document.getElementById("imageBtn");

// Tu API Key de OpenAI
const API_KEY = "TU_API_KEY_AQUI";

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
    const imgUrl = data.data[0].url;
    appendMessageImage(imgUrl);
  } catch {
    appendMessage("Error al generar imagen.", "bot");
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    appendMessage("Archivo cargado: " + file.name, "user");
  }
});

// Funciones de ayuda
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
  img.style.maxWidth = "100%";
  div.appendChild(img);
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}
