# MuHack Website

Sito web ufficiale di [MuHack](https://muhack.org), il primo hackerspace di Brescia.

## Stack

- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting
- **Vanilla JS** - No framework

## Struttura

```
├── _config.yml          # Configurazione sito e social links
├── _includes/
│   ├── head.html        # Meta tags, fonts, CSS
│   ├── navbar.html      # Header + search overlay
│   └── footer.html      # Footer + social links
├── _layouts/
│   ├── default.html     # Layout base
│   ├── home.html        # Homepage con hero, eventi, Dal Lab
│   ├── post.html        # Singolo articolo
│   └── blog.html        # Lista post con filtri
├── _posts/              # Articoli (markdown)
├── assets/
│   ├── css/main.css     # Stili (unico file)
│   └── js/
│       ├── main.js      # Dark mode, search, menu mobile
│       ├── home.js      # Terminale, canvas animation, text scramble
│       └── blog.js      # Filtri categorie, infinite scroll
├── public/
│   ├── img/             # Immagini post
│   └── doc/             # PDF e documenti
└── search.json          # Indice per ricerca (generato da Jekyll)
```

## Aggiungere un post

Crea un file in `_posts/` con formato `YYYY-MM-DD-titolo.md`:

```yaml
---
layout: post
title: "Titolo del post"
subtitle: "Descrizione breve"
author: "Nome Autore"
categories: Events  # oppure: News, Writeup, Talks
header-img: "/public/img/nome-immagine.png"
---

Contenuto in markdown...
```

### Categorie disponibili

| Categoria | Uso |
|-----------|-----|
| `Events` | Eventi futuri/passati (mostrati in homepage) |
| `News` | Annunci generici |
| `Writeup` | CTF e technical writeups |
| `Talks` | Presentazioni e slide |

## Configurazione

Modifica `_config.yml` per:

- **Social links**: `telegram`, `github-username`, `twitter-username`, ecc.
- **Metadata**: `title`, `description`, `url`

## Sviluppo locale

```bash
# Installa dipendenze
bundle install

# Avvia server locale
bundle exec jekyll serve

# Build produzione
bundle exec jekyll build
```

## Build ottimizzata (produzione)

Per minificare CSS/JS in produzione, usa un tool esterno dopo il build:

```bash
# Con npm (richiede Node.js)
npm install -g cssnano-cli terser

# Minifica CSS
cssnano _site/assets/css/main.css _site/assets/css/main.css

# Minifica JS  
terser _site/assets/js/main.js -o _site/assets/js/main.js
terser _site/assets/js/home.js -o _site/assets/js/home.js
terser _site/assets/js/blog.js -o _site/assets/js/blog.js
```

In alternativa, configura una GitHub Action per automatizzare.

## Dark Mode

Il tema si adatta automaticamente alle preferenze sistema. Toggle manuale nel navbar.

Colori definiti in `assets/css/main.css`:
- `--void`: #1A1A2E (scuro)
- `--void-light`: #252542 (scuro secondario)  
- `--chrome`: #F0F2F5 (chiaro)
- `--red`: #E63946 (accent)
- `--cyan`: #00D4FF (accent secondario)

## Search

La ricerca usa lunr.js con indice generato da `search.json`. Filtra per titolo, contenuto, autore, categoria.

Shortcut: `Ctrl/Cmd + K`

## Terminale interattivo (Homepage)

Comandi disponibili: `help`, `orari`, `dove`, `social`, `projects`, `whoami`, `clear`, `ls`, `cowsay`, `matrix`

## Performance

- Lazy loading immagini automatico
- Canvas animation rispetta `prefers-reduced-motion`
- Canvas si ferma quando tab non visibile

## License

MIT
