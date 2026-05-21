# Melisbrillux — Sito Vetrina Ricettario Digitale

**Data:** 2026-05-18
**Stato:** Bozza approvata
**Tag:** sito-vetrina, ricettario-digitale, notebook

## Panoramica

Sito web vetrina per il brand "Melisbrillux" — un archivio di ricette della tradizione italiana con presentazione personale dell'autrice. Il sito ha l'estetica di un **quaderno di appunti cartaceo** (ricettario scritto a mano) con un layout **moderno, immagini realistiche e forme divertenti**.

## Tech Stack

- Statico: HTML5 + CSS3 + JavaScript puro
- Nessun framework, nessun build tool
- Google Fonts: **Lato** (testi lunghi) + font **calligrafico** (titoli/decorazioni)
- Immagini generate con IA (realistiche, estetiche, food photography calda)

## Struttura File

```
melisbrillux/
├── index.html                 # Homepage (copertina + bio + ultima ricetta)
├── ricette/
│   ├── index.html             # Archivio ricette (griglia schede)
│   └── salame-di-cioccolato.html  # Dettaglio ricetta
├── contatti.html              # Bio + contatti
├── css/
│   └── style.css              # Tutti gli stili
└── images/
    ├── hero-salame.jpg        # Foto hero homepage
    ├── ricetta-salame.jpg     # Foto dettaglio ricetta
    ├── profile-melisbrillux.jpg   # Foto profilo
    └── ...                    # Doodle e decorazioni
```

## Pagine

### 1. Homepage (`index.html`)

- **Copertina:** Nome "Melisbrillux" in font calligrafico grande, linea decorativa doodle sotto, tagline *"Ricette della tradizione, scritte con amore"*
- **Foto hero:** Foto realistica del salame di cioccolato in stile polaroid che occupa gran parte dello schermo
- **Chi sono:** Blocco con angoli "stropicciati" che sembra un biglietto piegato; foto profilo tonda; 2-3 righe di presentazione
- **Ultima ricetta:** Scheda stile post-it appiccicato con nome ricetta, descrizione e link "Leggi la ricetta"

### 2. Archivio Ricette (`ricette/index.html`)

- **Titolo:** "Ricette" in calligrafico con riga a mano sotto
- **Schede ricetta:** Riquadri con bordo irregolare che sembrano schede staccate dal quaderno; foto sopra, nome, descrizione, chef, pulsante "Vedi ricetta"
- **Griglia:** 2 colonne su desktop, 1 su mobile
- **Iniziale:** 1 ricetta (salame di cioccolato), struttura pronta per espansione

### 3. Dettaglio Ricetta (`ricette/salame-di-cioccolato.html`)

- **Intestazione:** Nome in calligrafico grande, chef in Lato, foto grande stile polaroid
- **Ingredienti:** Lista con bullet decorati a forma di stellina
- **Preparazione:** Passaggi numerati con numeri in cerchi "fatti a mano", testo in Lato
- **Dettagli decorativi:** Macchia di cioccolato finta, angolo pagina piegato
- **Bottone "Stampa"** per stampare la ricetta
- Contenuto ricetta invariato: 200g biscotti secchi, 60g burro, 80g zucchero, 3 tuorli, 100g cioccolato fondente, 3 cucchiaini rum; 24 passaggi di preparazione

### 4. Contatti (`contatti.html`)

- **Titolo:** "Contatti" in calligrafico
- **Due biglietti appiccicosi:** "Chi sono" (bio) e contatti (email, Instagram)
- **Decorazioni:** Timbro finto, nastro adesivo decorativo

## Elementi Globali

- **Sfondo:** Texture carta/quaderno leggera, linee orizzontali sottili (foglio a righe)
- **Nav:** Semplice in alto, font Lato, separatori doodle tra link (Home · Ricette · Contatti)
- **Footer:** "© 2026 Melisbrillux — Tutti i diritti riservati" con riga tricolore decorativa
- **Palette:** Crema/carta (sfondo), marrone scuro (testi), verde #009246 e rosso #CE2B37 (accenti tricolore)
- **Tipografia:** Calligrafico per titoli, Lato per testi lunghi (ingredienti, preparazione, descrizioni, nav, footer)

## Pattern Visivi "Quaderno"

- Sfondo righe orizzontali come foglio di quaderno
- Elementi con ombre leggere che sembrano "incollati" o "appiccicati"
- Bordi irregolari su schede e biglietti (tramite CSS clip-path o border simulato)
- Doodle sparsi: cucchiai, stelline, macchie di cioccolato, cuori
- Foto con effetto polaroid (bordo bianco irregolare, ombra)
- Titoli con font calligrafico che sembra scritto a mano
- Separatori decorativi tra sezioni

## Immagini (IA generativa)

- Hero salame di cioccolato — primo piano estetico su fondo chiaro
- Ricetta salame di cioccolato — foto "food photography" calda, rustica
- Foto profilo Melisbrillux — ritratto caldo e accogliente
- Doodle decorativi vari (elementi vettoriali in stile disegno a mano)
- Stile: realistico ma con atmosfera calda, illuminazione naturale, colori morbidi

## Considerazioni Future

- Aggiunta di nuove ricette: creare nuovo file in `ricette/` e aggiungere scheda in `ricette/index.html`
- Possibile espansione: categorie (dolci, salati), tag, ricerca
- Mobile-first responsive

## Limiti e Vincoli

- Nessun backend: tutte le pagine sono HTML statici
- Le nuove ricette richiedono modifica manuale di `ricette/index.html`
- Le immagini sono generate (non foto reali)
