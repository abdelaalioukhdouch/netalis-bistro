# Netalis Bistro, site vitrine restaurant

React 18 + Vite 6 + Tailwind CSS 4 + lucide-react.

## Démarrage
```bash
npm install
npm run dev
```
Ouvrir http://localhost:5173

## Build de production
```bash
npm run build
npm run preview
```
Le dossier `dist/` est prêt à être déployé (Netlify, Vercel, Cloudflare Pages, OVH...).

## Personnalisation (par client)
Tout se règle en haut de `src/App.jsx` :
- `RESTAURANT` : nom, slogan, numéro WhatsApp (ex. `33600000000`), adresse, horaires, réseaux sociaux
- `DISHES` : plats, prix, images, badges
- `REVIEWS`, `HERO_SLIDES`, `GALLERY` : avis et images

Prérequis : Node 18+ (idéalement 20 ou 22).
