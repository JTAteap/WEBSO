// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "PEGA_AQUI_TU_ANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔐 LOGIN
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "app.html";
}

// 🧾 REGISTRO
async function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const username = document.getElementById("reg-username").value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Cuenta creada");
  window.location.href = "index.html";
}

// 🔒 PROTECCIÓN APP
async function checkSession() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
  }
}

// 📝 POST
async function createPost() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

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
  if (!feed) return;

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

// SOLO SE EJECUTA EN app.html
if (window.location.pathname.includes("app.html")) {
  checkSession();
  loadFeed();
}
