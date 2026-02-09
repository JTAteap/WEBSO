// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdjcHpqbWdnbmhsbmFweWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5NTIsImV4cCI6MjA4NjIzNjk1Mn0.Nz5BeKKAWb8vsA40-yAgTy4wlK7Bl5iQsfijFkdDfx4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔘 BOTONES
document.getElementById("loginBtn").onclick = login;
document.getElementById("registerBtn").onclick = register;
document.getElementById("postBtn").onclick = createPost;

// 🧾 REGISTRO
async function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const username = document.getElementById("reg-username").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Cuenta creada. Ahora inicia sesión.");
}

// 🔐 LOGIN

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Sesión iniciada");
}

// 📝 POST
async function createPost() {
  const content = document.getElementById("post-input").value;
  const emotion = document.getElementById("emotion").value;
  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from("posts").insert({
    user_id: user.id,
    content,
    emotion
  });

  postInput.value = "";
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


