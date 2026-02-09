// ======= Variables =======
let currentUser = null;

// ======= Login / Register =======
function showRegister() {
    document.getElementById('login-screen').style.display='none';
    document.getElementById('register-screen').style.display='flex';
}

function showLogin() {
    document.getElementById('register-screen').style.display='none';
    document.getElementById('login-screen').style.display='flex';
}

// Registro
function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    if(!username || !password) { alert("Llena todos los campos"); return; }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if(users.find(u=>u.username===username)) { alert("Usuario ya existe"); return; }

    users.push({username,password,emotion:'',talents:[],messages:{}});
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registro exitoso. Ahora inicia sesión.");
    showLogin();
}

// Login
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u=>u.username===username && u.password===password);

    if(!user){ alert("Usuario o contraseña incorrectos"); return; }

    currentUser = user;
    document.getElementById('login-screen').style.display='none';
    document.getElementById('register-screen').style.display='none';
    document.getElementById('main-app').style.display='block';

    updateProfile();
    showSection('inicio');
    updateFeed();
    updateTalentFeed();
    updateEmotionFeed();
    updateFriends();
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('main-app').style.display='none';
    document.getElementById('login-screen').style.display='flex';
}

// ======= Navegación =======
function showSection(section){
    document.querySelectorAll('.section').forEach(s=>s.style.display='none');
    document.getElementById(section).style.display='block';
}

// ======= Perfil =======
function updateProfile() {
    document.getElementById('profile-name').innerText = currentUser.username;
    document.getElementById('profile-emotion').innerText = currentUser.emotion || 'No definido';
}

// ======= Emociones =======
function setEmotion() {
    const emotion = document.getElementById('emotion-input').value.trim();
    if(!emotion) return;
    currentUser.emotion = emotion;
    saveUser();
    updateProfile();
    updateEmotionFeed();
    document.getElementById('emotion-input').value='';
}

function updateEmotionFeed() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let container = document.getElementById('emotion-feed');
    container.innerHTML='';
    users.forEach(u=>{
        container.innerHTML += `<div class="card"><strong>${u.username}</strong>: ${u.emotion || 'No definido'}</div>`;
    });
}

// ======= Talento =======
function addTalent() {
    const talent = document.getElementById('talent-input').value.trim();
    if(!talent) return;
    currentUser.talents.push(talent);
    saveUser();
    updateTalentFeed();
    document.getElementById('talent-input').value='';
}

function updateTalentFeed() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let container = document.getElementById('talent-feed');
    container.innerHTML='';
    users.forEach(u=>{
        u.talents.forEach(t=>{
            container.innerHTML += `<div class="card"><strong>${u.username}</strong>: ${t}</div>`;
        });
    });
}

// ======= Feed General =======
function updateFeed() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let container = document.getElementById('feed');
    container.innerHTML='';
    users.forEach(u=>{
        container.innerHTML += `<div class="card"><strong>${u.username}</strong><br>
        Emoción: ${u.emotion || 'No definido'}<br>
        Talentos: ${u.talents.join(', ') || 'Ninguno'}</div>`;
    });
}

// ======= Mensajes =======
function updateFriends() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let container = document.getElementById('friends-list');
    container.innerHTML='';
    users.forEach(u=>{
        if(u.username!==currentUser.username){
            container.innerHTML+=`<div class="card" onclick="openChat('${u.username}')">${u.username}</div>`;
        }
    });
}

function openChat(friend){
    document.getElementById('chat-window').style.display='block';
    document.getElementById('chat-with').innerText=friend;
    loadMessages(friend);
}

function sendMessage(){
    const friend = document.getElementById('chat-with').innerText;
    const message = document.getElementById('chat-input').value.trim();
    if(!message) return;
    if(!currentUser.messages[friend]) currentUser.messages[friend]=[];
    currentUser.messages[friend].push(`Tú: ${message}`);
    saveUser();
    document.getElementById('chat-input').value='';
    loadMessages(friend);
}

function loadMessages(friend){
    let container = document.getElementById('chat-messages');
    container.innerHTML='';
    if(currentUser.messages[friend]){
        currentUser.messages[friend].forEach(m=>{
            container.innerHTML += `<div class="card">${m}</div>`;
        });
    }
}

// ======= Guardar usuario =======
function saveUser(){
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let index = users.findIndex(u=>u.username===currentUser.username);
    users[index]=currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    updateFeed();
}

// ======= Buscar usuarios =======
function searchUsers(){
    const term = document.getElementById('search-bar').value.toLowerCase();
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let container = document.getElementById('feed');
    container.innerHTML='';
    users.filter(u=>u.username.toLowerCase().includes(term)).forEach(u=>{
        container.innerHTML += `<div class="card"><strong>${u.username}</strong><br>
        Emoción: ${u.emotion || 'No definido'}<br>
        Talentos: ${u.talents.join(', ') || 'Ninguno'}</div>`;
    });
}
