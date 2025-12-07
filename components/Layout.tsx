
import React from 'react';
import { ViewState, UserRole, ROLE_PERMISSIONS } from '../types';
import { LayoutDashboard, Calendar, MessageSquare, Settings as SettingsIcon, Users, BrainCircuit, QrCode, Shield, CreditCard } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  whatsappConnected: boolean;
  onRequestScan?: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  setView, 
  children, 
  whatsappConnected, 
  onRequestScan,
  userRole,
  setUserRole
}) => {
  
  const hasPermission = (permission: string) => {
    return ROLE_PERMISSIONS[userRole].includes(permission as any);
  };

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    { id: ViewState.AGENDA, label: 'Agenda', icon: Calendar, permission: 'view_schedule' },
    { id: ViewState.WAITLIST, label: 'Lista de Espera', icon: Users, permission: 'view_schedule' },
    { id: ViewState.CHATS, label: 'Chats IA', icon: MessageSquare, permission: 'view_patients' },
    { id: ViewState.TRAINING, label: 'Treino IA', icon: BrainCircuit, permission: 'manage_clinic' }, 
    { id: ViewState.SAAS_ADMIN, label: 'Admin SaaS', icon: Shield, permission: 'manage_platform' }, 
    { id: ViewState.BILLING, label: 'Minha Assinatura', icon: CreditCard, permission: 'manage_financial' }, 
    { id: ViewState.SETTINGS, label: 'Configurações', icon: SettingsIcon, permission: 'view_dashboard' },
  ];

  const filteredNavItems = navItems.filter(item => hasPermission(item.permission));

  const roleLabels = {
    'SAAS_ADMIN': 'Admin Plataforma (Super)',
    'CLINIC_OWNER': 'Dono da Clínica (Owner)',
    'RECEPTIONIST': 'Recepcionista (Operacional)',
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 h-screen sticky top-0 left-0 z-50">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">SlimFit<span className="text-zinc-400">.</span></h1>
          <span className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase">AI Assistant</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredNavItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             return (
               <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-zinc-100 text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
                }`}
               >
                 <Icon size={18} strokeWidth={2} className={`transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-500'}`} />
                 {item.label}
                 {item.id === ViewState.CHATS && (
                   <span className="ml-auto bg-zinc-100 text-zinc-600 py-0.5 px-2 rounded-full text-[10px] font-bold border border-zinc-200">2</span>
                 )}
               </button>
             );
          })}
        </nav>

        {/* Global Scanner Action (Hidden for SaaS Admin) */}
        {userRole !== 'SAAS_ADMIN' && (
          <div className="px-4 pb-4">
               <button 
                  onClick={onRequestScan}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white p-3 rounded-xl font-bold text-sm shadow-sm hover:bg-zinc-800 transition-colors"
               >
                  <QrCode size={18} /> Scanner QR
               </button>
          </div>
        )}

        {/* Role Switcher (Demo Controls) */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200">
            <div className="mb-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block mb-2">Simular Perfil (Demo)</label>
              <select 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full text-xs bg-white border border-zinc-200 rounded p-1 text-zinc-700 outline-none focus:ring-1 focus:ring-zinc-300"
              >
                <option value="SAAS_ADMIN">Admin SaaS</option>
                <option value="CLINIC_OWNER">Owner (Dono)</option>
                <option value="RECEPTIONIST">Recepcionista</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${whatsappConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                 <span className="text-xs font-medium text-zinc-600 truncate max-w-[120px]">{roleLabels[userRole]}</span>
               </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-screen bg-zinc-50 scroll-smooth">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex justify-between items-center md:hidden">
            <div>
                 <h1 className="text-xl font-bold text-zinc-900">SlimFit.</h1>
            </div>
             <div className={`w-2.5 h-2.5 rounded-full ${whatsappConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
           {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50">
        {filteredNavItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             if (item.id === ViewState.TRAINING || item.id === ViewState.SAAS_ADMIN || item.id === ViewState.BILLING) return null; // Hide complex views on Mobile
             return (
               <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}
               >
                 <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
               </button>
             );
          })}
      </nav>
    </div>
  );
};
