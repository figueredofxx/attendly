
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Card } from './ui/Card';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Lock } from 'lucide-react';
import { KPIData, UserRole } from '../types';

const revenueData = [
  { name: 'Sem 1', value: 1200 },
  { name: 'Sem 2', value: 1900 },
  { name: 'Sem 3', value: 1500 },
  { name: 'Sem 4', value: 2400 },
  { name: 'Sem 5', value: 3450 },
];

const riskData = [
  { name: 'Baixo', value: 65, color: '#18181b' }, 
  { name: 'Médio', value: 25, color: '#71717a' }, 
  { name: 'Alto', value: 10, color: '#e4e4e7' }, 
];

interface DashboardProps {
  kpi: KPIData;
  userRole: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ kpi, userRole }) => {
  const canViewFinancials = userRole !== 'RECEPTIONIST';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h2>
        <p className="text-zinc-500">Monitoramento em tempo real da eficiência da agenda.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 flex flex-col gap-4 border-l-4 border-l-zinc-900 relative overflow-hidden">
          {!canViewFinancials && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                 <Lock size={24} className="text-zinc-400 mb-2" />
                 <p className="text-xs font-bold text-zinc-500">Acesso Financeiro Restrito</p>
             </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Receita Salva</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-1">R$ {kpi.revenueSaved.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-900 font-bold">12 horários</span> recuperados este mês
          </p>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Redução de No-Show</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-1">{kpi.noShowReduction}%</h3>
            </div>
            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-900 font-bold">+5%</span> vs. mês anterior
          </p>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Taxa de Resposta</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-1">{kpi.responseRate}%</h3>
            </div>
            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Confirmações via WhatsApp
          </p>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Vagas Preenchidas</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-1">{kpi.recoveredSlots}</h3>
            </div>
            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Lista de espera automática
          </p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="p-6 lg:col-span-2 relative">
          {!canViewFinancials && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-4">
                 <Lock size={32} className="text-zinc-400 mb-2" />
                 <p className="font-bold text-zinc-600">Acesso Financeiro Restrito</p>
                 <p className="text-xs text-zinc-500 mt-1">Contate o dono da clínica para acesso.</p>
             </div>
          )}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">Impacto Financeiro Acumulado</h3>
            <select className="bg-zinc-50 border border-zinc-200 text-xs rounded-lg px-2 py-1 outline-none text-zinc-700">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#18181b' }}
                  formatter={(value: number) => [`R$ ${value}`, 'Receita Salva']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#18181b" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Análise de Risco (Hoje)</h3>
            <p className="text-xs text-zinc-500 mt-1">Previsão baseada no histórico dos pacientes.</p>
          </div>
          <div className="h-64 w-full flex flex-col justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={riskData} layout="vertical" barSize={32}>
                 <XAxis type="number" hide />
                 <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={50} 
                    tick={{ fontSize: 12, fill: '#71717a', fontWeight: 500 }} 
                    axisLine={false} 
                    tickLine={false} 
                 />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderColor: '#e4e4e7', borderRadius: '8px', color: '#18181b' }} itemStyle={{color: '#18181b'}} />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
             
             {/* Insight Box */}
             <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
               <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                 <p className="text-xs text-zinc-600 leading-relaxed">
                   <strong className="text-red-600">Atenção:</strong> 3 agendamentos de alto risco. A IA iniciou o protocolo de confirmação reforçada.
                 </p>
               </div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
