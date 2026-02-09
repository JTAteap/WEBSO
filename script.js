console.log("JS cargado correctamente");

// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdjcHpqbWdnbmhsbmFweWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5NTIsImV4cCI6MjA4NjIzNjk1Mn0.Nz5BeKKAWb8vsA40-yAgTy4wlK7Bl5iQsfijFkdDfx4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// 🎯 EVENTOS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("registerBtn").addEventListener("click", register);
  document.getElementById("postBtn").addEventListener("click", createPost);
});

// 🧾 REGISTRO
async function register() {
  const email = reg-email.value;
  const password = reg-password.value;
  const username = reg-username.value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Cuenta creada. Inicia sesión.");
}

// 🔐 LOGIN
async function login() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) return alert(error.message);

  auth.style.display = "none";
  app.style.display = "block";

  loadFeed();
}

// 📝 POST
async function createPost() {
  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from("posts").insert({
    user_id: user.id,
    content: post-input.value,
    emotion: emotion.value
  });

  post-input.value = "";
  loadFeed();
}

// 📰 FEED
async function loadFeed() {
  const { data } = await supabase
    .from("posts")
    .select("id, content, emotion, likes, profiles(username)")
    .order("created_at", { ascending: false });

  feed.innerHTML = "";

  data.forEach(p => {
    feed.innerHTML += `
      <div class="card">
        <strong>@${p.profiles.username}</strong>
        <p>${p.emotion} ${p.content}</p>
        <span class="like">❤️ ${p.likes || 0}</span>
      </div>
    `;
  });
}
