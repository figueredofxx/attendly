
import { GoogleGenAI, Type } from "@google/genai";
import { Appointment, Patient, WaitlistEntry, Message, AIMemory, TrainingExample, ModelMetrics, PersonalityConfig } from "../types";

// Safety check for process.env in potentially missing environments
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

// --- Agenda Parsing (Smart Import) ---

export const parseRawAgenda = async (rawText: string): Promise<Partial<Appointment>[]> => {
  if (!API_KEY) {
    console.warn("API Key missing. Returning mock data.");
    return new Promise(resolve => setTimeout(() => {
      resolve([
        { patientName: 'Novo Paciente Exemplo', service: 'Avaliação Geral', time: '09:00', date: 'Hoje', status: 'pending' },
        { patientName: 'Julia Martins', service: 'Limpeza', time: '10:30', date: 'Hoje', status: 'pending' },
        { patientName: 'Roberto Alves', service: 'Canal', time: '14:00', date: 'Hoje', status: 'pending' }
      ]);
    }, 1500));
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: rawText,
      config: {
        systemInstruction: `Você é um assistente administrativo de clínica médica.
        Extraia os dados de agendamento do texto bruto fornecido pelo usuário.
        Retorne APENAS um Array JSON puro. Não use blocos Markdown.
        Infira a data como 'Hoje' se não especificada.
        Se o serviço estiver faltando, use 'Consulta'.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              patientName: { type: Type.STRING },
              service: { type: Type.STRING },
              time: { type: Type.STRING },
              date: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["pending", "confirmed"] }
            },
            required: ["patientName", "time"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini Error (Import):", e);
    return [];
  }
};

// --- Patient Intelligence ---

export const getPatientInsights = async (patient: Patient): Promise<AIMemory[]> => {
  if (!API_KEY) {
    return [
      { id: 'm1', type: 'preference', content: 'Prefere atendimentos após as 18h', confidence: 95, source: 'conversation', detectedAt: '2023-10-15' },
      { id: 'm2', type: 'financial', content: 'Costuma pagar via Pix', confidence: 88, source: 'history', detectedAt: '2023-09-20' },
      { id: 'm3', type: 'behavior', content: 'Sensível a atrasos, demonstrar pontualidade', confidence: 75, source: 'conversation', detectedAt: '2023-11-05' },
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Histórico: ${JSON.stringify(patient.history)}. Tags: ${patient.tags?.join(',')}`,
      config: {
        systemInstruction: `Analise o perfil do paciente e gere "Memórias IA" (insights inferidos).
        Infira traços comportamentais baseados no número de No-Shows.
        Retorne Array JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['preference', 'behavior', 'medical', 'financial', 'restriction'] },
                    content: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    source: { type: Type.STRING },
                    detectedAt: { type: Type.STRING }
                }
            }
        }
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Gemini Error (Insights):", e);
    return [];
  }
};

// --- Risk Analysis ---

export const analyzeAppointmentRisk = async (appointment: Appointment, patient: Patient): Promise<{ score: number; reasoning: string }> => {
  // Source of Truth Logic: If QR Code is present/verified, Risk is 0.
  if (appointment.attendanceStatus === 'verified' || appointment.validationLog) {
      return { score: 0, reasoning: "Presença validada por QR Code (Fonte Real)." };
  }

  if (!API_KEY) {
    const noShowRate = patient.history.totalAppointments > 0 ? (patient.history.noShows / patient.history.totalAppointments) : 0;
    const baseScore = Math.floor(noShowRate * 100);
    const score = Math.min(Math.max(baseScore + (Math.random() * 20 - 10), 0), 100);
    return { score: Math.round(score), reasoning: score > 50 ? "Alto risco baseado no histórico recente." : "Paciente assíduo." };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Paciente: ${patient.name}, NoShows: ${patient.history.noShows}/${patient.history.totalAppointments}. Serviço: ${appointment.service} às ${appointment.time}.`,
      config: {
        systemInstruction: `Calcule um Score de Risco (0-100) para No-Show.
        Maior score significa maior probabilidade de faltar.
        Forneça uma justificativa curta (máx 15 palavras).`,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                reasoning: { type: Type.STRING }
            }
        }
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error (Risk):", error);
    return { score: 50, reasoning: "Erro na análise neural." };
  }
};

export const calculateTrustScore = (patient: Patient): number => {
    // Lógica simples baseada no histórico
    if (patient.history.totalAppointments === 0) return 70; // Neutro para novos
    const showRate = (patient.history.totalAppointments - patient.history.noShows) / patient.history.totalAppointments;
    return Math.round(showRate * 100);
};

// --- Chat & Tone Generation ---

export const generateRecoveryMessage = async (appointment: Appointment, riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'): Promise<string> => {
    if (!API_KEY) {
        return "Olá! Gostaríamos de confirmar seu agendamento na SlimFit para amanhã. Podemos confirmar?";
    }

    const toneInstruction = riskLevel === 'HIGH' 
        ? "Use um tom assertivo mas educado. Solicite dupla confirmação ou mencione que o horário é muito concorrido." 
        : "Use um tom amigável e leve.";

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Agendamento: ${appointment.service}, ${appointment.date} às ${appointment.time}. Paciente: ${appointment.patientName}.`,
            config: {
                systemInstruction: `Você é a SlimFit AI. Escreva uma mensagem de confirmação de WhatsApp em Português.
                ${toneInstruction}
                Mantenha curto (abaixo de 160 caracteres se possível). Sem hashtags.`,
            },
        });
        return response.text?.trim() || "";
    } catch (error) {
        return "Olá, confirmamos seu horário?";
    }
}

export const generateChatReply = async (history: Message[], patientName: string): Promise<string> => {
    if (!API_KEY) return "Vou verificar essa informação para você.";

    const conversation = history.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: conversation,
            config: {
                systemInstruction: `Você é a IA recepcionista da Clínica SlimFit.
                Nome do Paciente: ${patientName}.
                Seu objetivo: Confirmar agendamentos, responder dúvidas básicas ou reagendar.
                Tom: Útil, humano, conciso.
                NÃO mencione que você é uma IA a menos que perguntado.
                Sempre responda em Português.`,
            },
        });
        return response.text?.trim() || "";
    } catch (error) {
        return "Desculpe, não entendi. Pode repetir?";
    }
}

// --- Utils & Mock Services ---

export const validateQRCode = async (hash: string): Promise<{ valid: boolean; message: string; appointmentId?: string }> => {
    // Simulate DB validation
    return new Promise(resolve => setTimeout(() => {
        if (hash.includes("valid")) {
            resolve({ valid: true, message: "Check-in realizado com sucesso.", appointmentId: "1" });
        } else if (hash.includes("used")) {
            resolve({ valid: false, message: "Este QR Code já foi utilizado. Entrada duplicada negada." });
        } else {
            resolve({ valid: false, message: "QR Code não encontrado no sistema." });
        }
    }, 800));
};

export const matchWaitlistToSlot = async (slotTime: string, waitlist: WaitlistEntry[]): Promise<WaitlistEntry | null> => {
    if (waitlist.length === 0) return null;
    return waitlist.reduce((prev, current) => (prev.priorityScore > current.priorityScore) ? prev : current);
}

// --- ML Ops Simulation ---

export const processTrainingFile = async (fileType: string): Promise<{ status: string, newProfiles: number }> => {
    return new Promise(resolve => setTimeout(() => {
        resolve({ status: 'completed', newProfiles: Math.floor(Math.random() * 50) + 10 });
    }, 2000));
}

export const saveAIPersonality = async (config: PersonalityConfig): Promise<boolean> => {
    console.log("Saving Personality Config to Vector DB:", config);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
}

export const getLabelingQueue = async (): Promise<TrainingExample[]> => {
    return [
        { id: 't1', input: "Talvez eu me atrase uns 10 minutos", context: "Confirmação de Agenda", aiPrediction: 'late', confidence: 0.65, status: 'pending_review' },
        { id: 't2', input: "Não vou conseguir ir", context: "Mensagem Espontânea", aiPrediction: 'cancellation', confidence: 0.98, status: 'pending_review' },
        { id: 't3', input: "Aceitam cartão?", context: "Dúvida", aiPrediction: 'question', confidence: 0.85, status: 'pending_review' },
    ];
}

export const submitCorrection = async (id: string, label: string): Promise<void> => {
    console.log(`Training feedback: ID ${id} is actually ${label}`);
    return new Promise(resolve => setTimeout(resolve, 500));
}

export const getModelMetrics = async (): Promise<ModelMetrics> => {
    return {
        precision: 0.92,
        recall: 0.88,
        f1Score: 0.90,
        accuracy: 0.94,
        trainingSetSize: 1250,
        lastTrainedAt: new Date().toLocaleDateString(),
        history: [
            { date: 'Sem 1', accuracy: 0.65 },
            { date: 'Sem 2', accuracy: 0.78 },
            { date: 'Sem 3', accuracy: 0.85 },
            { date: 'Sem 4', accuracy: 0.94 },
        ]
    };
}
