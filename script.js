// 🔗 SUPABASE CONFIG
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdjcHpqbWdnbmhsbmFweWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5NTIsImV4cCI6MjA4NjIzNjk1Mn0.Nz5BeKKAWb8vsA40-yAgTy4wlK7Bl5iQsfijFkdDfx4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// AUTO LOGIN
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadFeed();
  }
});

// REGISTER
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

  alert("Cuenta creada, ahora inicia sesión.");
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";
  loadFeed();
}

// LOGOUT
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// POST
async function post() {
  const content = document.getElementById("post-input").value;
  if (!content) return;

  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from("posts").insert({
    user_id: user.id,
    content
  });

  document.getElementById("post-input").value = "";
  loadFeed();
}

// LOAD FEED
async function loadFeed() {
  const { data } = await supabase
    .from("posts")
    .select("content, created_at, profiles(username)")
    .order("created_at", { ascending: false });

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  data.forEach(p => {
    feed.innerHTML += `
      <div class="card">
        <strong>@${p.profiles.username}</strong>
        <p>${p.content}</p>
      </div>
    `;
  });
}
