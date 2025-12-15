import { GoogleGenAI, Type } from "@google/genai";
import { LoemResult } from "../types";

// Initialize the Gemini client
// The API key is guaranteed to be available in process.env.API_KEY per the environment setup.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LOEM_SYSTEM_PROMPT = `
Eres un asistente médico experto especializado en gastroenterología y codificación quirúrgica para pacientes con Poliposis.
Tu objetivo es analizar informes clínicos o quirúrgicos (texto no estructurado) y extraer la clasificación "LOEM".

La clasificación LOEM se utiliza para estandarizar la descripción de pólipos complejos.
Aunque las definiciones exactas pueden variar según el protocolo del hospital (ej. IDIVAL), generalmente se refiere a:
- L (Location/Localización): Dónde está el pólipo (ej. Recto, Sigma, Ciego).
- O (Origin/Origen o Morfología macro): A veces se refiere al aspecto macroscópico o si es recurrente.
- E (Extent/Extension o Tamaño): Tamaño en mm o cm, o extensión circunferencial.
- M (Morphology/Morfología o Malignidad): Tipo morfológico (ej. Paris 0-Is, 0-IIa) o grado de displasia.

NOTA IMPORTANTE: Si el texto proporcionado no contiene suficiente información para una letra específica, indica "No especificado" o "X".
Analiza el texto en busca de estas variables y genera una salida estructurada.

Debes devolver SOLAMENTE un objeto JSON válido.
`;

export const analyzeSurgicalReport = async (reportText: string): Promise<LoemResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analiza el siguiente informe quirúrgico de poliposis y extrae el código LOEM.
              
              Informe:
              "${reportText}"
              
              Si no conoces la definición exacta de LOEM del protocolo IDIVAL, usa tu mejor criterio médico basado en los estándares comunes (Localización, Origen/Ocurrencia, Extensión/Tamaño, Morfología) para asignar valores lógicos y explicarlos.
              `
            }
          ]
        }
      ],
      config: {
        systemInstruction: LOEM_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: {
              type: Type.STRING,
              description: "El código LOEM resultante (ej. L:R O:P E:30 M:Is)",
            },
            components: {
              type: Type.OBJECT,
              properties: {
                L: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    description: { type: Type.STRING, description: "Explicación breve de la localización" },
                    originalText: { type: Type.STRING, description: "Fragmento original del texto" },
                  },
                  required: ["value", "description", "originalText"],
                },
                O: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    description: { type: Type.STRING, description: "Explicación breve del origen/ocurrencia" },
                    originalText: { type: Type.STRING, description: "Fragmento original del texto" },
                  },
                  required: ["value", "description", "originalText"],
                },
                E: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    description: { type: Type.STRING, description: "Explicación breve de la extensión/tamaño" },
                    originalText: { type: Type.STRING, description: "Fragmento original del texto" },
                  },
                  required: ["value", "description", "originalText"],
                },
                M: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.STRING },
                    description: { type: Type.STRING, description: "Explicación breve de la morfología" },
                    originalText: { type: Type.STRING, description: "Fragmento original del texto" },
                  },
                  required: ["value", "description", "originalText"],
                },
              },
              required: ["L", "O", "E", "M"],
            },
            summary: {
              type: Type.STRING,
              description: "Un resumen clínico breve de los hallazgos principales.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Nivel de confianza de 0 a 100 en la extracción.",
            },
          },
          required: ["code", "components", "summary", "confidence"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content received from Gemini.");
    }

    return JSON.parse(text) as LoemResult;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw error;
  }
};