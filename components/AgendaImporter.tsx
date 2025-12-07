import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { parseRawAgenda } from '../services/geminiService';
import { Appointment } from '../types';
import { Sparkles, ArrowRight, X, FileText, CheckCircle2 } from 'lucide-react';

interface AgendaImporterProps {
  onImport: (newAppointments: Appointment[]) => void;
  onClose: () => void;
}

export const AgendaImporter: React.FC<AgendaImporterProps> = ({ onImport, onClose }) => {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<Appointment>[]>([]);

  const handleProcess = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    const result = await parseRawAgenda(rawText);
    setParsedData(result);
    setStep('preview');
    setIsProcessing(false);
  };

  const handleConfirm = () => {
    // Convert partials to full appointments
    const finalAppointments: Appointment[] = parsedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      patientId: `new-${Date.now()}-${index}`, // In real app, would match with DB
      patientName: item.patientName || 'Paciente Desconhecido',
      service: item.service || 'Consulta',
      date: item.date || 'Hoje',
      time: item.time || '00:00',
      duration: 30, // Default
      status: 'pending',
      riskScore: undefined // Will be calculated later
    }));

    onImport(finalAppointments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-900 text-white rounded-lg">
                <Sparkles size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-zinc-900">Alimentar Agenda Inteligente</h2>
                <p className="text-sm text-zinc-500">Cole a agenda do dia e deixe a IA organizar.</p>
             </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {step === 'input' ? (
            <div className="space-y-4">
               <label className="block text-sm font-medium text-zinc-600">
                 Cole aqui a lista de hoje (WhatsApp, Excel, Bloco de Notas...)
               </label>
               <textarea 
                 className="w-full h-64 p-4 border border-zinc-200 rounded-xl bg-zinc-50 text-sm focus:ring-2 focus:ring-zinc-300 focus:outline-none resize-none text-zinc-900 placeholder-zinc-400"
                 placeholder={`Exemplo:\n09:00 - João Silva (Limpeza)\n10:30 - Maria Oliveira (Avaliação)\n14:00 - Carlos (Canal)`}
                 value={rawText}
                 onChange={(e) => setRawText(e.target.value)}
               />
               <div className="flex items-center gap-2 text-xs text-zinc-500">
                 <FileText size={14} />
                 <span>A IA reconhece nomes, horários e procedimentos automaticamente.</span>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">{parsedData.length} agendamentos identificados com sucesso.</span>
                </div>
                
                <div className="space-y-2">
                    {parsedData.map((apt, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border border-zinc-200 bg-white rounded-lg hover:border-zinc-300 transition-colors">
                            <div className="bg-zinc-100 px-3 py-1 rounded text-sm font-bold text-zinc-900">
                                {apt.time}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-zinc-900">{apt.patientName}</p>
                                <p className="text-xs text-zinc-500">{apt.service}</p>
                            </div>
                            <div className="text-xs text-zinc-400 font-mono">
                                Aguardando automação
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            {step === 'input' ? (
                 <>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleProcess} isLoading={isProcessing} disabled={!rawText.trim()}>
                        Processar Agenda
                    </Button>
                 </>
            ) : (
                <>
                    <Button variant="secondary" onClick={() => setStep('input')}>Voltar e Editar</Button>
                    <Button onClick={handleConfirm} className="gap-2">
                        Confirmar e Iniciar Robô <ArrowRight size={16} />
                    </Button>
                </>
            )}
        </div>
      </Card>
    </div>
  );
};