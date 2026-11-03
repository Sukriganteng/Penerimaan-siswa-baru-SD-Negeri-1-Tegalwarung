/* ===== KONFIGURASI: ubah data sekolah di sini ===== */
const CONFIG = {
  alamat: "Jl. Honggokusuman No. 1, Tegalwarung , Kab. Grobogan, Jawa Tengah",
  telp: "(08132) 7635272 ",
  email: "sdn1tegalwarung@gmail.com",
  jam: "Senin–Jumat, 07.30–14.00 WIB",
  waNumber: "6281327635272",                 // format internasional tanpa +
  penutupan: "2027-06-20T23:59:59",          // batas akhir pendaftaran (hitung mundur)
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfXKyx2ZD_I2dTOP3AePLD89OkgBXpJm6Ra4cEjZv7dvC0_Ig/viewform",   // tautan Google Form pendaftaran
  maps: "https://www.google.com/maps/search/?api=1&query=Desa kalisari, Kecamatan Kradenan, Kabupaten Grobogan, Jawa Tengah",
  instagram: "https://instagram.com/", facebook: "https://facebook.com/", youtube: "https://youtube.com/"
};
const $ = (s, c = document) => c.querySelector(s);
const waLink = (t = "Halo, saya ingin bertanya tentang SPMB SDN 1 Tegalwarung.") => `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(t)}`;

/* Isi data kontak & tautan */
document.querySelectorAll("[data-c]").forEach(e => e.textContent = CONFIG[e.dataset.c]);
document.querySelectorAll("[data-c-href]").forEach(e => { e.href = CONFIG[e.dataset.cHref]; e.target = "_blank"; e.rel = "noopener"; });
$("#wa").href = $("#wa-btn").href = waLink(); $("#map-btn").href = CONFIG.maps;

/* Mode terang/gelap (disimpan bila memungkinkan) */
const root = document.documentElement;
try { const s = localStorage.getItem("theme"); if (s) root.dataset.theme = s; } catch (e) {}
$("#theme").onclick = () => {
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
};

/* Menu mobile */
$("#burger").onclick = () => document.body.classList.toggle("menu-open");
$("#links").onclick = () => document.body.classList.remove("menu-open");

/* Hitung mundur */
const cd = $("#count");
function tick() {
  let d = new Date(CONFIG.penutupan) - new Date();
  if (d <= 0) { cd.innerHTML = "<div><b>🔒</b><small>Ditutup</small></div>"; return; }
  const v = [["Hari", 864e5], ["Jam", 36e5], ["Menit", 6e4], ["Detik", 1e3]].map(([n, ms]) => { const x = Math.floor(d / ms); d -= x * ms; return `<div><b>${String(x).padStart(2, "0")}</b><small>${n}</small></div>`; });
  cd.innerHTML = v.join("");
}
tick(); setInterval(tick, 1000);

/* Animasi muncul + angka naik saat terlihat */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("show");
  const n = e.target.querySelector("[data-to]");
  if (n && !n.dataset.done) {
    n.dataset.done = 1; const to = +n.dataset.to; let i = 0;
    const t = setInterval(() => { i += Math.max(1, Math.ceil(to / 40)); if (i >= to) { i = to; clearInterval(t); } n.textContent = i; }, 35);
  }
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll(".rv").forEach(e => io.observe(e));

/* ===== HALAMAN TERPISAH: tiap menu = 1 halaman (alamat #nama) ===== */
const PAGES = ["beranda","tentang","alur","syarat","jadwal","daftar","faq","galeri","kontak"];
const TITLES = {beranda:"Beranda",tentang:"Tentang Sekolah",alur:"Alur Pendaftaran",syarat:"Persyaratan",jadwal:"Jadwal Penting",daftar:"Formulir Pendaftaran",faq:"FAQ",galeri:"Galeri Kegiatan",kontak:"Kontak & Lokasi"};
const secs = [...document.querySelectorAll("body > section")];
const keyOf = s => ({statistik:"tentang", menu:"beranda"})[s.id] || s.id;   // bagian yang ikut halaman lain
function route() {
  let p = location.hash.slice(1); if (!PAGES.includes(p)) p = "beranda";
  let first = true;
  secs.forEach(s => {
    const on = keyOf(s) === p;
    s.style.display = on ? "" : "none";
    s.style.paddingTop = on && first && p !== "beranda" ? "calc(104px + env(safe-area-inset-top,0px))" : "";
    if (on) first = false;
  });
  document.querySelectorAll("#links a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + p));
  scrollTo({top:0, behavior:"instant"});
}
addEventListener("hashchange", route); route();

/* ===== PENCARIAN (logo 🔍 pojok kanan atas) ===== */
const INDEX = {};
secs.forEach(s => { const k = keyOf(s); INDEX[k] = ((INDEX[k] || "") + " " + s.textContent).replace(/\s+/g, " "); });
const sBox = $("#search"), q = $("#q"), res = $("#res");
function openS(o) { sBox.classList.toggle("open", o); $("#hint").style.display = "none"; if (o) { q.value = ""; find(); q.focus(); } }
function find() {
  const t = q.value.trim().toLowerCase(); res.textContent = "";
  PAGES.forEach(p => {
    const txt = INDEX[p], i = t ? txt.toLowerCase().indexOf(t) : 0;
    if (i < 0) return;
    const a = document.createElement("a"), b = document.createElement("b");
    a.href = "#" + p; b.textContent = TITLES[p]; a.append(b);
    if (t) { const m = document.createElement("small"); m.textContent = "…" + txt.slice(Math.max(0, i - 30), i + 80) + "…"; a.append(m); }
    a.onclick = () => openS(false); res.append(a);
  });
  if (!res.children.length) res.textContent = "Tidak ditemukan. Coba kata lain, misalnya “syarat” atau “jadwal”.";
}
$("#srch").onclick = () => openS(true); $("#sx").onclick = () => openS(false); q.oninput = find;
sBox.onclick = e => { if (e.target === sBox) openS(false); };
addEventListener("keydown", e => { if (e.key === "Escape") openS(false); });
$("#hint").onclick = () => $("#hint").style.display = "none";
setTimeout(() => $("#hint").style.display = "none", 9000);

/* Tombol kembali ke atas */
addEventListener("scroll", () => $("#top").style.display = scrollY > 500 ? "grid" : "none");
$("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* Semua tombol pendaftaran langsung menuju Google Form */
document.querySelectorAll("[data-form]").forEach(a => a.href = CONFIG.formUrl);
