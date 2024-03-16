// HTML elementlerini seçme
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const defaultText = document.querySelector(".default-text");

// Kullanıcı girişini temsil eden değişken
let userText = null;

// OpenAI API anahtarını tanımlama
const API_KEY = "";

// HTML elementi oluşturma fonksiyonu
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// Chat yanıtını almak için fonksiyon
const getChatResponse = async (incomingChatDiv) => {
  // OpenAI API'sine istek gönderme
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const pElement = document.createElement("p");
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [{
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `${userText}`,
      },
    ],
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    if (response && response.choices && response.choices.length > 0) {
      pElement.textContent = response.choices[0].message.content;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.log(error);
    pElement.classList.add("error");
    pElement.textContent = "Bir Sorun Oluştu !";
  }
  // yazım animasyonunu ekrandan kaldırma
  incomingChatDiv.querySelector(".typing-animation").remove();
  // apiden gelen cevabı ekrana aktarma
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatInput.value = " ";
};

// Yazıyor animasyonunu gösterme
const showTypingAnimation = () => {
  const html = `
    <div class="chat-content">
      <div class="chat-details">
        <img src="./images/chatbot.jpg" alt="" />
        <div class="typing-animation">
          <div class="typing-dot" style="--delay: 0.2s"></div>
          <div class="typing-dot" style="--delay: 0.3s"></div>
          <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
      </div>
    </div>
  `;
  // Gelen mesajı içeren div oluşturma ve chatContainer'a ekleme
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  // API'den gelen yanıtı almak için getChatResponse fonksiyonunu çağırma
  getChatResponse(incomingChatDiv);
};

// Gönderme butonuna tıklandığında çalışacak fonksiyon
const handleOutGoingChat = () => {
  // Kullanıcının girdisini al
  userText = chatInput.value.trim();
  if (!userText) return; // Boş girdi kontrolü
  // Gönderenin mesajını içeren div oluştur ve chatContainer'a ekle
  const html = `
    <div class="chat-content">
      <div class="chat-details">
        <img src="./images/ben.jpg" alt="" />
        <p></p>
      </div>
    </div>
  `;
  // Çıkış mesajı oluşturma ve ekleme
  const defaultTextElement = document.querySelector(".default-text");
  if (defaultTextElement) {
    defaultTextElement.remove();
  }
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

// Enter tuşuna basıldığında istek at
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleOutGoingChat();
  }
});

// Gönderme butonuna tıklandığında
sendButton.addEventListener("click", handleOutGoingChat);

// Tema değiştirme butonuna tıklandığında
themeButton.addEventListener("click", () => {
  // Temayı değiştirme
  document.body.classList.toggle("light-mode");
  // Tema butonunun metnini güncelleme
  themeButton.innerText = document.body.classList.contains("light-mode") ?
    "dark_mode" :
    "light_mode";
});

// Sohbeti silme butonuna tıklandığında
deleteButton.addEventListener("click", () => {
  // Kullanıcıdan onay alarak sohbeti silme
  if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")) {
    chatContainer.innerHTML = ""; // ChatContainer'ın içeriğini boşaltma
  }
  // Sayfanın içeriğini varsayılan olarak yeniden yükleme
  const defaultHTML = `
    <div class="default-text">
      <h1>ChatGPT Clone</h1>
    </div>
    <div class="typing-container">
      <div class="typing-content">
        <div class="typing-textarea">
          <textarea
            id="chat-input"
            placeholder="Enter a prompt here"
            required
          ></textarea>
          <span id="send-btn" class="material-symbols-outlined"> send </span>
        </div>
        <div class="typing-controls">
          <span id="theme-btn" class="material-symbols-outlined">
            light_mode
          </span>
          <span id="delete-btn" class="material-symbols-outlined">
            delete
          </span>
        </div>
      </div>
    </div>
  `;
  document.body.innerHTML = defaultHTML; // Sayfanın içeriğini varsayılan olarak değiştirme
});