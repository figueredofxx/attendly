
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { WaitlistEntry, Patient } from '../types';
import { matchWaitlistToSlot } from '../services/geminiService';
import { Search, ArrowRight, UserPlus, Zap } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_WAITLIST } from '../mocks';

interface WaitlistProps {
    onSelectPatient?: (patient: Patient) => void;
}

export const Waitlist: React.FC<WaitlistProps> = ({ onSelectPatient }) => {
    const [entries, setEntries] = useState<WaitlistEntry[]>(MOCK_WAITLIST);
    const [matching, setMatching] = useState<boolean>(false);
    const [suggestion, setSuggestion] = useState<WaitlistEntry | null>(null);

    const handleFindMatch = async () => {
        setMatching(true);
        // Simulate finding a match for a hypothetical empty slot
        await new Promise(r => setTimeout(r, 1500)); 
        const match = await matchWaitlistToSlot('15:00', entries);
        setSuggestion(match);
        setMatching(false);
    };

    const handlePatientClick = (patientId: string) => {
        if (!onSelectPatient) return;
        const patient = MOCK_PATIENTS[patientId];
        if (patient) onSelectPatient(patient);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Lista de Espera Inteligente</h2>
                    <p className="text-zinc-500">A IA preenche lacunas automaticamente encontrando o melhor paciente.</p>
                </div>
                <Button variant="primary">
                    <UserPlus size={16} className="mr-2" /> Adicionar Paciente
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="p-4 flex items-center justify-between hover:border-zinc-300 transition-colors">
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => handlePatientClick(entry.patientId)}>
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-semibold text-sm border border-zinc-200">
                                    {entry.patientName.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 hover:text-zinc-700 hover:underline">{entry.patientName}</h3>
                                    <p className="text-xs text-zinc-500">{entry.desiredService} • {entry.availableDays.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-zinc-500">Prioridade</p>
                                    <p className={`text-sm font-bold ${entry.priorityScore > 80 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                        {entry.priorityScore}/100
                                    </p>
                                </div>
                                <Button variant="outline" className="h-8 text-xs px-3">Editar</Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Automation Panel */}
                <div className="space-y-4">
                    <Card className="p-5 bg-zinc-900 text-zinc-50 border-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={20} className="text-zinc-50" fill="currentColor" />
                            <h3 className="font-bold">Preenchimento Rápido</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6">
                            Simule o cancelamento de um horário hoje às 15:00 e deixe a IA encontrar o substituto ideal.
                        </p>
                        <Button 
                            variant="secondary" 
                            className="w-full justify-center bg-white text-zinc-900 hover:bg-zinc-100 border-none"
                            onClick={handleFindMatch}
                            isLoading={matching}
                        >
                            {matching ? 'Analisando...' : 'Encontrar Substituto'}
                        </Button>
                    </Card>

                    {suggestion && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sugestão da IA</span>
                                <div className="h-px bg-zinc-200 flex-1"></div>
                            </div>
                            <Card className="p-4 border-zinc-900 border-2 relative overflow-hidden bg-white">
                                <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                    MATCH 98%
                                </div>
                                <h4 
                                    className="font-bold text-zinc-900 cursor-pointer hover:underline"
                                    onClick={() => handlePatientClick(suggestion.patientId)}
                                >
                                    {suggestion.patientName}
                                </h4>
                                <p className="text-sm text-zinc-500 mb-3">Disponibilidade total hoje e alta probabilidade de aceite.</p>
                                <Button className="w-full text-xs h-8 gap-2">
                                    Agendar Agora <ArrowRight size={14} />
                                </Button>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
