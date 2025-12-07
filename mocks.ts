
import { Appointment, Patient, WaitlistEntry, ChatSession, Clinic, Invoice, SubscriptionUsage } from './types';

export const MOCK_PATIENTS: Record<string, Patient> = {
  'p1': { id: 'p1', name: 'Ricardo Oliveira', phone: '5511999999999', history: { totalAppointments: 12, noShows: 4, lastVisit: '2023-10-10' }, trustScore: 40 },
  'p2': { id: 'p2', name: 'Fernanda Silva', phone: '5511888888888', history: { totalAppointments: 5, noShows: 0, lastVisit: '2023-11-20' }, trustScore: 95 },
  'p3': { id: 'p3', name: 'João Santos', phone: '5511777777777', history: { totalAppointments: 2, noShows: 1, lastVisit: '2023-01-15' }, trustScore: 60 },
  'p4': { id: 'p4', name: 'Amanda Costa', phone: '5511666666666', history: { totalAppointments: 8, noShows: 3, lastVisit: '2023-12-01' }, trustScore: 50 },
  'p5': { id: 'p5', name: 'Carlos Mendes', phone: '11 91234-5678', history: { totalAppointments: 1, noShows: 0, lastVisit: '2023-09-10' } },
  'p6': { id: 'p6', name: 'Mariana Souza', phone: '11 92345-6789', history: { totalAppointments: 8, noShows: 0, lastVisit: '2023-11-01' } },
  'p7': { id: 'p7', name: 'Roberto Lima', phone: '11 93456-7890', history: { totalAppointments: 3, noShows: 1, lastVisit: '2023-08-20' } },
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: 'p1', patientName: 'Ricardo Oliveira', service: 'Limpeza Dental', date: 'Hoje', time: '14:30', duration: 30, status: 'confirmed', attendanceStatus: 'user_declared', riskScore: 85, aiAnalysis: 'Paciente informou que vem, mas tem histórico de mentiras.', qrCodeHash: 'slimfit-valid:1' },
  { id: '2', patientId: 'p2', patientName: 'Fernanda Silva', service: 'Avaliação Ortodontia', date: 'Hoje', time: '15:45', duration: 45, status: 'confirmed', attendanceStatus: 'verified', riskScore: 10, aiAnalysis: 'Paciente pontual.', qrCodeHash: 'slimfit-valid:2', validationLog: { validatedAt: '15:40', method: 'qr', validatedBy: 'Self Check-in' } },
];

export const MOCK_WAITLIST: WaitlistEntry[] = [
    { id: 'w1', patientId: 'p5', patientName: 'Carlos Mendes', desiredService: 'Limpeza', availableDays: ['Seg', 'Qua'], priorityScore: 85, addedAt: '2023-10-25' },
    { id: 'w2', patientId: 'p6', patientName: 'Mariana Souza', desiredService: 'Avaliação', availableDays: ['Qualquer dia'], priorityScore: 92, addedAt: '2023-10-20' },
    { id: 'w3', patientId: 'p7', patientName: 'Roberto Lima', desiredService: 'Manutenção', availableDays: ['Sex', 'Sab'], priorityScore: 60, addedAt: '2023-10-28' },
];

export const MOCK_CHATS: ChatSession[] = [
    {
        id: 'c1',
        patientId: 'p2',
        patientName: 'Fernanda Silva',
        patientPhone: '11 99999-9999',
        lastMessage: 'Vou confirmar minha presença.',
        unreadCount: 0,
        status: 'active',
        messages: [
            { id: 'm1', sender: 'ai', text: 'Olá Fernanda, aqui é da SlimFit. Confirmamos sua consulta amanhã às 15:45?', timestamp: '10:00', status: 'read' },
            { id: 'm2', sender: 'user', text: 'Oi! Vou confirmar minha presença sim.', timestamp: '10:05', status: 'read' },
        ]
    },
    {
        id: 'c2',
        patientId: 'p1',
        patientName: 'Ricardo Oliveira',
        patientPhone: '11 88888-8888',
        lastMessage: 'Acho que vou precisar remarcar...',
        unreadCount: 1,
        status: 'active',
        messages: [
            { id: 'm3', sender: 'ai', text: 'Olá Ricardo. Notamos que seu horário é hoje às 14:30. Tudo certo para comparecer?', timestamp: '09:00', status: 'read' },
            { id: 'm4', sender: 'user', text: 'Putz, surgiu um imprevisto. Acho que vou precisar remarcar...', timestamp: '09:30', status: 'read' },
        ]
    }
];

export const MOCK_CLINICS: Clinic[] = [
  { id: '1', name: 'Sorriso Brilhante Odonto', plan: 'standard', status: 'active', ownerName: 'Dr. Roberto', usersCount: 3, nextBilling: '15/12/2023' },
  { id: '2', name: 'Dermatologia Integrada', plan: 'enterprise', status: 'active', ownerName: 'Dra. Ana', usersCount: 12, nextBilling: '01/12/2023' },
  { id: '3', name: 'FisioCenter', plan: 'standard', status: 'inactive', ownerName: 'Carlos Silva', usersCount: 2, nextBilling: 'N/A' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-2023-001', date: '01/10/2023', amount: 197.00, status: 'paid', pdfUrl: '#' },
    { id: 'INV-2023-002', date: '01/11/2023', amount: 197.00, status: 'paid', pdfUrl: '#' },
    { id: 'INV-2023-003', date: '01/12/2023', amount: 197.00, status: 'pending', pdfUrl: '#' },
];

export const MOCK_USAGE: SubscriptionUsage = {
    planName: 'Pro',
    price: 197.00,
    nextRenewalDate: '01/01/2024',
    confirmationsUsed: 1240,
    confirmationsLimit: 3500,
    whatsappConnectionsUsed: 1,
    whatsappConnectionsLimit: 2
};
