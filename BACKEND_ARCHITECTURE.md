
# SlimFit AI — Backend Architecture & Integration Guide

Este documento detalha a arquitetura técnica para construir o backend do **SlimFit AI**. 
O sistema utiliza **Node.js**, **MongoDB** e **Google Gemini API** para criar uma secretária digital inteligente.

---

## 1. Stack Tecnológica

| Componente | Tecnologia | Função |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | Execução do servidor |
| **Framework** | NestJS (Recomendado) ou Express | Estrutura da API REST |
| **Language** | TypeScript | Tipagem e segurança de código |
| **Database** | MongoDB (Atlas) | Armazenamento de dados (NoSQL) |
| **ORM** | Mongoose | Modelagem de dados |
| **AI LLM** | Google Gemini 2.5 Flash | Inteligência conversacional e análise |
| **WhatsApp** | Evolution API / WppConnect | Gateway de mensagens |
| **Queue** | BullMQ (Redis) | Filas para envio de mensagens e jobs de IA |

---

## 2. Estrutura do Banco de Dados (Schemas Mongoose)

### 2.1. `Clinic` (Tenants)
Armazena configurações de cada clínica cliente.
```typescript
const ClinicSchema = new Schema({
  name: { type: String, required: true },
  plan: { type: String, enum: ['standard', 'enterprise'], default: 'standard' },
  whatsappConfig: {
    instanceName: String,
    apikey: String,
    status: { type: String, enum: ['CONNECTED', 'DISCONNECTED'] }
  },
  aiConfig: {
    tone: { type: String, default: 'friendly' }, // formal, friendly, empathetic
    riskThreshold: { type: Number, default: 70 },
    requireDeposit: { type: Boolean, default: false }
  },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' }
});
```

### 2.2. `Patient` (Perfil e Memória)
Contém os dados estruturados e os embeddings comportamentais.
```typescript
const PatientSchema = new Schema({
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', index: true },
  phone: { type: String, required: true, index: true },
  name: String,
  stats: {
    totalAppointments: { type: Number, default: 0 },
    noShows: { type: Number, default: 0 },
    cancellations: { type: Number, default: 0 }
  },
  trustScore: { type: Number, default: 100 }, // 0 a 100
  // Memória Vetorial Simples (Tags)
  aiTags: [{ 
    tag: String, 
    confidence: Number, 
    source: String // 'conversation', 'manual'
  }]
});
```

### 2.3. `Appointment` (Agendamento & Validação)
O núcleo do sistema de presença.
```typescript
const AppointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic' },
  date: Date,
  service: String,
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
  
  // Módulo de Confirmação Real
  attendance: {
    status: { type: String, enum: ['EXPECTED', 'DECLARED', 'VERIFIED_QR', 'NO_SHOW'] },
    qrHash: { type: String, unique: true },
    checkInTime: Date,
    validatedBy: String // ID do recepcionista ou 'SELF'
  },

  // Inteligência Artificial
  riskAnalysis: {
    score: Number, // 0-100
    reasoning: String,
    analyzedAt: Date
  }
});
```

---

## 3. Integração com Gemini API (Backend)

O backend deve atuar como proxy seguro para a API do Google. **Nunca exponha a API Key no frontend.**

### 3.1. Serviço de IA (`AiService`)

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AiService {
  
  // 1. Chatbot Conversacional
  async generateReply(history: Message[], context: ClinicContext) {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const systemPrompt = `
      Você é a secretária da clínica ${context.name}.
      Tom de voz: ${context.tone}.
      Regras: Não invente horários. Confirme sempre.
    `;

    // Converte histórico para formato Gemini
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.fromMe ? "model" : "user",
        parts: [{ text: h.body }]
      })),
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(lastUserMessage);
    return result.response.text();
  }

  // 2. Análise de Risco (JSON Mode)
  async analyzeRisk(patientData: any) {
    const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `Analise o risco de no-show para: ${JSON.stringify(patientData)}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}
```

---

## 4. API Routes (Endpoints Principais)

### Autenticação & Usuários
*   `POST /auth/login` - Login (JWT)
*   `GET /auth/me` - Dados do usuário logado

### Agendamentos
*   `GET /appointments` - Listar (filtros: data, status)
*   `POST /appointments` - Criar novo
*   `POST /appointments/import` - Smart Import (Raw Text -> AI -> JSON)
*   `POST /appointments/:id/checkin` - Validação via QR Code

### Webhooks (WhatsApp)
*   `POST /webhooks/evolution` - Recebe mensagens do WhatsApp
    *   *Lógica:* Salva mensagem -> Busca Thread -> Chama `AiService` -> Envia resposta.

### ML Ops (Treinamento)
*   `POST /training/ingest` - Upload de CSV
*   `GET /training/queue` - Itens para revisão humana
*   `POST /training/correct/:id` - Enviar correção humana (Active Learning)

---

## 5. Fluxo de Validação QR Code (Segurança)

1.  **Criação:** Ao criar agendamento, o backend gera um hash único:
    `hash = sha256(appointmentId + clinicSecret + timestamp)`
2.  **Entrega:** Envia link para o paciente: `app.slimfit.ai/ticket/{hash}`.
3.  **Leitura:** O frontend da recepção lê o QR.
4.  **Validação:**
    *   Backend busca agendamento pelo hash.
    *   Verifica se `attendance.checkInTime` existe (evita uso duplo).
    *   Verifica janela de tempo (ex: max 60 min antes).
    *   Retorna `200 OK` e marca `VERIFIED_QR`.

---

## 6. Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/slimfit
JWT_SECRET=sua_chave_secreta_jwt
GEMINI_API_KEY=sua_chave_google_aistudio
WHATSAPP_API_URL=https://api.evolution-service.com
WHATSAPP_API_KEY=sua_chave_evolution
```

---

## 7. Próximos Passos para Implementação

1.  Inicializar projeto NestJS.
2.  Configurar conexão Mongoose.
3.  Implementar AuthGuard (JWT).
4.  Criar serviço `GeminiService` isolado.
5.  Criar Controller de Webhook para processar mensagens em fila (BullMQ).
