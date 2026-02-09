let currentUser = null;
let selectedEmotion = "";

/* LOGIN / REGISTER */
function showRegister(){
    loginScreen(false);
}
function showLogin(){
    loginScreen(true);
}
function loginScreen(login=true){
    document.getElementById("login-screen").style.display = login?"flex":"none";
    document.getElementById("register-screen").style.display = login?"none":"flex";
}

function register(){
    const u = regUsername.value.trim();
    const p = regPassword.value.trim();
    if(!u||!p) return alert("Completa todo");
    let users = JSON.parse(localStorage.users||"[]");
    if(users.find(x=>x.username===u)) return alert("Usuario existe");
    users.push({username:u,password:p,emotion:null,messages:{}});
    localStorage.users = JSON.stringify(users);
    showLogin();
}

function login(){
    let users = JSON.parse(localStorage.users||"[]");
    const user = users.find(x=>x.username===username.value && x.password===password.value);
    if(!user) return alert("Error");
    currentUser = user;
    loginScreen(false);
    mainApp.style.display="block";
    updateUI();
}

/* NAV */
function showSection(id){
    document.querySelectorAll(".section").forEach(s=>s.style.display="none");
    document.getElementById(id).style.display="block";
}

/* EMOTIONS */
function selectEmotion(e){ selectedEmotion=e; }

function saveEmotion(){
    if(!selectedEmotion) return;
    currentUser.emotion = {emoji:selectedEmotion,text:emotionText.value};
    saveUser();
    updateUI();
    showSection("inicio");
}

/* UI */
function updateUI(){
    profileName.innerText = currentUser.username;
    profileEmotion.innerText = currentUser.emotion ? currentUser.emotion.emoji+" "+currentUser.emotion.text : "Sin estado";
    loadEmotionFeed();
    loadFeed();
    loadFriends();
}

function loadEmotionFeed(){
    emotionFeed.innerHTML="";
    JSON.parse(localStorage.users||"[]").forEach(u=>{
        if(u.emotion){
            emotionFeed.innerHTML += `<div class="story">${u.emotion.emoji}</div>`;
        }
    });
}

function loadFeed(){
    feed.innerHTML="";
    JSON.parse(localStorage.users||"[]").forEach(u=>{
        if(u.emotion){
            feed.innerHTML += `
            <div class="card">
                <strong>${u.username}</strong>
                <p>${u.emotion.emoji} ${u.emotion.text||""}</p>
                <div class="actions">
                    <span>🤍</span><span>💪</span><span>🙏</span>
                </div>
            </div>`;
        }
    });
}

/* CHAT */
function loadFriends(){
    friendsList.innerHTML="";
    JSON.parse(localStorage.users||"[]").forEach(u=>{
        if(u.username!==currentUser.username){
            friendsList.innerHTML+=`<div class="card" onclick="openChat('${u.username}')">${u.username}</div>`;
        }
    });
}

function openChat(u){
    chatWith.innerText=u;
    loadMessages(u);
}

function sendMessage(){
    const f=chatWith.innerText;
    if(!currentUser.messages[f]) currentUser.messages[f]=[];
    currentUser.messages[f].push(chatInput.value);
    chatInput.value="";
    saveUser();
    loadMessages(f);
}

function loadMessages(f){
    chatMessages.innerHTML="";
    (currentUser.messages[f]||[]).forEach(m=>{
        chatMessages.innerHTML+=`<div class="card">${m}</div>`;
    });
}

function saveUser(){
    let users=JSON.parse(localStorage.users);
    users[users.findIndex(u=>u.username===currentUser.username)]=currentUser;
    localStorage.users=JSON.stringify(users);
}
