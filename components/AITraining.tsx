import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { processTrainingFile, saveAIPersonality, getLabelingQueue, submitCorrection, getModelMetrics } from '../services/geminiService';
import { UploadCloud, FileSpreadsheet, MessageSquare, Sliders, BrainCircuit, ShieldAlert, CheckCircle2, ChevronRight, Zap, Target, Edit3, Lock, RefreshCw, BarChart2 } from 'lucide-react';
import { PersonalityConfig, BehaviorRule, TrainingFile, TrainingExample, ModelMetrics } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AITraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'curation' | 'personality' | 'rules' | 'metrics'>('import');
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data Curation State
  const [labelingQueue, setLabelingQueue] = useState<TrainingExample[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  // Privacy State
  const [piiRedaction, setPiiRedaction] = useState(true);

  const [personality, setPersonality] = useState<PersonalityConfig>({
    formality: 40,
    empathy: 80,
    length: 30,
    emojiUsage: true,
    proactiveRescheduling: true,
    abTesting: false,
  });

  const [rules, setRules] = useState<BehaviorRule[]>([
    { id: '1', trigger: 'high_risk', action: 'request_deposit', isActive: true },
    { id: '2', trigger: 'no_show_history', action: 'block_scheduling', isActive: false },
    { id: '3', trigger: 'new_client', action: 'double_confirmation', isActive: true },
  ]);

  useEffect(() => {
    if (activeTab === 'curation') {
        loadLabelingQueue();
    }
    if (activeTab === 'metrics') {
        loadMetrics();
    }
  }, [activeTab]);

  const loadLabelingQueue = async () => {
      const queue = await getLabelingQueue();
      setLabelingQueue(queue);
  };

  const loadMetrics = async () => {
      const m = await getModelMetrics();
      setMetrics(m);
  }

  const handleCorrection = async (id: string, label: string) => {
      setLabelingQueue(prev => prev.filter(item => item.id !== id));
      await submitCorrection(id, label);
  };

  const handleFileUpload = () => {
    setIsProcessing(true);
    // Simulate upload
    setTimeout(async () => {
      const result = await processTrainingFile('csv');
      const newFile: TrainingFile = {
        id: Date.now().toString(),
        name: `export_agenda_${new Date().toLocaleDateString()}.csv`,
        size: '2.4 MB',
        rows: result.newProfiles,
        status: 'completed',
        type: 'csv',
        date: new Date().toLocaleDateString()
      };
      setFiles(prev => [...prev, newFile]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSavePersonality = async () => {
    setIsProcessing(true);
    await saveAIPersonality(personality);
    setIsProcessing(false);
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Treinamento e Calibragem (ML Ops)</h2>
          <p className="text-zinc-500">Gerencie o ciclo de vida da inteligência artificial do seu negócio.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="primary" className="text-xs" onClick={handleSavePersonality} isLoading={isProcessing}>
             <Zap size={14} className="mr-2" /> Treinar Modelo Agora
           </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 space-x-2 md:space-x-6 overflow-x-auto">
        {[
          { id: 'import', label: '1. Ingestão de Dados', icon: UploadCloud },
          { id: 'curation', label: '2. Curadoria (Labeling)', icon: Edit3 },
          { id: 'personality', label: '3. Comportamento', icon: Sliders },
          { id: 'rules', label: '4. Regras', icon: ShieldAlert },
          { id: 'metrics', label: '5. Performance', icon: BarChart2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        
        {/* TAB 1: IMPORT */}
        {activeTab === 'import' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card className="p-8 border-dashed border-2 border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center text-center hover:border-zinc-300 transition-colors cursor-pointer group" onClick={handleFileUpload}>
                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-zinc-50 transition-colors">
                        <UploadCloud size={32} className="text-zinc-400 group-hover:text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Arraste planilhas ou exports</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-2">Suporte para .CSV, .XLSX ou Exportação de Conversas do WhatsApp (.TXT)</p>
                    <Button variant="secondary" className="mt-6" isLoading={isProcessing}>Selecionar Arquivo</Button>
                </Card>

                <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Lock size={20} className={piiRedaction ? "text-green-500" : "text-zinc-400"} />
                        <div>
                            <p className="text-sm font-bold text-zinc-900">Proteção de Dados (LGPD)</p>
                            <p className="text-xs text-zinc-500">Ocultar nomes e telefones durante o treinamento</p>
                        </div>
                    </div>
                    <div 
                      className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${piiRedaction ? 'bg-green-600' : 'bg-zinc-200'}`}
                      onClick={() => setPiiRedaction(!piiRedaction)}
                    >
                       <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${piiRedaction ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                <FileSpreadsheet size={18} /> Histórico de Ingestão
              </h3>
              {files.length === 0 ? (
                <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-200 text-center text-zinc-500 text-sm italic">
                  Nenhum dado importado ainda. A IA está operando com conhecimento zero (Cold Start).
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map(file => (
                    <div key={file.id} className="p-3 bg-white rounded-lg border border-zinc-200 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 text-green-600 rounded flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                          <p className="text-xs text-zinc-500">{file.rows} registros • {file.date}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Processado</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DATA CURATION (LABELING) */}
        {activeTab === 'curation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-zinc-900">Fila de Revisão Humana ({labelingQueue.length})</h3>
                        <p className="text-xs text-zinc-500">Ajude a IA a entender casos ambíguos</p>
                    </div>
                    
                    {labelingQueue.length === 0 ? (
                        <Card className="p-12 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 size={48} className="text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-zinc-900">Tudo limpo!</h3>
                            <p className="text-zinc-500 mt-2">Nenhuma previsão incerta pendente de revisão.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {labelingQueue.map(item => (
                                <Card key={item.id} className="p-0 overflow-hidden border-zinc-200 bg-white">
                                    <div className="p-4 bg-zinc-50 flex justify-between items-center border-b border-zinc-100">
                                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{item.context}</span>
                                        <span className="text-xs text-zinc-600">Confiança: {(item.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-lg font-medium text-zinc-900 mb-4">"{item.input}"</p>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-zinc-500">
                                                IA Sugeriu: <span className="text-zinc-900 font-bold bg-zinc-100 px-2 py-1 rounded ml-1 uppercase">{item.aiPrediction}</span>
                                            </div>
                                            <div className="flex-1 h-px bg-zinc-100"></div>
                                            <div className="flex gap-2">
                                                <Button variant="secondary" className="h-8 text-xs" onClick={() => handleCorrection(item.id, item.aiPrediction)}>
                                                    Correto
                                                </Button>
                                                <Button variant="danger" className="h-8 text-xs" onClick={() => handleCorrection(item.id, 'correction')}>
                                                    Corrigir
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="space-y-4">
                     <Card className="p-5 bg-white border-zinc-200">
                         <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                             <Target size={18} className="text-purple-600" /> Active Learning
                         </h4>
                         <p className="text-sm text-zinc-500 leading-relaxed">
                             Ao corrigir estas previsões, você recalibra o modelo para entender as nuances do seu público específico.
                         </p>
                     </Card>
                     <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center bg-zinc-50">
                         <p className="text-2xl font-bold text-zinc-900 mb-1">142</p>
                         <p className="text-xs text-zinc-500 uppercase">Exemplos Rotulados</p>
                     </div>
                </div>
            </div>
        )}

        {/* TAB 3: PERSONALITY */}
        {activeTab === 'personality' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="p-6 space-y-6">
                 <div>
                   <div className="flex justify-between mb-2">
                     <label className="text-sm font-medium text-zinc-700">Formalidade</label>
                     <span className="text-xs text-zinc-500">{personality.formality}% Formal</span>
                   </div>
                   <input 
                      type="range" 
                      min="0" max="100" 
                      value={personality.formality}
                      onChange={(e) => setPersonality({...personality, formality: Number(e.target.value)})}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                   />
                 </div>

                 <div>
                   <div className="flex justify-between mb-2">
                     <label className="text-sm font-medium text-zinc-700">Empatia</label>
                     <span className="text-xs text-zinc-500">{personality.empathy}% Empático</span>
                   </div>
                   <input 
                      type="range" 
                      min="0" max="100" 
                      value={personality.empathy}
                      onChange={(e) => setPersonality({...personality, empathy: Number(e.target.value)})}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                   />
                 </div>

                 <div>
                   <div className="flex justify-between mb-2">
                     <label className="text-sm font-medium text-zinc-700">Prolixidade (Tamanho)</label>
                     <span className="text-xs text-zinc-500">{personality.length}% (Médio)</span>
                   </div>
                   <input 
                      type="range" 
                      min="0" max="100" 
                      value={personality.length}
                      onChange={(e) => setPersonality({...personality, length: Number(e.target.value)})}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                   />
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-700">Usar Emojis</span>
                    <div 
                      className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${personality.emojiUsage ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      onClick={() => setPersonality({...personality, emojiUsage: !personality.emojiUsage})}
                    >
                       <div className={`w-4 h-4 rounded-full bg-white transition-transform ${personality.emojiUsage ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                 </Card>
                 <Card className="p-4 flex items-center justify-between">
                    <div>
                        <span className="block text-sm font-medium text-zinc-700">Teste A/B</span>
                        <span className="text-[10px] text-zinc-500">Variar mensagens para aprender</span>
                    </div>
                    <div 
                      className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${personality.abTesting ? 'bg-purple-600' : 'bg-zinc-200'}`}
                      onClick={() => setPersonality({...personality, abTesting: !personality.abTesting})}
                    >
                       <div className={`w-4 h-4 rounded-full bg-white transition-transform ${personality.abTesting ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                 </Card>
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col h-full relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full bg-white/80 p-2 text-center text-[10px] uppercase tracking-wider text-zinc-400 font-bold backdrop-blur border-b border-zinc-100">
                 Simulador de Tom
               </div>
               <div className="flex-1 mt-8 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-zinc-200 text-zinc-800 p-3 rounded-2xl rounded-tr-sm text-xs max-w-[80%]">
                       Preciso remarcar minha consulta.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white text-zinc-900 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[90%] shadow-sm border border-zinc-100">
                       {personality.formality > 70 
                         ? "Olá. Compreendo sua solicitação. Verificarei a disponibilidade para reagendamento imediatamente." 
                         : personality.emojiUsage 
                           ? "Poxa, que pena! 😕 Mas sem problemas, vamos resolver. Que tal quinta às 15h? ✨"
                           : "Entendido, sem problemas. Vamos resolver isso. Tenho vaga quinta às 15h, serve?"}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* TAB 4: RULES */}
        {activeTab === 'rules' && (
           <div className="space-y-4">
             {rules.map(rule => (
               <Card key={rule.id} className={`p-5 flex items-center justify-between transition-all ${rule.isActive ? 'border-zinc-300 bg-white' : 'opacity-60 border-zinc-100 bg-zinc-50'}`}>
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${rule.isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                       <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">
                        {rule.trigger === 'high_risk' && 'Quando o risco de falta for ALTO'}
                        {rule.trigger === 'no_show_history' && 'Quando houver histórico de 3+ faltas'}
                        {rule.trigger === 'new_client' && 'Quando for cliente novo (1ª vez)'}
                      </h4>
                      <p className="text-sm text-zinc-500 flex items-center gap-2">
                        Ação: 
                        <span className="text-zinc-700 font-medium bg-zinc-100 px-2 py-0.5 rounded text-xs border border-zinc-200">
                          {rule.action === 'request_deposit' && 'Exigir Sinal (Pix)'}
                          {rule.action === 'block_scheduling' && 'Bloquear Agendamento Auto'}
                          {rule.action === 'double_confirmation' && 'Confirmação Dupla'}
                        </span>
                      </p>
                    </div>
                 </div>
                 <div 
                    className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${rule.isActive ? 'bg-green-500' : 'bg-zinc-200'}`}
                    onClick={() => toggleRule(rule.id)}
                  >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${rule.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
               </Card>
             ))}
           </div>
        )}

        {/* TAB 5: METRICS */}
        {activeTab === 'metrics' && metrics && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                 <h3 className="font-bold text-zinc-900 mb-6">Evolução da Precisão (Acurácia)</h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.history}>
                        <defs>
                          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e4e7', color: '#18181b' }} />
                        <Area type="monotone" dataKey="accuracy" stroke="#22c55e" fillOpacity={1} fill="url(#colorAcc)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="p-6 flex flex-col justify-center items-center bg-white">
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Recall (Sensibilidade)</p>
                    <p className="text-4xl font-bold text-zinc-900">{(metrics.recall * 100).toFixed(0)}%</p>
                    <p className="text-xs text-zinc-500 mt-2 text-center">Capacidade de detectar todos os no-shows</p>
                 </Card>
                 <Card className="p-6 flex flex-col justify-center items-center bg-white">
                    <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Precisão</p>
                    <p className="text-4xl font-bold text-zinc-900">{(metrics.precision * 100).toFixed(0)}%</p>
                    <p className="text-xs text-zinc-500 mt-2 text-center">Acertos quando previu falta</p>
                 </Card>
                 <Card className="p-6 col-span-2 bg-zinc-50 border-zinc-200">
                     <div className="flex justify-between items-center">
                         <div>
                             <p className="text-sm font-bold text-zinc-900">Tamanho do Dataset</p>
                             <p className="text-xs text-zinc-500">Exemplos usados no treino</p>
                         </div>
                         <p className="text-2xl font-bold text-zinc-900">{metrics.trainingSetSize}</p>
                     </div>
                 </Card>
              </div>
           </div>
        )}
        
        {activeTab === 'metrics' && !metrics && (
            <div className="flex items-center justify-center h-64">
                <p className="text-zinc-400">Carregando métricas...</p>
            </div>
        )}

      </div>
    </div>
  );
};