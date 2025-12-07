# Vibecode — Prompts e PRD Consolidados (Português - Light/Dark)
Versão: 1.0
Gerado: 2025-12-06

## A. PRD CONSOLIDADO (Resumo Executivo)
**Nome do produto:** Vibecode Scheduling (SlimFit AI)
**Objetivo:** Reduzir faltas (no-shows) em até 80% para clínicas e consultórios usando automação via WhatsApp com IA conversacional.
**Público alvo:** Clínicas odontológicas, consultórios médicos, estética, psicólogos.
**Proposta de valor:** "Agenda cheia. Menos faltas. Mais receita."
**MVP:** Confirmação humana-similar, importação de agenda, lista de espera, preenchimento automático, validação por QR Code, Hierarquia (SaaS/Owner/Recepcionista).

---

## B. ARQUITETURA DE DADOS & IA (Anexo Técnico)

**1. Banco de Dados Estruturado (SQL/Mongo):**
* Users, Clients, Appointments, Orders, Messages, Tasks, Logs.
* **Attendance (Check-ins):** Fonte de verdade para presença (QR Code).

**2. Memória Vetorial (AI):**
* Preferências, Padrões comportamentais, Restrições, Histórico semântico.

**3. Aprendizado:**
* Manual (painel), Automático (observação), Conversacional (chat).

---

## C. MÓDULO HIERÁRQUICO (RBAC)

**1. Admin do SaaS (Plataforma):**
* Gerencia clínicas, planos, faturamento global.
* Acesso à rota `SAAS_ADMIN`.

**2. Owner (Dono da Clínica):**
* Acesso total à sua unidade.
* Gerencia equipe, financeiro detalhado, calibração da IA.

**3. Recepcionista:**
* Acesso operacional (Agenda, Chats, Lista de Espera).
* Sem acesso a métricas financeiras sensíveis.

---

## D. MÓDULO DE VALIDAÇÃO DE PRESENÇA (QR Code)

**Objetivo:** Fonte primária de verdade para o algoritmo.
1. **Geração:** Token único gerado no agendamento.
2. **Entrega:** Via WhatsApp ou Ticket Digital.
3. **Validação:**
   * **Recepção:** Escaneia QR do paciente.
   * **Self-Checkin:** Paciente escaneia QR da clínica.
4. **Regra de Negócio:** Status "Verificado por QR" tem peso 100% no score de confiança.

---

## E. FLUXO TÉCNICO & BACKEND

**Stack:** Node.js (NestJS), MongoDB, Google Gemini 2.5 Flash, Evolution API (WhatsApp).

**Endpoints Chave:**
* `POST /appointments/import` (Smart Import)
* `POST /checkin/scan` (Validação QR)
* `POST /training/ingest` (ML Ops)

---

## F. REGRAS DE PRIVACIDADE (LGPD)
* Anonimização de dados no treinamento.
* Consentimento para contato via WhatsApp.
* Logs de auditoria para check-ins.
