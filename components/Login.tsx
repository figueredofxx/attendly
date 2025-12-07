
import React from 'react';
import { Card } from './ui/Card';
import { UserRole } from '../types';
import { Store, UserCircle, Shield, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  
  const handleAutoLogin = (role: UserRole) => {
      onLogin(role);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-0 overflow-hidden shadow-2xl border-0">
        <div className="flex flex-col md:flex-row">
            
            {/* Left Side: Brand & Info */}
            <div className="bg-zinc-900 text-white p-8 md:w-2/5 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">SlimFit<span className="text-zinc-500">.</span></h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        A plataforma de inteligência artificial para redução de no-shows e gestão de clínicas.
                    </p>
                </div>
                <div className="mt-8 md:mt-0">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Ambiente de Demonstração</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Sistema Online v1.0
                    </div>
                </div>
            </div>

            {/* Right Side: Auto Login Actions */}
            <div className="p-8 md:w-3/5 bg-white">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Quem é você?</h2>
                
                <div className="space-y-3">
                    {/* Persona 1: Owner */}
                    <button 
                        onClick={() => handleAutoLogin('CLINIC_OWNER')}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left relative overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Store size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900 group-hover:text-black">Dono da Clínica</p>
                            <p className="text-xs text-zinc-500">Acesso total: Financeiro, IA e Configurações</p>
                        </div>
                        <ArrowRight className="absolute right-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" size={20} />
                    </button>

                    {/* Persona 2: Receptionist */}
                    <button 
                        onClick={() => handleAutoLogin('RECEPTIONIST')}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all text-left relative overflow-hidden"
                    >
                         <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
                            <UserCircle size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Recepcionista</p>
                            <p className="text-xs text-zinc-500">Operacional: Agenda e Check-in</p>
                        </div>
                         <ArrowRight className="absolute right-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all" size={20} />
                    </button>

                    {/* Persona 3: SaaS Admin */}
                    <button 
                        onClick={() => handleAutoLogin('SAAS_ADMIN')}
                        className="w-full group flex items-center gap-4 p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left relative overflow-hidden opacity-80 hover:opacity-100"
                    >
                         <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Admin SaaS</p>
                            <p className="text-xs text-zinc-500">Gestão de Planos e Clínicas</p>
                        </div>
                    </button>
                </div>

                <div className="mt-8 text-center border-t border-zinc-100 pt-6">
                    <p className="text-xs text-zinc-400">
                        Este é um login automático para testes. Não requer senha.
                    </p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};
