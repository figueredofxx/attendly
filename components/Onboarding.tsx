
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Check, ChevronRight, Store, Smartphone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { parseRawAgenda } from '../services/geminiService';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [tone, setTone] = useState('friendly');

  const handleNext = async () => {
    if (step === 3) {
        // Simulate connecting whatsapp
        setLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setLoading(false);
    }
    if (step < 5) {
        setStep(step + 1);
    } else {
        onComplete();
    }
  };

  const steps = [
    { id: 1, title: 'Bem-vindo', icon: Sparkles },
    { id: 2, title: 'Perfil', icon: Store },
    { id: 3, title: 'WhatsApp', icon: Smartphone },
    { id: 4, title: 'IA & Tom', icon: MessageSquare },
    { id: 5, title: 'Pronto', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -z-10 -translate-y-1/2"></div>
            {steps.map((s) => (
                <div key={s.id} className={`flex flex-col items-center gap-2 bg-zinc-50 px-2 ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.id ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-300 text-zinc-400'}`}>
                        {step > s.id ? <Check size={14} /> : <s.icon size={14} />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{s.title}</span>
                </div>
            ))}
        </div>

        <Card className="p-8 md:p-12 animate-fade-in shadow-xl">
            {step === 1 && (
                <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                        <Sparkles size={32} className="text-zinc-900" />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-900 mb-4">Bem-vindo ao SlimFit AI</h2>
                    <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
                        Em poucos minutos, vamos configurar sua secretária digital para confirmar agendamentos e reduzir faltas automaticamente.
                    </p>
                    <Button onClick={handleNext} className="w-full max-w-xs">
                        Começar Configuração <ChevronRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Perfil da Clínica</h2>
                    <p className="text-zinc-500 mb-6">Como a IA deve chamar seu negócio nas mensagens?</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Nome da Clínica</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900"
                                placeholder="Ex: Clínica Sorriso"
                                value={clinicName}
                                onChange={e => setClinicName(e.target.value)}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-zinc-700 mb-1">Endereço (opcional)</label>
                             <input 
                                type="text" 
                                className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900"
                                placeholder="Para o cartão de localização"
                             />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleNext} disabled={!clinicName}>Próximo</Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                     <h2 className="text-2xl font-bold text-zinc-900 mb-2">Conectar WhatsApp</h2>
                     <p className="text-zinc-500 mb-6">Escaneie o QR Code para permitir que a IA envie mensagens.</p>
                     
                     <div className="bg-zinc-900 p-8 rounded-xl flex flex-col items-center justify-center text-center mb-6">
                         {loading ? (
                             <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
                         ) : (
                             <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4">
                                  <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=slimfit-connect')] bg-cover"></div>
                             </div>
                         )}
                         <p className="text-zinc-400 text-sm">Abra o WhatsApp {'>'} Aparelhos Conectados {'>'} Conectar</p>
                     </div>

                     <div className="flex justify-between items-center">
                         <button className="text-sm text-zinc-500 hover:text-zinc-900 underline" onClick={handleNext}>Pular por enquanto</button>
                         <Button onClick={handleNext} isLoading={loading}>Conectar e Avançar</Button>
                     </div>
                </div>
            )}

            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Personalidade da IA</h2>
                    <p className="text-zinc-500 mb-6">Escolha como a IA deve se comunicar com seus pacientes.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { id: 'formal', label: 'Formal', desc: 'Respeitoso e direto.' },
                            { id: 'friendly', label: 'Amigável', desc: 'Usa emojis e tom leve.' },
                            { id: 'direct', label: 'Direto', desc: 'Foco apenas na confirmação.' }
                        ].map(t => (
                            <div 
                                key={t.id}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${tone === t.id ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}
                                onClick={() => setTone(t.id)}
                            >
                                <p className="font-bold text-zinc-900">{t.label}</p>
                                <p className="text-xs text-zinc-500">{t.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Preview da Mensagem</p>
                        <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-zinc-800">
                            {tone === 'formal' && `Olá, confirmamos seu agendamento na ${clinicName || 'clínica'} para amanhã às 14h. Por favor, confirme sua presença.`}
                            {tone === 'friendly' && `Oi! Tudo bem? ✨ Passando pra lembrar do seu horário na ${clinicName || 'clínica'} amanhã às 14h. Podemos confirmar? 😊`}
                            {tone === 'direct' && `${clinicName || 'Clínica'}: Confirmação de agendamento. Amanhã, 14h. Responda SIM para confirmar.`}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleNext}>Próximo</Button>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
                        <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-900 mb-4">Tudo Pronto!</h2>
                    <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
                        Sua clínica está configurada. Agora vamos importar sua agenda para começar a reduzir o No-Show.
                    </p>
                    <Button onClick={onComplete} className="w-full max-w-xs h-12 text-base">
                        Ir para o Dashboard
                    </Button>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};
