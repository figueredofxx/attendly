
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Clinic } from '../types';
import { Users, DollarSign, Activity, Settings } from 'lucide-react';
import { MOCK_CLINICS } from '../mocks';

export const SaaSAdmin: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Administração da Plataforma</h2>
          <p className="text-zinc-500">Visão global do Micro-SaaS (Super Admin).</p>
        </div>
        <Button variant="primary">Nova Clínica</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total de Clínicas</p>
              <h3 className="text-2xl font-bold text-zinc-900">42</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">MRR (Receita Mensal)</p>
              <h3 className="text-2xl font-bold text-zinc-900">R$ 12.450</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Agendamentos Hoje</p>
              <h3 className="text-2xl font-bold text-zinc-900">1.284</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
           <h3 className="font-bold text-zinc-900">Clínicas Cadastradas</h3>
           <div className="flex gap-2">
              <Button variant="outline" className="text-xs h-8">Filtrar</Button>
              <Button variant="outline" className="text-xs h-8">Exportar</Button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3">Clínica</th>
                <th className="px-6 py-3">Plano</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Usuários</th>
                <th className="px-6 py-3">Faturamento</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLINICS.map((clinic) => (
                <tr key={clinic.id} className="bg-white border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">{clinic.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${clinic.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-700'}`}>
                      {clinic.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${clinic.status === 'active' ? 'text-green-600' : 'text-zinc-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${clinic.status === 'active' ? 'bg-green-500' : 'bg-zinc-300'}`}></div>
                      {clinic.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{clinic.ownerName}</td>
                  <td className="px-6 py-4 text-zinc-500">{clinic.usersCount}</td>
                  <td className="px-6 py-4 text-zinc-500">{clinic.nextBilling}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Settings size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
