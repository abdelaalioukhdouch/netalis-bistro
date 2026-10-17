import { useState, useEffect, useMemo } from "react";
import {
  Menu as MenuIcon, X, MessageCircle, Phone, MapPin, Clock, Leaf, ChefHat, Flame,
  ShoppingBag, Plus, Minus, Trash2, Star, Instagram, Facebook, Music2, Send, Check,
  ChevronLeft, ChevronRight, Sprout, Heart,
} from "lucide-react";

/* ───────────── CONFIGURATION (modifiez ici pour chaque client) ───────────── */
const RESTAURANT = {
  name: "Netalis Bistro",
  tagline: "Cuisine de saison, faite maison, servie avec le sourire",
  whatsapp: "33604677853", // format international, sans + ni espaces
  phoneDisplay: "+33 6 04 67 78 53",
  address: "12 rue de la République, 69002 Lyon",
  mapQuery: "12 rue de la République, 69002 Lyon",
  currency: "€",
  hours: [
    ["Lundi", "Fermé"],
    ["Mardi – Jeudi", "12:00 – 14:30 · 19:00 – 22:30"],
    ["Vendredi – Samedi", "12:00 – 14:30 · 19:00 – 23:30"],
    ["Dimanche", "12:00 – 16:00"],
  ],
  social: { instagram: "#", facebook: "#", tiktok: "#" },
};

const U = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const HERO_SLIDES = [
  U("photo-1414235077428-338989a2e8c0", 1600),
  U("photo-1517248135467-4c7edcad34c4", 1600),
  U("photo-1555396273-367ea4eb4db5", 1600),
];

const CATEGORIES = ["Entrées", "Plats principaux", "Desserts", "Boissons"];

const DISHES = [
  { id: 1, cat: "Entrées", name: "Burrata crémeuse", desc: "Tomates anciennes, basilic, huile d'olive vierge, focaccia tiède.", price: 12, img: U("photo-1546069901-ba9599a7e63c"), badges: ["Végétarien"] },
  { id: 2, cat: "Entrées", name: "Velouté de saison", desc: "Légumes du marché, crème fraîche, croûtons dorés au beurre.", price: 9, img: U("photo-1498837167922-ddd27525d352"), badges: ["Végétarien"] },
  { id: 3, cat: "Entrées", name: "Crevettes à l'ail pimenté", desc: "Sautées à la poêle, piment d'Espelette, citron vert.", price: 14, img: U("photo-1565299624946-b28f40a0ae38"), badges: ["Épicé"] },
  { id: 4, cat: "Plats principaux", name: "Entrecôte maturée", desc: "300 g, beurre maître d'hôtel, frites maison, salade verte.", price: 29, img: U("photo-1544025162-d76694265947"), badges: ["Spécialité"] },
  { id: 5, cat: "Plats principaux", name: "Tagliatelles aux champignons", desc: "Pâtes fraîches, cèpes, parmesan 24 mois, persil.", price: 19, img: U("photo-1473093295043-cdd812d0e601"), badges: ["Végétarien"] },
  { id: 6, cat: "Plats principaux", name: "Burger du Bistro", desc: "Bœuf français, cheddar affiné, oignons confits, sauce maison.", price: 17, img: U("photo-1551782450-a2132b4ba21d"), badges: ["Spécialité"] },
  { id: 7, cat: "Plats principaux", name: "Bowl végétal & harissa", desc: "Quinoa, pois chiches rôtis, légumes grillés, sauce harissa.", price: 16, img: U("photo-1512621776951-a57141f2eefd"), badges: ["Végétarien", "Épicé"] },
  { id: 8, cat: "Desserts", name: "Fondant au chocolat", desc: "Cœur coulant, glace vanille de Madagascar.", price: 9, img: U("photo-1551024601-bec78aea704b"), badges: ["Spécialité", "Végétarien"] },
  { id: 9, cat: "Desserts", name: "Pancakes au sirop d'érable", desc: "Fruits frais, chantilly légère, noisettes torréfiées.", price: 8, img: U("photo-1567620905732-2d1ec7ab7445"), badges: ["Végétarien"] },
  { id: 10, cat: "Boissons", name: "Cocktail signature", desc: "Gin, sirop de romarin, citron, tonic artisanal.", price: 11, img: U("photo-1544145945-f90425340c7e"), badges: ["Spécialité"] },
  { id: 11, cat: "Boissons", name: "Café de spécialité", desc: "Grains torréfiés localement, servi avec un petit biscuit.", price: 3.5, img: U("photo-1509042239860-f550ce710b93"), badges: ["Végétarien"] },
  { id: 12, cat: "Boissons", name: "Limonade maison", desc: "Citron pressé, menthe fraîche, eau pétillante.", price: 5, img: U("photo-1571877227200-a0d98ea607e9"), badges: ["Végétarien"] },
];

const REVIEWS = [
  { name: "Camille D.", text: "Une cuisine généreuse et pleine de goût. L'entrecôte était parfaite, le service chaleureux du début à la fin.", rating: 5 },
  { name: "Karim B.", text: "Nous venons chaque semaine. Les produits sont frais, la carte change souvent et l'ambiance est très agréable.", rating: 5 },
  { name: "Sophie L.", text: "Excellent choix végétarien, ce qui est rare. Le fondant au chocolat vaut à lui seul le détour.", rating: 5 },
];

const GALLERY = [
  U("photo-1559339352-11d035aa65de", 700), U("photo-1504674900247-0877df9cc836", 700),
  U("photo-1540189549336-e6e99c3679fe", 700), U("photo-1565958011703-44f9829ba187", 700),
  U("photo-1600891964092-4316c288032e", 700), U("photo-1525351484163-7529414344d8", 700),
];

const NAV = [
  ["hero", "Accueil"], ["menu", "Menu"], ["about", "À propos"], ["reviews", "Avis"], ["contact", "Contact"],
];

const BADGE_STYLE = {
  "Spécialité": { cls: "bg-amber-500 text-gray-900", Icon: ChefHat },
  "Végétarien": { cls: "bg-emerald-500/90 text-gray-900", Icon: Leaf },
  "Épicé": { cls: "bg-red-500 text-white", Icon: Flame },
};

/* ───────────── UTILITAIRES ───────────── */
const fmt = (n) => `${n % 1 ? n.toFixed(2).replace(".", ",") : n}${RESTAURANT.currency}`;
const wa = (text) => `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`;
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Img({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-800`} role="img" aria-label={alt} />;
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={className} />;
}

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Heading({ title, sub }) {
  return (
    <div className="mb-12 max-w-2xl">
      <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-gray-400">{sub}</p>}
    </div>
  );
}

/* ───────────── HEADER ───────────── */
function Header({ cartCount, onCart }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (id) => { setOpen(false); setTimeout(() => scrollToId(id), 50); };

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled || open ? "bg-gray-900/95 shadow-lg shadow-black/30 backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => go("hero")} className="font-display text-2xl font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500">
          {RESTAURANT.name}
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {NAV.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="text-sm font-medium text-gray-300 transition-colors hover:text-amber-500">
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onCart} aria-label={`Ouvrir le panier, ${cartCount} article(s)`} className="relative rounded-full p-2.5 text-gray-200 transition hover:bg-white/10 hover:text-amber-500">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-gray-900">{cartCount}</span>
            )}
          </button>
          <button onClick={() => go("contact")} className="hidden rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-400 sm:block">
            Réserver
          </button>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} className="rounded-full p-2.5 text-white transition hover:bg-white/10 md:hidden">
            {open ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      <div className={`grid overflow-hidden transition-all duration-300 md:hidden ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <nav className="min-h-0 overflow-hidden" aria-label="Navigation mobile">
          <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
            {NAV.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="rounded-xl px-4 py-3.5 text-left text-lg font-medium text-gray-200 transition hover:bg-white/5 hover:text-amber-500">
                {label}
              </button>
            ))}
            <a href={wa("Bonjour, je souhaite réserver une table.")} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3.5 font-semibold text-gray-900">
              <MessageCircle size={20} /> Commander via WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ───────────── HERO ───────────── */
function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [i]);
  const step = (d) => setI((p) => (p + d + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-end overflow-hidden bg-gray-900 pb-20 pt-32 sm:items-center sm:pb-0">
      {HERO_SLIDES.map((src, n) => (
        <img key={src} src={src} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${n === i ? "opacity-100" : "opacity-0"}`} onError={(e) => (e.currentTarget.style.display = "none")} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/40" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gray-900/50 px-4 py-1.5 text-sm text-amber-400 backdrop-blur">
          <Sprout size={16} /> Produits frais, préparés chaque jour
        </p>
        <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl">
          Ici, on cuisine comme à la maison, en mieux.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300 sm:text-xl">{RESTAURANT.tagline}.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => scrollToId("menu")} className="rounded-full bg-amber-500 px-8 py-4 font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:bg-amber-400">
            Découvrir le menu
          </button>
          <a href={wa("Bonjour, je souhaite passer commande.")} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
            <MessageCircle size={20} /> Commander sur WhatsApp
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 right-5 flex items-center gap-3 sm:right-8">
        <button onClick={() => step(-1)} aria-label="Image précédente" className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/15"><ChevronLeft size={18} /></button>
        <div className="flex gap-1.5">
          {HERO_SLIDES.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Image ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-amber-500" : "w-3 bg-white/40"}`} />
          ))}
        </div>
        <button onClick={() => step(1)} aria-label="Image suivante" className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/15"><ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

/* ───────────── MENU ───────────── */
function DishCard({ dish, qty, onAdd }) {
  const orderNow = wa(`Bonjour, je souhaite commander : 1 × ${dish.name} (${fmt(dish.price)}).`);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-800/60 transition hover:border-amber-500/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img src={dish.img} alt={dish.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {dish.badges.map((b) => {
            const { cls, Icon } = BADGE_STYLE[b];
            return <span key={b} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}><Icon size={12} />{b}</span>;
          })}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-white">{dish.name}</h3>
          <span className="shrink-0 text-lg font-bold text-amber-500">{fmt(dish.price)}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{dish.desc}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={() => onAdd(dish)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-500 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-amber-400 active:scale-95">
            <Plus size={16} /> Ajouter{qty > 0 && ` (${qty})`}
          </button>
          <a href={orderNow} target="_blank" rel="noreferrer" aria-label={`Commander ${dish.name} sur WhatsApp`} className="flex items-center justify-center rounded-full border border-white/20 px-4 text-white transition hover:border-emerald-400 hover:text-emerald-400">
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

function MenuSection({ cart, onAdd }) {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const list = useMemo(() => DISHES.filter((d) => d.cat === cat), [cat]);
  return (
    <Section id="menu" className="bg-gray-900">
      <Heading title="Notre carte" sub="Des plats préparés chaque jour avec des produits de saison. Ajoutez vos envies au panier et envoyez votre commande en un message." />
      <div role="tablist" className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {CATEGORIES.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-6 py-2.5 text-sm font-semibold transition ${cat === c ? "border-amber-500 bg-amber-500 text-gray-900" : "border-white/15 text-gray-300 hover:border-amber-500/60 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <div key={cat} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => <DishCard key={d.id} dish={d} qty={cart[d.id] || 0} onAdd={onAdd} />)}
      </div>
    </Section>
  );
}

/* ───────────── À PROPOS ───────────── */
function About() {
  const perks = [
    { Icon: Leaf, t: "Ingrédients frais", d: "Légumes, viandes et produits laitiers achetés chaque matin auprès de producteurs de la région." },
    { Icon: ChefHat, t: "Fait maison", d: "Sauces, pâtes, pains et desserts sont préparés dans notre cuisine, jamais industriels." },
    { Icon: Heart, t: "Ambiance chaleureuse", d: "Une salle intime, une musique douce et une équipe qui prend le temps de vous conseiller." },
  ];
  return (
    <Section id="about" className="bg-gray-950/60">
      <div className="grid items-start gap-14 lg:grid-cols-2">
        <div>
          <Heading title="Une table ouverte depuis 2014" />
          <p className="-mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
            {RESTAURANT.name} est né d'une envie simple : proposer une cuisine sincère dans un lieu où l'on se sent bien. Notre carte change avec les saisons, nos recettes viennent de la famille, et chaque assiette est dressée à la minute.
          </p>
          <ul className="mt-10 space-y-6">
            {perks.map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500"><Icon size={22} /></span>
                <div>
                  <h3 className="font-semibold text-white">{t}</h3>
                  <p className="mt-1 leading-relaxed text-gray-400">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-3">
          {GALLERY.map((src, n) => (
            <div key={src} className={`overflow-hidden rounded-2xl ${n === 0 ? "col-span-2 row-span-2" : n === 3 ? "row-span-2" : ""}`}>
              <Img src={src} alt={`Ambiance et plats du restaurant ${n + 1}`} className="aspect-square h-full w-full object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────── AVIS ───────────── */
function Reviews() {
  return (
    <Section id="reviews" className="bg-gray-900">
      <Heading title="Ce que disent nos clients" />
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-white/10 bg-gray-800/60 p-7">
            <div className="flex gap-0.5 text-amber-500" aria-label={`${r.rating} étoiles sur 5`}>
              {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={18} fill="currentColor" />)}
            </div>
            <blockquote className="mt-4 leading-relaxed text-gray-300">« {r.text} »</blockquote>
            <figcaption className="mt-5 font-semibold text-white">{r.name}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ───────────── CONTACT ───────────── */
function Contact() {
  const [f, setF] = useState({ name: "", phone: "", date: "", time: "19:30", guests: "2", note: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const today = new Date().toISOString().split("T")[0];

  const submit = (e) => {
    e.preventDefault();
    const msg = `Bonjour, je souhaite réserver une table.\nNom : ${f.name}\nTéléphone : ${f.phone}\nDate : ${f.date} à ${f.time}\nPersonnes : ${f.guests}${f.note ? `\nMessage : ${f.note}` : ""}`;
    window.open(wa(msg), "_blank", "noopener");
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const input = "w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const label = "mb-1.5 block text-sm font-medium text-gray-300";

  return (
    <Section id="contact" className="bg-gray-950/60">
      <Heading title="Réserver une table" sub="Remplissez le formulaire : votre demande s'ouvre dans WhatsApp et nous vous confirmons rapidement." />
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"><Clock size={20} className="text-amber-500" /> Horaires d'ouverture</h3>
            <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-gray-800/60">
              {RESTAURANT.hours.map(([d, h]) => (
                <div key={d} className="flex flex-col justify-between gap-1 px-5 py-3.5 sm:flex-row">
                  <dt className="font-medium text-white">{d}</dt>
                  <dd className="text-gray-400">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4 text-gray-300">
            <p className="flex gap-3"><MapPin size={20} className="mt-0.5 shrink-0 text-amber-500" />{RESTAURANT.address}</p>
            <a href={`tel:+${RESTAURANT.whatsapp}`} className="flex gap-3 transition hover:text-amber-500"><Phone size={20} className="shrink-0 text-amber-500" />{RESTAURANT.phoneDisplay}</a>
            <a href={wa("Bonjour,")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-gray-900 transition hover:bg-emerald-400">
              <MessageCircle size={20} /> Écrire sur WhatsApp
            </a>
          </div>
          <iframe title="Carte de localisation" loading="lazy" className="h-52 w-full rounded-2xl border border-white/10 grayscale invert-[.9] contrast-[.9]" src={`https://maps.google.com/maps?q=${encodeURIComponent(RESTAURANT.mapQuery)}&output=embed`} />
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-gray-800/60 p-6 sm:p-8 lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="name" className={label}>Nom complet</label><input id="name" required value={f.name} onChange={set("name")} placeholder="Marie Dupont" className={input} /></div>
            <div><label htmlFor="phone" className={label}>Téléphone</label><input id="phone" type="tel" required value={f.phone} onChange={set("phone")} placeholder="06 00 00 00 00" className={input} /></div>
            <div><label htmlFor="date" className={label}>Date</label><input id="date" type="date" min={today} required value={f.date} onChange={set("date")} className={input} /></div>
            <div><label htmlFor="time" className={label}>Heure</label>
              <select id="time" value={f.time} onChange={set("time")} className={input}>
                {["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label htmlFor="guests" className={label}>Nombre de personnes</label>
              <select id="guests" value={f.guests} onChange={set("guests")} className={input}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label htmlFor="note" className={label}>Message (facultatif)</label><textarea id="note" rows={3} value={f.note} onChange={set("note")} placeholder="Allergies, anniversaire, chaise bébé…" className={input} /></div>
          </div>
          <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-4 font-semibold text-gray-900 transition hover:bg-amber-400 active:scale-[.98]">
            {sent ? <><Check size={20} /> Demande envoyée</> : <><Send size={20} /> Envoyer ma demande</>}
          </button>
        </form>
      </div>
    </Section>
  );
}

/* ───────────── PANIER ───────────── */
function CartDrawer({ open, onClose, items, setQty, clear }) {
  const total = items.reduce((s, { dish, qty }) => s + dish.price * qty, 0);
  const order = () => {
    const lines = items.map(({ dish, qty }) => `• ${qty} × ${dish.name} — ${fmt(dish.price * qty)}`).join("\n");
    window.open(wa(`Bonjour, je souhaite passer commande :\n${lines}\n\nTotal : ${fmt(total)}`), "_blank", "noopener");
  };
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside aria-hidden={!open} className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-gray-900 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-display text-2xl font-semibold text-white">Votre commande</h2>
          <button onClick={onClose} aria-label="Fermer le panier" className="rounded-full p-2 text-gray-300 hover:bg-white/10"><X size={22} /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="mt-16 text-center text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-4 text-gray-600" />
              <p>Votre panier est vide.</p>
              <button onClick={() => { onClose(); scrollToId("menu"); }} className="mt-4 font-semibold text-amber-500 hover:underline">Parcourir le menu</button>
            </div>
          ) : items.map(({ dish, qty }) => (
            <div key={dish.id} className="flex gap-4 rounded-xl bg-gray-800/60 p-3">
              <Img src={dish.img} alt={dish.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-white">{dish.name}</p>
                <p className="text-sm text-amber-500">{fmt(dish.price * qty)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button onClick={() => setQty(dish.id, qty - 1)} aria-label="Retirer un" className="rounded-full border border-white/20 p-1.5 text-white hover:border-amber-500">{qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button>
                  <span className="w-5 text-center text-white">{qty}</span>
                  <button onClick={() => setQty(dish.id, qty + 1)} aria-label="Ajouter un" className="rounded-full border border-white/20 p-1.5 text-white hover:border-amber-500"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="space-y-3 border-t border-white/10 p-5">
            <div className="flex justify-between text-lg"><span className="text-gray-300">Total</span><span className="font-bold text-white">{fmt(total)}</span></div>
            <button onClick={order} className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-4 font-semibold text-gray-900 transition hover:bg-emerald-400">
              <MessageCircle size={20} /> Commander via WhatsApp
            </button>
            <button onClick={clear} className="w-full text-sm text-gray-400 hover:text-white">Vider le panier</button>
          </div>
        )}
      </aside>
    </>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer() {
  const links = [[Instagram, "Instagram", RESTAURANT.social.instagram], [Facebook, "Facebook", RESTAURANT.social.facebook], [Music2, "TikTok", RESTAURANT.social.tiktok]];
  return (
    <footer className="border-t border-white/10 bg-gray-950 px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-2xl font-semibold text-white">{RESTAURANT.name}</p>
          <p className="mt-1 text-sm text-gray-500">{RESTAURANT.address}</p>
        </div>
        <div className="flex gap-3">
          {links.map(([Icon, label, href]) => (
            <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 p-3 text-gray-300 transition hover:border-amber-500 hover:text-amber-500"><Icon size={20} /></a>
          ))}
        </div>
        <div className="text-center text-sm text-gray-500 md:text-right">
          <p><a href="#mentions" className="hover:text-amber-500">Mentions légales</a> · <a href="#confidentialite" className="hover:text-amber-500">Confidentialité</a></p>
          <p className="mt-1">© {new Date().getFullYear()} {RESTAURANT.name} — Site réalisé par <span className="text-amber-500">Netalis</span></p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────── APP ───────────── */
export default function App() {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const add = (dish) => setCart((c) => ({ ...c, [dish.id]: (c[dish.id] || 0) + 1 }));
  const setQty = (id, q) => setCart((c) => {
    const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = q;
    return n;
  });
  const items = Object.entries(cart).map(([id, qty]) => ({ dish: DISHES.find((d) => d.id === Number(id)), qty }));
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 antialiased">
      <Header cartCount={count} onCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <MenuSection cart={cart} onAdd={add} />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setQty={setQty} clear={() => setCart({})} />

      {count > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-amber-500 px-6 py-3.5 font-semibold text-gray-900 shadow-xl shadow-black/40 transition hover:bg-amber-400 sm:hidden">
          <ShoppingBag size={20} /> Voir ma commande ({count})
        </button>
      )}
    </div>
  );
}
