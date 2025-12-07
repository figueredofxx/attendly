
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Smartphone, ShieldCheck, Users } from 'lucide-react';
import { UserRole } from '../types';

interface SettingsProps {
  connected: boolean;
  onToggleConnection: () => void;
  userRole: UserRole;
}

export const Settings: React.FC<SettingsProps> = ({ connected, onToggleConnection, userRole }) => {
  const canManageTeam = userRole === 'CLINIC_OWNER';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Configurações</h2>
        <p className="text-sm text-zinc-500">Gerencie a conexão com API Evolution e parâmetros da IA.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${connected ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-500'}`}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Conexão WhatsApp</h3>
              <p className="text-sm text-zinc-500">Status: <span className={connected ? "text-green-600 font-medium" : "text-zinc-500 font-medium"}>{connected ? 'Online' : 'Offline'}</span></p>
            </div>
          </div>
          <Button 
            variant={connected ? "danger" : "primary"}
            onClick={onToggleConnection}
          >
            {connected ? "Desconectar" : "Conectar QR Code"}
          </Button>
        </div>
        
        {!connected && (
           <div className="mt-6 bg-zinc-50 p-4 rounded-xl border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
             <div className="w-32 h-32 bg-white mb-2 shadow-sm border border-zinc-200 flex items-center justify-center text-xs text-zinc-400 font-bold">
               QR Code Simulado
             </div>
             <p className="text-sm text-zinc-500">Abra o WhatsApp > Aparelhos Conectados > Conectar</p>
           </div>
        )}
      </Card>
      
      {/* Team Management - Only for Owners */}
      {canManageTeam && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-100 rounded-lg">
                   <Users size={20} className="text-zinc-600" />
                </div>
                <div>
                   <h3 className="font-semibold text-zinc-900">Gestão de Equipe</h3>
                   <p className="text-xs text-zinc-500">Adicione ou remova recepcionistas.</p>
                </div>
             </div>
             <Button variant="outline" className="text-xs">Adicionar Membro</Button>
          </div>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">JS</div>
                   <div>
                      <p className="text-sm font-medium text-zinc-900">Joana Silva</p>
                      <p className="text-xs text-zinc-500">Recepcionista</p>
                   </div>
                </div>
                <Button variant="ghost" className="text-xs h-8">Editar</Button>
             </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-zinc-100 rounded-lg">
             <ShieldCheck size={20} className="text-zinc-600" />
          </div>
          <h3 className="font-semibold text-zinc-900">Calibração da IA</h3>
        </div>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <div>
                    <p className="text-sm font-medium text-zinc-700">Antecedência dos Lembretes</p>
                    <p className="text-xs text-zinc-500">Quando a IA deve enviar a confirmação</p>
                </div>
                <select className="bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg p-2 focus:ring-2 focus:ring-zinc-400 outline-none">
                    <option>24 horas antes</option>
                    <option>48 horas antes</option>
                    <option>72 horas antes</option>
                </select>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <div>
                    <p className="text-sm font-medium text-zinc-700">Reagendamento Automático</p>
                    <p className="text-xs text-zinc-500">Permitir que a IA sugira novos horários</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                </div>
            </div>

            <div className="flex justify-between items-center py-2">
                <div>
                    <p className="text-sm font-medium text-zinc-700">Tom de Voz</p>
                    <p className="text-xs text-zinc-500">Estilo da conversa no WhatsApp</p>
                </div>
                 <select className="bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg p-2 focus:ring-2 focus:ring-zinc-400 outline-none">
                    <option>Profissional e Empático</option>
                    <option>Formal</option>
                    <option>Descontraído</option>
                </select>
            </div>
        </div>
      </Card>
    </div>
  );
};
