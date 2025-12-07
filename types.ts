
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  AGENDA = 'AGENDA',
  WAITLIST = 'WAITLIST',
  CHATS = 'CHATS',
  TRAINING = 'TRAINING',
  SETTINGS = 'SETTINGS',
  SAAS_ADMIN = 'SAAS_ADMIN',
  BILLING = 'BILLING',
}

export type UserRole = 'SAAS_ADMIN' | 'CLINIC_OWNER' | 'RECEPTIONIST';

export type Language = 'pt' | 'en' | 'es';

export type Permission = 
  | 'manage_platform' 
  | 'manage_clinic' 
  | 'manage_team' 
  | 'view_financial' 
  | 'manage_financial' 
  | 'view_schedule' 
  | 'edit_schedule' 
  | 'view_patients' 
  | 'edit_patients' 
  | 'view_dashboard';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SAAS_ADMIN: ['manage_platform', 'view_financial', 'manage_financial', 'view_dashboard'],
  CLINIC_OWNER: ['manage_clinic', 'manage_team', 'view_financial', 'manage_financial', 'view_schedule', 'edit_schedule', 'view_patients', 'edit_patients', 'view_dashboard'],
  RECEPTIONIST: ['view_schedule', 'edit_schedule', 'view_patients', 'edit_patients', 'view_dashboard']
};

export interface Clinic {
  id: string;
  name: string;
  plan: 'standard' | 'enterprise';
  status: 'active' | 'inactive';
  ownerName: string;
  usersCount: number;
  nextBilling: string;
}

export type MemoryType = 'preference' | 'behavior' | 'medical' | 'financial' | 'restriction';

export interface AIMemory {
  id: string;
  type: MemoryType;
  content: string;
  confidence: number; // 0-100
  source: 'conversation' | 'history' | 'manual';
  detectedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  history: {
    totalAppointments: number;
    noShows: number;
    lastVisit: string;
    ticketAverage?: number;
  };
  tags?: string[];
  aiMemories?: AIMemory[];
  trustScore?: number; // 0-100
}

export type AttendanceStatus = 'pending' | 'user_declared' | 'verified' | 'no_show' | 'late';

export interface ValidationLog {
  validatedAt: string;
  method: 'qr' | 'manual' | 'reception';
  validatedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  duration?: number; // minutes
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  attendanceStatus?: AttendanceStatus;
  riskScore?: number; // 0-100
  aiAnalysis?: string;
  lastCommunication?: string;
  qrCodeHash?: string;
  validationLog?: ValidationLog;
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  desiredService: string;
  availableDays: string[];
  priorityScore: number;
  addedAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatSession {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  lastMessage: string;
  unreadCount: number;
  status: 'active' | 'archived';
  messages: Message[];
}

export interface KPIData {
  noShowReduction: number;
  revenueSaved: number;
  recoveredSlots: number;
  responseRate: number;
  riskAnalysis: {
    high: number;
    medium: number;
    low: number;
  }
}

export interface WhatsappStatus {
  connected: boolean;
  battery?: number;
  lastSync?: string;
}

export interface PersonalityConfig {
  formality: number;
  empathy: number;
  length: number;
  emojiUsage: boolean;
  proactiveRescheduling: boolean;
  abTesting?: boolean;
}

export interface BehaviorRule {
  id: string;
  trigger: 'high_risk' | 'no_show_history' | 'late_payment' | 'new_client';
  action: 'request_deposit' | 'double_confirmation' | 'human_handoff' | 'block_scheduling';
  isActive: boolean;
}

export interface TrainingFile {
  id: string;
  name: string;
  size: string;
  rows: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  type: 'csv' | 'xls' | 'whatsapp_export';
  date: string;
}

export interface TrainingExample {
  id: string;
  input: string;
  context: string;
  aiPrediction: 'confirmed' | 'cancellation' | 'late' | 'reschedule' | 'question';
  confidence: number;
  actualLabel?: string;
  status: 'pending_review' | 'corrected' | 'validated';
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  trainingSetSize: number;
  lastTrainedAt: string;
  history: { date: string; accuracy: number }[];
}

// Billing & Subscription Types
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  pdfUrl: string;
}

export interface SubscriptionUsage {
  confirmationsUsed: number;
  confirmationsLimit: number;
  whatsappConnectionsUsed: number;
  whatsappConnectionsLimit: number;
  planName: 'Starter' | 'Pro' | 'Enterprise';
  nextRenewalDate: string;
  price: number;
}
