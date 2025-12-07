
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Appointment, Patient, AttendanceStatus } from '../types';
import { analyzeAppointmentRisk, generateRecoveryMessage } from '../services/geminiService';
import { MessageSquare, RefreshCw, AlertCircle, Calendar, Check, MoreHorizontal, PlusCircle, Sparkles, CheckCheck, XCircle, AlertTriangle, QrCode, Ticket } from 'lucide-react';
import { AgendaImporter } from './AgendaImporter';
import { PatientTicket } from './PatientTicket';
import { MOCK_PATIENTS, INITIAL_APPOINTMENTS } from '../mocks';

interface AppointmentListProps {
  whatsappConnected: boolean;
  onSelectPatient: (patient: Patient) => void;
  onRequestScan?: () => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ whatsappConnected, onSelectPatient, onRequestScan }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<{ id: string, text: string } | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [viewTicket, setViewTicket] = useState<Appointment | null>(null);

  const handleAnalyze = async (apt: Appointment) => {
    setAnalyzing(apt.id);
    const patient = MOCK_PATIENTS[apt.patientId] || { 
        id: apt.patientId, 
        name: apt.patientName, 
        phone: '0000', 
        history: { totalAppointments: 1, noShows: 0, lastVisit: 'Hoje' } 
    };

    const analysis = await analyzeAppointmentRisk(apt, patient);
    
    setAppointments(prev => prev.map(a => 
      a.id === apt.id ? { ...a, riskScore: analysis.score, aiAnalysis: analysis.reasoning } : a
    ));
    setAnalyzing(null);
  };

  const handleSimulateMessage = async (apt: Appointment) => {
    if (!whatsappConnected) {
      alert("Conecte o WhatsApp nas configurações para ativar a automação.");
      return;
    }
    setAnalyzing(apt.id);
    const risk = (apt.riskScore || 0) > 70 ? 'HIGH' : (apt.riskScore || 0) > 40 ? 'MEDIUM' : 'LOW';
    const msg = await generateRecoveryMessage(apt, risk);
    setGeneratedMessage({ id: apt.id, text: msg });
    setAnalyzing(null);
  };

  const handleImport = (newAppointments: Appointment[]) => {
    setAppointments(prev => [...newAppointments, ...prev]);
  };

  const updateAttendanceStatus = (id: string, status: AttendanceStatus) => {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, attendanceStatus: status } : a));
  };

  const getRiskColor = (score?: number) => {
    if (score === undefined) return 'bg-zinc-100 text-zinc-500 border-zinc-200';
    if (score < 30) return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    if (score < 70) return 'bg-zinc-100 text-zinc-900 border-zinc-300';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Agenda Inteligente</h2>
          <p className="text-zinc-500">Gestão preditiva de faltas e validação de presença real.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAppointments([...INITIAL_APPOINTMENTS])}>
                <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button variant="primary" onClick={() => setShowImporter(true)}>
                <Sparkles size={16} className="mr-2" /> Importar Agenda
            </Button>
        </div>
      </div>

      {appointments.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-zinc-200 shadow-none bg-zinc-50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Calendar className="text-zinc-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Sua agenda está vazia hoje</h3>
              <p className="text-zinc-500 max-w-sm mb-6">Importe os horários para que a IA inicie a validação de presença.</p>
              <Button onClick={() => setShowImporter(true)}>
                  <PlusCircle size={18} className="mr-2" /> Alimentar Agenda
              </Button>
          </Card>
      ) : (
          <div className="grid gap-3">
            {appointments.map((apt) => (
              <Card key={apt.id} className="group p-0 overflow-hidden transition-all hover:border-zinc-300">
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Time & Status */}
                  <div className="flex items-start gap-4 min-w-[180px]">
                    <div className="text-center bg-zinc-100 rounded-lg p-2 min-w-[60px] border border-zinc-200">
                      <p className="text-xs font-semibold text-zinc-500 uppercase">{apt.date}</p>
                      <p className="text-lg font-bold text-zinc-900">{apt.time}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                            const p = MOCK_PATIENTS[apt.patientId] || { id: apt.patientId, name: apt.patientName, phone: 'N/A', history: { totalAppointments: 0, noShows: 0, lastVisit: 'N/A' } };
                            onSelectPatient(p);
                        }}
                        className="text-base font-bold text-zinc-900 hover:text-zinc-600 hover:underline text-left transition-colors"
                      >
                        {apt.patientName}
                      </button>
                      <div className="flex items-center gap-2">
                          <p className="text-sm text-zinc-500">{apt.service}</p>
                          <button 
                             onClick={() => setViewTicket(apt)}
                             className="text-[10px] font-bold text-zinc-500 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                          >
                             <Ticket size={10} /> Ticket
                          </button>
                      </div>
                    </div>
                  </div>

                  {/* Middle: AI Analysis & Validation Status */}
                  <div className="flex-1 lg:border-l lg:border-r border-zinc-100 lg:px-6">
                    {apt.riskScore !== undefined ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getRiskColor(apt.riskScore)}`}>
                                    {(apt.riskScore || 0) < 30 ? 'Baixo Risco' : (apt.riskScore || 0) < 70 ? 'Risco Médio' : 'Alto Risco'} • {apt.riskScore}%
                                </span>
                                
                                {/* Status Chips */}
                                {apt.attendanceStatus === 'user_declared' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center gap-1">
                                        <AlertTriangle size={10} /> Auto-Declarado (Não Validado)
                                    </span>
                                )}
                                {apt.attendanceStatus === 'verified' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-200 flex items-center gap-1">
                                        <QrCode size={10} /> {apt.validationLog ? `QR • ${apt.validationLog.validatedAt}` : 'Validado'}
                                    </span>
                                )}
                                {apt.attendanceStatus === 'no_show' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                                        <XCircle size={10} /> Falta Confirmada
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed max-w-md">
                                <span className="font-semibold text-zinc-900">Análise IA: </span>
                                {apt.aiAnalysis}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <AlertCircle size={16} />
                            <span>Aguardando análise preditiva...</span>
                        </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {!apt.riskScore ? (
                      <Button 
                        variant="secondary" 
                        onClick={() => handleAnalyze(apt)}
                        isLoading={analyzing === apt.id}
                        className="text-xs"
                      >
                        Analisar Risco
                      </Button>
                    ) : (
                      <>
                        <div className="flex gap-2">
                            {/* Layer 2 Validation Buttons */}
                            {apt.attendanceStatus !== 'verified' && apt.attendanceStatus !== 'no_show' && (
                                <>
                                    <button 
                                        onClick={onRequestScan}
                                        className="p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors shadow-sm"
                                        title="Escanear QR Code (Check-in)"
                                    >
                                        <QrCode size={16} />
                                    </button>
                                    <button 
                                        onClick={() => updateAttendanceStatus(apt.id, 'verified')}
                                        className="p-2 bg-white hover:bg-green-50 text-zinc-400 hover:text-green-600 rounded-lg transition-colors border border-zinc-200 hover:border-green-200"
                                        title="Confirmar Manualmente"
                                    >
                                        <CheckCheck size={16} />
                                    </button>
                                    <button 
                                        onClick={() => updateAttendanceStatus(apt.id, 'no_show')}
                                        className="p-2 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-colors border border-zinc-200 hover:border-red-200"
                                        title="Marcar Falta/Mentira"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                </>
                            )}
                            
                            <Button 
                                variant="outline" 
                                onClick={() => handleSimulateMessage(apt)}
                                disabled={!whatsappConnected}
                                className="text-xs"
                            >
                                <MessageSquare size={14} className="mr-2" /> 
                                Mensagem
                            </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Generated Message Drawer */}
                {generatedMessage?.id === apt.id && (
                  <div className="bg-zinc-50 border-t border-zinc-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 animate-fade-in">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">Sugestão da IA (WhatsApp)</p>
                        <div className="bg-white p-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 shadow-sm relative">
                            {generatedMessage.text}
                            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-zinc-200 rotate-45 hidden md:block"></div>
                        </div>
                    </div>
                    <div className="flex gap-2 md:self-end">
                        <Button variant="danger" className="h-9 text-xs" onClick={() => setGeneratedMessage(null)}>Descartar</Button>
                        <Button variant="primary" className="h-9 text-xs">Enviar Agora</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
      )}

      {/* Import Modal */}
      {showImporter && (
          <AgendaImporter 
            onImport={handleImport} 
            onClose={() => setShowImporter(false)} 
          />
      )}

      {/* Ticket Modal */}
      {viewTicket && (
          <PatientTicket 
             appointment={viewTicket} 
             onClose={() => setViewTicket(null)} 
          />
      )}
    </div>
  );
};
