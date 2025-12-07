import React, { useEffect, useState } from 'react';
import { Patient, AIMemory } from '../types';
import { getPatientInsights } from '../services/geminiService';
import { X, Database, BrainCircuit, History, AlertTriangle, Clock, Wallet, User } from 'lucide-react';
import { Card } from './ui/Card';

interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onClose }) => {
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      if (patient.aiMemories && patient.aiMemories.length > 0) {
        setMemories(patient.aiMemories);
      } else {
        const insights = await getPatientInsights(patient);
        setMemories(insights);
      }
      setLoading(false);
    };
    fetchMemories();
  }, [patient]);

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'preference': return <Clock size={14} />;
      case 'financial': return <Wallet size={14} />;
      case 'restriction': return <AlertTriangle size={14} />;
      case 'behavior': return <User size={14} />;
      default: return <BrainCircuit size={14} />;
    }
  };

  const getMemoryColor = (type: string) => {
    switch (type) {
      case 'preference': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'financial': return 'bg-green-50 text-green-700 border-green-100';
      case 'restriction': return 'bg-red-50 text-red-700 border-red-100';
      case 'behavior': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right border-l border-zinc-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{patient.name}</h2>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
               <span className="bg-zinc-100 px-2 py-0.5 rounded text-xs font-medium text-zinc-600">ID: {patient.id}</span>
               <span>•</span>
               <span>{patient.phone}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Structured Data (SQL) */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-zinc-800">
                <Database size={18} className="text-zinc-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Dados Estruturados (SQL)</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-zinc-50 border-zinc-100 shadow-none">
                    <p className="text-xs text-zinc-500 uppercase">Total Agendamentos</p>
                    <p className="text-2xl font-bold text-zinc-900">{patient.history.totalAppointments}</p>
                </Card>
                <Card className="p-4 bg-zinc-50 border-zinc-100 shadow-none">
                    <p className="text-xs text-zinc-500 uppercase">Faltas (No-Show)</p>
                    <p className={`text-2xl font-bold ${patient.history.noShows > 2 ? 'text-red-500' : 'text-zinc-900'}`}>
                        {patient.history.noShows}
                    </p>
                </Card>
                <Card className="p-4 bg-zinc-50 border-zinc-100 shadow-none col-span-2">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Última Visita</p>
                    <p className="font-medium text-zinc-800">{new Date(patient.history.lastVisit).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                </Card>
            </div>
          </section>

          {/* Section 2: AI Memory (Vector) */}
          <section>
             <div className="flex items-center gap-2 mb-4 text-zinc-800">
                <BrainCircuit size={18} className="text-purple-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Memória Vetorial (IA)</h3>
            </div>
            
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              O sistema "aprende" preferências e comportamentos analisando conversas e interações passadas.
            </p>

            {loading ? (
               <div className="space-y-3">
                   <div className="h-10 bg-zinc-100 rounded-lg animate-pulse"></div>
                   <div className="h-10 bg-zinc-100 rounded-lg animate-pulse"></div>
                   <div className="h-10 bg-zinc-100 rounded-lg animate-pulse"></div>
               </div>
            ) : (
                <div className="space-y-3">
                    {memories.map((mem) => (
                        <div key={mem.id} className={`p-3 rounded-lg border flex items-start gap-3 ${getMemoryColor(mem.type)}`}>
                            <div className="mt-0.5 opacity-70">
                                {getMemoryIcon(mem.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-snug">{mem.content}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] uppercase font-bold opacity-60 bg-white/50 px-1.5 rounded">
                                        {mem.source === 'conversation' ? 'Conversa' : mem.source}
                                    </span>
                                    <span className="text-[10px] opacity-70">
                                        Confiança: {mem.confidence}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {memories.length === 0 && (
                        <p className="text-sm text-zinc-500 italic">Nenhuma memória comportamental registrada ainda.</p>
                    )}
                </div>
            )}
          </section>
          
          {/* Footer Info */}
          <div className="pt-6 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <History size={12} />
                  <span>Última sincronização de dados: Há 2 minutos</span>
              </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};