console.log("JS cargado");

// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "PEGA_AQUI_TU_ANON_PUBLIC_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔘 EVENTOS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("registerBtn").addEventListener("click", register);
  document.getElementById("postBtn").addEventListener("click", createPost);
});

// 🔁 CAMBIO DE VISTAS
function showRegister() {
  login.style.display = "none";
  register.style.display = "block";
}

function showLogin() {
  register.style.display = "none";
  login.style.display = "block";
}

// 🧾 REGISTRO
async function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const username = document.getElementById("reg-username").value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Cuenta creada. Ahora inicia sesión.");
  showLogin();
}

// 🔐 LOGIN
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);

  login.style.display = "none";
  app.style.display = "block";
  loadFeed();
}

// 📝 POST
async function createPost() {
  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from("posts").insert({
    user_id: user.id,
    content: document.getElementById("post-input").value,
    emotion: document.getElementById("emotion").value
  });

  document.getElementById("post-input").value = "";
  loadFeed();
}

// 📰 FEED
async function loadFeed() {
  const feed = document.getElementById("feed");

  const { data } = await supabase
    .from("posts")
    .select("content, emotion, profiles(username)")
    .order("created_at", { ascending: false });

  feed.innerHTML = "";

  data.forEach(p => {
    feed.innerHTML += `
      <div class="card">
        <strong>@${p.profiles.username}</strong>
        <p>${p.emotion} ${p.content}</p>
      </div>
    `;
  });
}
