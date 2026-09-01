<div align="center">

<img src="assets/img/ai_logo.png" alt="The AI Library" width="220">

<br>

**A hand-picked directory of free AI tools — no account, no tracking, no build step.**

Browse 227 free artificial-intelligence websites sorted into 14 categories, plus a second
page with 36 handy non-AI utilities. Filter by category, read a one-line description, and
open the tool. It is a plain static site: two HTML pages, one stylesheet, one script and a
couple of JSON files you can edit by hand.

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Made with GEMINI](https://img.shields.io/badge/Made%20with-Google%20Gemini-blue)

</div>

## Why

Lists of AI tools are everywhere, but most of them are newsletters in disguise: an email
wall, an affiliate link on every card, a "premium" tier that hides half the entries, and a
site that quietly rots when the company behind it moves on.

**The AI Library** is the opposite: **a static page you can host anywhere, with a catalogue
that lives in a JSON file you own.** Everything listed is free to use, every entry is a
plain link, and there is nothing between you and the tool — no redirect, no sign-up, no
analytics. Fork it, drop in your own links, and it is your directory.

The site itself was written with Google Gemini following prompts I wrote; the catalogue —
the part that actually matters — is compiled and curated by hand.

## Features

- 🗂️ **227 free AI tools** across **14 categories** — assistants, image and art, text to
  speech, speech to text, text to video, multimedia, automation, programming, data
  analysis, productivity, social media / marketing / SEO, real estate and architecture,
  multimodal and just-for-fun.
- 🧰 **A second catalogue of 36 non-AI utilities** — image, design, network and internet,
  PDF and programming tools — on its own page, sharing the exact same engine.
- 🔎 **One-click category filter** — pick a category and the grid narrows instantly, with a
  smooth scroll down to the results; "All" brings everything back. Filtering is
  client-side, so there is no reload and no request.
- 🏷️ **Multi-category entries** — a tool can belong to several categories at once and shows
  up under each of them.
- 📄 **Content lives in JSON, not in HTML** — `webs.json` and `categorias.json` hold the
  catalogue; adding a tool is one object, adding a category is one more. No markup to touch.
- 🔁 **Forgiving data format** — the loader accepts the legacy array form, flat objects,
  objects wrapped in `web` / `categoria`, and `{ "webs": [...] }` wrappers, so
  hand-edited files keep working.
- 🧩 **One engine, many pages** — each page declares its own data sources with
  `data-webs-src` and `data-categorias-src` on `<body>`, so a new catalogue page is a copy
  of the HTML plus two JSON files.
- 📱 **Responsive card grid** — Bootstrap 5 layout with a pixel-art title banner, custom
  fonts, preloader and back-to-top button; works on a phone as well as on a desktop.
- 🚫 **No telemetry, no cookies, no accounts** — nothing is stored, nothing is sent
  anywhere.
- ⚡ **No build, no dependencies to install** — no Node, no bundler, no framework. Upload
  the folder and it runs.
- ⚠️ **Honest failure** — if the data files cannot be loaded, the page says so and explains
  how to serve it over HTTP instead of failing silently.

## Setup

### Requirements

| Requirement | Detail |
|---|---|
| **Any static hosting** | GitHub Pages, Netlify, an S3 bucket, a folder on a shared host — anything that serves files over HTTP |
| **A local HTTP server** (only for development) | The catalogue is loaded with `fetch`, which browsers block on `file://` — so open the site through a server, not by double-clicking `index.html` |

**Not** needed: Node.js · a bundler · a database · a backend · a CDN of your own.

### Running it locally

```bash
git clone https://github.com/IPardelo/ai-library.git
cd ai-library
python -m http.server 8000    # or: npx serve .
# then open http://localhost:8000
```

### Adding a tool

Append an object to `assets/data/webs.json` (or `assets/data/otras-webs.json` for the
second page). `tipo` accepts several category ids separated by spaces:

```json
{
  "web": {
    "tipo": "imagen productividad",
    "titulo": "Tool name",
    "descripcion": "One line saying what it does.",
    "url": "https://example.com"
  }
}
```

### Adding a category

Append an object to `assets/data/categorias.json` (or `otras-categorias.json`). The `id` is
what you write in a tool's `tipo`, and `nombre` is the label on the filter button:

```json
{
  "categoria": {
    "id": "audio",
    "nombre": "Audio"
  }
}
```

## Project structure

```
ai-library/
├── index.html                  # AI tools catalogue
├── otras-herramientas.html     # Other (non-AI) tools catalogue
│                               #   both declare their data sources on <body>:
│                               #   data-webs-src / data-categorias-src
├── assets/
│   ├── data/
│   │   ├── webs.json           # 227 AI tools — tipo · titulo · descripcion · url
│   │   ├── categorias.json     # 14 categories — id · nombre
│   │   ├── otras-webs.json     # 36 other tools
│   │   └── otras-categorias.json
│   ├── js/
│   │   ├── main.js             # Loads the JSON, normalises it, builds the filters
│   │   │                       #   and the cards, and handles filtering, preloader
│   │   │                       #   and back-to-top
│   │   └── bootstrap.bundle.min.js
│   ├── css/
│   │   ├── style.css           # Site theme: title banner, cards, filters, footer
│   │   ├── bootstrap.min.css
│   │   └── bootstrap-icons.css
│   ├── fonts/                  # Bootstrap Icons web fonts
│   └── img/                    # Logo and favicon
└── README.md
```

All the logic is in `assets/js/main.js`: `normalizarLinksDesdeJson` and
`normalizarFiltrosDesdeJson` turn whatever shape the JSON comes in into a single internal
format, `generarLinks` and `generarFiltros` render it, and `initCategorias` wires up the
filter buttons. There is nothing else to it.

## Changelog

### v2.0

- New **Other tools** page (`otras-herramientas.html`) with 36 non-AI utilities — image,
  design, network, PDF and programming.
- Catalogue moved out of the markup and into **JSON data files**, with a tolerant loader
  that accepts several shapes.
- Pages now declare their own data sources, so one script serves both catalogues.
- Secondary navigation bar between pages, and a visible error message when the data cannot
  be loaded.

### v1.0

- Static site with the AI tools catalogue only: category filters, description cards and
  direct links.

## Author

A project by [Ismael Castiñeira](https://ipardelo.es), developed with
[Google Gemini](https://gemini.google.com).

```bash
VIVA GHALISIA E A COSTA DA MORTE! 💀
```
