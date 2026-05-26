const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const form = document.getElementById("usernameForm");
const input = document.getElementById("usernameInput");
const statusEl = document.getElementById("status");

const profileSection = document.getElementById("profile");
const reposSection = document.getElementById("reposSection");
const langsSection = document.getElementById("langsSection");

const setStatus = (msg, isError = false) => {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#ff9c9c" : "#9eb0d1";
};

const statItem = (label, value) => `<div class="stat"><div>${value}</div><small>${label}</small></div>`;

const loadPortfolio = async (username) => {
  setStatus("در حال دریافت اطلاعات از گیت‌هاب...");
  profileSection.classList.add("hidden");
  reposSection.classList.add("hidden");
  langsSection.classList.add("hidden");

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error("پروفایل پیدا نشد یا محدودیت API دارید.");
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    document.getElementById("avatar").src = profile.avatar_url;
    document.getElementById("name").textContent = profile.name || profile.login;
    document.getElementById("bio").textContent = profile.bio || "بیوگرافی ثبت نشده.";

    const gh = document.getElementById("githubLink");
    gh.href = profile.html_url;

    const blog = document.getElementById("blogLink");
    if (profile.blog) {
      blog.href = profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`;
      blog.classList.remove("hidden");
    } else {
      blog.classList.add("hidden");
    }

    document.getElementById("stats").innerHTML = [
      statItem("Follower", profile.followers),
      statItem("Following", profile.following),
      statItem("Public Repos", profile.public_repos),
      statItem("Gists", profile.public_gists),
    ].join("");

    const topRepos = [...repos]
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const reposEl = document.getElementById("repos");
    reposEl.innerHTML = topRepos
      .map(
        (r) => `
        <article class="repo-card">
          <h3><a target="_blank" rel="noreferrer" href="${r.html_url}">${r.name}</a></h3>
          <p class="muted">${r.description || "بدون توضیح"}</p>
          <div class="repo-meta">⭐ ${r.stargazers_count} • 🍴 ${r.forks_count} • ${r.language || "N/A"}</div>
        </article>
      `
      )
      .join("");

    const langCount = {};
    repos.forEach((r) => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });

    document.getElementById("langs").innerHTML = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([lang, count]) => `<span>${lang} (${count})</span>`)
      .join("");

    profileSection.classList.remove("hidden");
    reposSection.classList.remove("hidden");
    langsSection.classList.remove("hidden");
    setStatus("اطلاعات با موفقیت بارگذاری شد ✅");
  } catch (err) {
    setStatus(err.message, true);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = input.value.trim();
  if (username) {
    const url = new URL(window.location.href);
    url.searchParams.set("u", username);
    history.replaceState({}, "", url);
    loadPortfolio(username);
  }
});

const initial = new URLSearchParams(window.location.search).get("u");
if (initial) {
  input.value = initial;
  loadPortfolio(initial);
} else {
  setStatus("یوزرنیم گیت‌هاب را وارد کن تا پورتفولیو واقعی‌ات ساخته شود.");
}
