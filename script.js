// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "PEGA_AQUI_TU_ANON_KEY_REAL";

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
  const email = regEmail.value;
  const password = regPassword.value;
  const username = document.getElementById("reg-username").value;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  alert("Cuenta creada, ahora inicia sesión");
}

// 🔐 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  auth.style.display = "none";
  app.style.display = "block";
  loadFeed();
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
