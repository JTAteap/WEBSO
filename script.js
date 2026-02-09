// ELEMENTOS PRINCIPALES
const welcomeScreen = document.getElementById("welcomeScreen");
const mainScreen = document.getElementById("mainScreen");
const usernameInput = document.getElementById("usernameInput");
const enterBtn = document.getElementById("enterBtn");
const usernameDisplay = document.getElementById("usernameDisplay");

const moodSelect = document.getElementById("moodSelect");

const postInput = document.getElementById("postInput");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");

const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const chatBox = document.getElementById("chatBox");

const talentoBtn = document.getElementById("talentoBtn");

// DATOS SIMULADOS
let posts = [];
let chatMessages = [];

// ENTRAR A LA APP
enterBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if(username !== ""){
        usernameDisplay.textContent = username;
        welcomeScreen.classList.add("hidden");
        mainScreen.classList.remove("hidden");
        updateMoodDisplay();
    }
});

// CAMBIO DE ESTADO DE ÁNIMO
moodSelect.addEventListener("change", updateMoodDisplay);

function updateMoodDisplay(){
    const mood = moodSelect.value;
    const colors = {
        feliz: "#fff59d",
        triste: "#90caf9",
        creativo: "#f48fb1",
        estresado: "#ef9a9a",
        motivado: "#a5d6a7"
    };
    mainScreen.style.background = colors[mood] + "33"; // color de fondo con transparencia
}

// PUBLICAR EN EL MURO
postBtn.addEventListener("click", () => {
    const text = postInput.value.trim();
    if(text !== ""){
        const post = {
            username: usernameDisplay.textContent,
            mood: moodSelect.value,
            text
        };
        posts.push(post);
        renderPosts();
        postInput.value = "";
    }
});

function renderPosts(){
    postsContainer.innerHTML = "";
    posts.slice().reverse().forEach(post => {
        const div = document.createElement("div");
        div.classList.add("post");
        div.style.background = moodColor(post.mood);
        div.textContent = `${post.username} (${post.mood}): ${post.text}`;
        postsContainer.appendChild(div);
    });
}

function moodColor(mood){
    const colors = {
        feliz: "#fff59d",
        triste: "#90caf9",
        creativo: "#f48fb1",
        estresado: "#ef9a9a",
        motivado: "#a5d6a7"
    };
    return colors[mood];
}

// CHAT SIMULADO
sendChatBtn.addEventListener("click", () => {
    const msg = chatInput.value.trim();
    if(msg !== ""){
        const message = {
            username: usernameDisplay.textContent,
            text: msg
        };
        chatMessages.push(message);
        renderChat();
        chatInput.value = "";
    }
});

function renderChat(){
    chatBox.innerHTML = "";
    chatMessages.slice().forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("chat-message");
        div.textContent = `${msg.username}: ${msg.text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// TALENTO DAY
talentoBtn.addEventListener("click", () => {
    alert("Talento Day: Próximamente podrás subir tus dibujos, música y más!");
});
