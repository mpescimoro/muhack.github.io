---
layout: post
title: "Nuovo sito, stesso MuHack"
subtitle: "AGAIN(!?)"
categories: News
date: 2026-01-22
author: p3sc1
header-img:
---

È arrivato quel periodo dell’anno in cui, inevitabilmente, torna fuori l’idea di riscrivere il sito di MuHack.
Questa volta però, diciamolo, **ci stava**: il design precedente era vecchio, fragile e sempre meno rappresentativo di quello che MuHack è oggi.

## Cosa c'è di nuovo

Il layout è stato **riscritto da zero**. Nuova identità visiva, struttura più pulita e meno roba "messa lì che poi vediamo".

Qualche highlight:

- **Dark mode** — Si adatta alle preferenze di sistema oppure si può forzare manualmente. In dark mode gli accenti si invertono, perché sì.

- **Search** — `Ctrl+K` (o `Cmd+K` su Mac) apre una ricerca globale. Cerca per titolo, contenuto, autore e categoria. Funziona.

- **Terminale interattivo** — La home ha un terminale funzionante. Digita `help` per i comandi disponibili. Sì, c'è anche `cowsay`. No, non lo toglieremo.

- **Performance** — CSS snellito, immagini lazy-loaded, animazioni canvas che si fermano quando il tab va in background. @Ceres ringrazia, la batteria pure.

## Le parti noiose (ma importanti)

Stack invariato, perché se funziona non si butta: **Jekyll su GitHub Pages**. Niente framework JavaScript, niente build step esoterici. Solo HTML, CSS e vanilla JS.

Il CSS usa **variabili semantiche** che si ribaltano automaticamente tra light e dark mode, quindi meno duplicazioni e meno casini futuri.
```css
:root {
  --accent: var(--red);
  --accent-alt: var(--cyan);
}
[data-theme="dark"] {
  --accent: var(--cyan);
  --accent-alt: var(--red);
}
```

La search è basata su **lunr.js**, tutta client-side. Zero chiamate a server esterni, zero tracking.

## Cosa manca ancora

Alcune parti verranno rifinite o aggiunte col tempo, man mano che nasce l’esigenza.
Per il resto, MuHack vive altrove: nei progetti, nelle discussioni e nei cavi che spariscono misteriosamente.

## Bug e feedback

Se trovi qualcosa che non va, rompici le scatole. Il codice è su [GitHub](https://github.com/muhack/muhack.github.io), le issue sono aperte e accettiamo segnalazioni, patch e rant ben argomentati.

---

*Il redesign è stato un lavoro collaborativo tra umani, caffeina e qualche `div` particolarmente testardo gentilmente consegnato all'oblio.*