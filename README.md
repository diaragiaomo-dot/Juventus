# Juventus FC Fan Portal 2025/26

Benvenuto nel portale dedicato alla Juventus. Questo progetto è pronto per essere sincronizzato tra GitHub e Vercel.

## 🚀 Come collegare GitHub e Vercel

Per fare in modo che ogni modifica su GitHub venga pubblicata automaticamente su Vercel, segui questi passaggi:

### 1. Carica il codice su GitHub
1. Crea un nuovo repository vuoto su [GitHub](https://github.com/new).
2. Nel tuo terminale locale (o dove hai il codice), esegui:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TUO_UTENTE/NOME_REPO.git
   git push -u origin main
   ```

### 2. Collega Vercel a GitHub
1. Vai sulla tua [Dashboard di Vercel](https://vercel.com/dashboard).
2. Clicca su **"Add New..."** -> **"Project"**.
3. Seleziona il repository GitHub che hai appena creato.
4. Nelle impostazioni di Build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **IMPORTANTE**: Aggiungi la variabile d'ambiente:
   - `GEMINI_API_KEY`: [La tua chiave API]

### 3. Modifiche in tempo reale
Da questo momento in poi:
- Ogni volta che farai un `git push` su GitHub, Vercel aggiornerà automaticamente il sito.
- Puoi modificare i file direttamente su GitHub (tramite l'interfaccia web o VS Code online premendo il tasto `.`) e Vercel pubblicherà le modifiche al salvataggio.

## 🛠️ Tecnologie utilizzate
- React + Vite
- Tailwind CSS 4
- Framer Motion (Animazioni)
- Google Gemini API (J-Assistant)

---
**Fino alla Fine!**
