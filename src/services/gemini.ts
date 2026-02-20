import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askJAssistant(prompt: string) {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `Sei l'assistente virtuale ufficiale (non ufficiale) della Juventus, chiamato J-Assistant. 
  Il tuo tono è professionale, appassionato e fiero. Conosci tutta la storia della Juventus, i giocatori attuali (stagione 2025/26), 
  l'allenatore Thiago Motta e le ultime notizie. Rispondi sempre in italiano. 
  Sii conciso ma coinvolgente. Usa termini come "Fino alla Fine" e "Forza Juve".`;

  try {
    const response = await genAI.models.generateContent({
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
