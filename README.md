# MuHack Website

Sito web ufficiale di [MuHack](https://muhack.org), il primo hackerspace di Brescia.

## Stack

- **Jekyll 4.4** - Static site generator
- **GitHub Pages** - Hosting
- **Vanilla JS** - No framework
- **lunr.js** - Search engine client-side

## Struttura
```
muhack.github.io/
├── _config.yml              # Configurazione sito e social
├── _includes/
│   ├── head.html            # Meta, fonts, CSS, script anti-flash tema
│   ├── navbar.html          # Header, search overlay, theme toggle
│   ├── footer.html          # Footer, social links (da _config.yml)
│   ├── analytics.html       # Google Analytics (opzionale)
│   └── youtube.html         # Embed YouTube helper
├── _layouts/
│   ├── default.html         # Layout base (head + navbar + content + footer)
│   ├── home.html            # Homepage: hero, terminale, eventi, Dal Lab
│   ├── blog.html            # Lista post con filtri categoria
│   ├── post.html            # Singolo articolo
│   ├── page.html            # Pagine statiche (about, etc)
│   └── empty.html           # Layout vuoto
├── _posts/                  # Articoli in Markdown
├── assets/
│   ├── css/
│   │   └── main.css         # Stili con variabili semantiche
│   ├── js/
│   │   ├── main.js          # Menu, dark mode, search
│   │   ├── home.js          # Terminale, canvas animation, text scramble
│   │   ├── blog.js          # Filtri, infinite scroll
│   │   └── lunr.min.js      # Libreria search
│   └── img/                 # Immagini assets
├── public/
│   ├── img/                 # Immagini post
│   └── doc/                 # PDF e documenti
├── index.html               # Entry point (usa layout home)
├── about.html               # Pagina chi siamo
├── blog.html                # Pagina blog
├── talks.html               # Pagina talks
├── search.html              # Pagina search (legacy)
├── search.json              # Indice search generato da Jekyll
├── 404.html                 # Pagina errore
├── robots.txt               # SEO
├── favicon.ico
├── CNAME                    # Dominio custom
├── Gemfile                  # Dipendenze Ruby
└── LICENSE
```

## Aggiungere un post

Crea un file in `_posts/` con formato `YYYY-MM-DD-titolo.md`:
```yaml
---
layout: post
title: "Titolo del post"
subtitle: "Descrizione breve (opzionale)"
author: "Nome Autore"
categories: Events
header-img: "/public/img/nome-immagine.png" // no longer supported
---

Contenuto in Markdown...
```

### Categorie

| Categoria | Uso | Colore |
|-----------|-----|--------|
| `Events` | Eventi e meetup | Rosso/Cyan |
| `News` | Annunci | Cyan/Rosso |
| `Writeup` | CTF e technical | Verde |
| `Talks` | Presentazioni | Cyan |

## Configurazione

Modifica `_config.yml`:
```yaml
# Social (usati in footer e terminale)
telegram: muhack
github-username: muhack
twitter-username: muhackIT
instagram: hackerspace_muhack
youtube-username: MuHack
facebook-username: muhackIT
email: info@muhack.org
```

## CSS - Variabili semantiche

Il CSS usa variabili che si invertono automaticamente in dark mode:
```css
:root {
  /* Fissi */
  --red: #E63946;
  --cyan: #00D4FF;
  --void: #1A1A2E;
  --void-mid: #1F1F38;
  --void-light: #252542;
  
  /* Semantiche - cambiano con il tema */
  --accent: var(--red);           /* → cyan in dark */
  --accent-alt: var(--cyan);      /* → red in dark */
  --bg-content: var(--chrome);    /* → void-light in dark */
  --bg-card: var(--white);        /* → void-mid in dark */
  --text-primary: var(--void);    /* → white in dark */
  --text-secondary: var(--steel); /* → chrome-dark in dark */
}
```

Per modificare colori, cambia solo le variabili in `:root` e `[data-theme="dark"]`.

## Funzionalità

### Dark Mode
- Toggle nel navbar (sole/luna)
- Rispetta `prefers-color-scheme` di sistema
- Persistenza in `localStorage`
- Script anti-flash in `<head>`

### Search
- Shortcut: `Ctrl/Cmd + K`
- Powered by lunr.js
- Cerca in: titolo, contenuto, autore, categoria
- Indice generato da `search.json`

### Terminale (Homepage)
Comandi disponibili:
- `help` - lista comandi
- `orari` - orari apertura
- `dove` - indirizzo e mappa
- `social` - link social (da _config.yml)
- `projects` - link wiki progetti
- `whoami`, `ls`, `pwd`, `date`, `cowsay`, `matrix`, `sudo`, `hack`

### Canvas Animation
- Network di nodi animati nell'hero
- Si ferma quando tab in background (`document.hidden`)
- Disabilitato con `prefers-reduced-motion`
- Colori adattivi al tema

## Sviluppo locale
```bash
# Installa dipendenze
bundle install

# Avvia server (http://localhost:4000)
bundle exec jekyll serve

# Build
bundle exec jekyll build
```

## Build produzione

Per minificare CSS/JS:
```bash
# Richiede Node.js
npm install -g cssnano-cli terser

# Dopo jekyll build
cssnano _site/assets/css/main.css _site/assets/css/main.css
terser _site/assets/js/main.js -o _site/assets/js/main.js
terser _site/assets/js/home.js -o _site/assets/js/home.js
terser _site/assets/js/blog.js -o _site/assets/js/blog.js
```

## Link utili

- **Sito**: https://muhack.org
- **Wiki**: https://wiki.muhack.org
- **Status**: https://status.muhack.org
- **Telegram**: https://t.me/muhack

## License

MIT
