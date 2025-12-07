
import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Check, ArrowRight, MessageSquare, Calendar, Zap, Shield, BarChart3, Smartphone, ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">SlimFit<span className="text-zinc-400">.</span></h1>
            <span className="text-[10px] font-bold bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600 uppercase tracking-wider">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Login
            </button>
            <Button onClick={onSignupClick} className="text-xs h-9">
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Novo: Validação de Presença via QR Code
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
            Agenda cheia.<br/>
            <span className="text-zinc-400">Zero faltas.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A secretária digital que usa Inteligência Artificial para confirmar agendamentos pelo WhatsApp e reduzir o No-Show em até 80%.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onSignupClick} className="h-12 px-8 text-base w-full sm:w-auto">
              Teste Grátis por 7 Dias <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
              Ver Demonstração
            </Button>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Não requer cartão de crédito • Instalação em 2 minutos
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900">Como o SlimFit funciona</h2>
            <p className="text-zinc-500 mt-2">Automação inteligente em três etapas simples.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-none bg-zinc-50 shadow-none hover:bg-zinc-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <BrainCircuit size={24} className="text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">1. Previsão</h3>
              <p className="text-zinc-500 leading-relaxed">
                Nossa IA analisa o histórico de cada paciente e calcula o risco de falta (Score de No-Show) antes mesmo de enviar a mensagem.
              </p>
            </Card>

            <Card className="p-8 border-none bg-zinc-50 shadow-none hover:bg-zinc-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <MessageSquare size={24} className="text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">2. Confirmação</h3>
              <p className="text-zinc-500 leading-relaxed">
                O sistema envia mensagens naturais via WhatsApp. Se o paciente cancelar, a IA sugere automaticamente um novo horário.
              </p>
            </Card>

            <Card className="p-8 border-none bg-zinc-50 shadow-none hover:bg-zinc-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Zap size={24} className="text-zinc-900" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">3. Recuperação</h3>
              <p className="text-zinc-500 leading-relaxed">
                Horários vagos são oferecidos instantaneamente para a Lista de Espera Inteligente, garantindo ocupação máxima.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlight: QR Code */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-zinc-900 rounded-3xl p-8 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
           
           <div className="flex-1 relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold mb-6 border border-zinc-700">
                Exclusive Tech
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chega de mentiras no WhatsApp.</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Muitos sistemas marcam "Confirmado" apenas porque o paciente respondeu. 
                O SlimFit usa <strong>QR Code e Geolocalização</strong> para validar a presença real. 
                Sua métrica financeira nunca foi tão precisa.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={14} /></div>
                  Check-in inviolável via QR Code
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={14} /></div>
                  Painel de recepção dedicado
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={14} /></div>
                  Auditoria de horários reais
                </li>
              </ul>
              <Button className="bg-white text-black hover:bg-zinc-200 border-none">
                Ver na Prática
              </Button>
           </div>
           
           <div className="flex-1 flex justify-center relative z-10">
              <div className="bg-white p-4 rounded-2xl shadow-2xl rotate-3 max-w-xs">
                 <div className="w-64 h-64 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=demo')] bg-cover opacity-90"></div>
                 </div>
                 <div className="text-center">
                    <p className="text-zinc-900 font-bold text-lg">Ticket de Acesso</p>
                    <p className="text-zinc-500 text-sm">Validado em 14:02</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900">Planos simples e transparentes</h2>
            <p className="text-zinc-500 mt-2">Escolha o tamanho ideal para sua clínica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <Card className="p-8 flex flex-col border-zinc-200">
               <div className="mb-4">
                 <h3 className="text-lg font-bold text-zinc-900">Starter</h3>
                 <p className="text-sm text-zinc-500">Para profissionais autônomos.</p>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-bold text-zinc-900">R$ 97</span>
                 <span className="text-zinc-500">/mês</span>
               </div>
               <div className="flex-1 space-y-4 mb-8">
                 <FeatureItem text="1 Clínica" />
                 <FeatureItem text="1.500 confirmações/mês" />
                 <FeatureItem text="Agenda Inteligente" />
                 <FeatureItem text="Lista de Espera Básica" />
               </div>
               <Button onClick={onSignupClick} variant="outline" className="w-full">Começar Grátis</Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 flex flex-col border-zinc-900 relative shadow-xl transform md:-translate-y-4">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">
                 Mais Popular
               </div>
               <div className="mb-4">
                 <h3 className="text-lg font-bold text-zinc-900">Pro</h3>
                 <p className="text-sm text-zinc-500">Para clínicas em crescimento.</p>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-bold text-zinc-900">R$ 197</span>
                 <span className="text-zinc-500">/mês</span>
               </div>
               <div className="flex-1 space-y-4 mb-8">
                 <FeatureItem text="Até 2 Clínicas" />
                 <FeatureItem text="3.500 confirmações/mês" />
                 <FeatureItem text="IA Comportamental Avançada" />
                 <FeatureItem text="Validação via QR Code" />
                 <FeatureItem text="Multi-usuários" />
               </div>
               <Button onClick={onSignupClick} className="w-full">Começar Grátis</Button>
            </Card>

            {/* Enterprise */}
            <Card className="p-8 flex flex-col border-zinc-200">
               <div className="mb-4">
                 <h3 className="text-lg font-bold text-zinc-900">Enterprise</h3>
                 <p className="text-sm text-zinc-500">Para redes e franquias.</p>
               </div>
               <div className="mb-6">
                 <span className="text-2xl font-bold text-zinc-900">Sob Consulta</span>
               </div>
               <div className="flex-1 space-y-4 mb-8">
                 <FeatureItem text="Clínicas Ilimitadas" />
                 <FeatureItem text="API Dedicada & Webhooks" />
                 <FeatureItem text="Gestor de Conta Exclusivo" />
                 <FeatureItem text="Integração com ERPs" />
               </div>
               <Button onClick={onSignupClick} variant="outline" className="w-full">Falar com Vendas</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">SlimFit<span className="text-zinc-400">.</span></h2>
               <p className="text-sm text-zinc-500">
                 Reduzindo o No-Show no Brasil através de tecnologia real e transparente.
               </p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">Recursos</a></li>
                <li><a href="#" className="hover:text-zinc-900">Preços</a></li>
                <li><a href="#" className="hover:text-zinc-900">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">Sobre nós</a></li>
                <li><a href="#" className="hover:text-zinc-900">Carreiras</a></li>
                <li><a href="#" className="hover:text-zinc-900">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">Privacidade</a></li>
                <li><a href="#" className="hover:text-zinc-900">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-zinc-900">LGPD</a></li>
              </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-100 text-center text-xs text-zinc-400">
            © 2025 SlimFit AI. Todos os direitos reservados.
         </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
      <Check size={12} className="text-green-700" />
    </div>
    <span className="text-sm text-zinc-600">{text}</span>
  </div>
);

import { BrainCircuit } from 'lucide-react'; // Fix missing import if any
