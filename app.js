// 🔗 SUPABASE
const SUPABASE_URL = "https://jhugcpzjmggnhlnapyjz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodWdjcHpqbWdnbmhsbmFweWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjA5NTIsImV4cCI6MjA4NjIzNjk1Mn0.Nz5BeKKAWb8vsA40-yAgTy4wlK7Bl5iQsfijFkdDfx4"; // deja la tuya

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// 🔐 LOGIN
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    window.location.href = "app.html";
  }
});
}

// 🧾 REGISTRO
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const username = document.getElementById("regUsername").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    await supabaseClient.from("profiles").insert({
      id: data.user.id,
      username
    });

    alert("Cuenta creada");
    window.location.href = "index.html";
  });
}

// 📝 POST
const postBtn = document.getElementById("postBtn");
if (postBtn) {
  postBtn.addEventListener("click", async () => {
    const content = document.getElementById("postInput").value;
    const emotion = document.getElementById("emotion").value;

    const { data: userData } = await supabase.auth.getUser();

    await supabaseClient.from("posts").insert({
      user_id: userData.user.id,
      content,
      emotion
    });

    document.getElementById("postInput").value = "";
    loadFeed();
  });
}

// 📰 FEED
async function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const { data } = await supabaseClient
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

loadFeed();

