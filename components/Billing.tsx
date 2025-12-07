
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CreditCard, Download, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { MOCK_INVOICES, MOCK_USAGE } from '../mocks';

export const Billing: React.FC = () => {
  const [usage] = useState(MOCK_USAGE);
  const [invoices] = useState(MOCK_INVOICES);

  const usagePercentage = (usage.confirmationsUsed / usage.confirmationsLimit) * 100;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Minha Assinatura</h2>
          <p className="text-zinc-500">Gerencie seu plano, faturas e limites de uso.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Falar com Suporte</Button>
            <Button variant="primary">Fazer Upgrade</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card className="p-6 md:col-span-2">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Plano Atual</p>
                    <h3 className="text-3xl font-bold text-zinc-900 mt-1 flex items-center gap-2">
                        {usage.planName}
                        <span className="bg-zinc-900 text-white text-xs px-2 py-1 rounded-full font-medium">Ativo</span>
                    </h3>
                    <p className="text-zinc-500 mt-1">Renova em {usage.nextRenewalDate}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-900">R$ {usage.price.toFixed(2)}<span className="text-sm text-zinc-500 font-normal">/mês</span></p>
                    <button className="text-sm text-blue-600 hover:underline mt-1">Alterar método de pagto</button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-zinc-700">Confirmações Automáticas (IA)</span>
                        <span className="text-zinc-500">{usage.confirmationsUsed} / {usage.confirmationsLimit}</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className={`h-2.5 rounded-full ${usagePercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${usagePercentage}%` }}
                        ></div>
                    </div>
                    {usagePercentage > 80 && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} /> Você usou {usagePercentage.toFixed(0)}% do seu limite mensal.
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                    <div className="flex-1">
                         <p className="text-sm font-medium text-zinc-700">Conexões WhatsApp</p>
                         <p className="text-xs text-zinc-500">Números conectados</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-zinc-900">{usage.whatsappConnectionsUsed} / {usage.whatsappConnectionsLimit}</span>
                    </div>
                </div>
            </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6 flex flex-col justify-between bg-zinc-50 border-zinc-200 shadow-none">
            <div>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Método de Pagamento</p>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded border border-zinc-200">
                        <CreditCard size={20} className="text-zinc-800" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900">Mastercard terminando em 4242</p>
                        <p className="text-xs text-zinc-500">Expira em 12/25</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200">
                <Button variant="outline" className="w-full text-xs">Atualizar Cartão</Button>
            </div>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="overflow-hidden">
          <div className="p-6 border-b border-zinc-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-zinc-900">Histórico de Faturas</h3>
              <Button variant="ghost" className="text-xs">Ver Todas</Button>
          </div>
          <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-medium">
                  <tr>
                      <th className="px-6 py-3">Data</th>
                      <th className="px-6 py-3">Valor</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Download</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                  {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-900">{inv.date}</td>
                          <td className="px-6 py-4">R$ {inv.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${
                                  inv.status === 'paid' ? 'bg-green-50 text-green-700' : 
                                  inv.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                              }`}>
                                  {inv.status === 'paid' && <CheckCircle size={12} />}
                                  {inv.status === 'paid' ? 'Pago' : inv.status === 'pending' ? 'Pendente' : 'Atrasado'}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                  <Download size={16} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </Card>

      {/* Upsell Banner */}
      <div className="bg-zinc-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                  <Zap size={24} className="text-yellow-400" />
              </div>
              <div>
                  <h4 className="font-bold text-lg">Precisa de mais poder?</h4>
                  <p className="text-zinc-400 text-sm">O plano Enterprise inclui multi-clínicas, API dedicada e suporte prioritário.</p>
              </div>
          </div>
          <Button className="bg-white text-zinc-900 hover:bg-zinc-100 border-none shrink-0">
              Conhecer Enterprise
          </Button>
      </div>
    </div>
  );
};
