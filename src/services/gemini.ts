import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY non configurata. L'assistente AI sarà disabilitato.");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export async function askJAssistant(prompt: string) {
  try {
    const ai = getGenAI();
    if (!ai) {
      return "L'assistente AI non è configurato. Assicurati di aver impostato la GEMINI_API_KEY nelle impostazioni di Vercel.";
    }

    const model = "gemini-3-flash-preview";
    const systemInstruction = `Sei l'assistente virtuale ufficiale (non ufficiale) della Juventus, chiamato J-Assistant. 
    Il tuo tono è professionale, appassionato e fiero. Conosci tutta la storia della Juventus, i giocatori attuali (stagione 2025/26), 
    l'allenatore Thiago Motta e le ultime notizie. Rispondi sempre in italiano. 
    Sii conciso ma coinvolgente. Usa termini come "Fino alla Fine" e "Forza Juve".`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Scusa, sto riscontrando un problema tecnico. Fino alla fine!";
  }
}
