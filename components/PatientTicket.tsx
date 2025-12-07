
import React from 'react';
import { Card } from './ui/Card';
import { Appointment } from '../types';
import { X, Calendar, Clock, MapPin } from 'lucide-react';

interface PatientTicketProps {
  appointment: Appointment;
  onClose: () => void;
}

export const PatientTicket: React.FC<PatientTicketProps> = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm relative">
         <button 
           onClick={onClose} 
           className="absolute -top-12 right-0 text-white hover:text-zinc-200 transition-colors"
         >
             <X size={24} />
         </button>

         <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Header / Brand */}
            <div className="bg-zinc-900 p-6 text-center text-white">
                <h2 className="text-xl font-bold tracking-tight">SlimFit<span className="text-zinc-500">.</span></h2>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">Ticket de Acesso</p>
            </div>

            {/* Content */}
            <div className="p-6 pb-12 relative">
                {/* Punch Holes Effect */}
                <div className="absolute top-0 left-0 -ml-4 -mt-3 w-8 h-8 bg-zinc-900 rounded-full"></div>
                <div className="absolute top-0 right-0 -mr-4 -mt-3 w-8 h-8 bg-zinc-900 rounded-full"></div>

                <div className="text-center mb-8">
                    <p className="text-sm text-zinc-500 mb-1">Paciente</p>
                    <h3 className="text-2xl font-bold text-zinc-900">{appointment.patientName}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                        <Calendar size={16} className="mx-auto text-zinc-400 mb-2" />
                        <p className="text-xs text-zinc-500 uppercase">Data</p>
                        <p className="font-bold text-zinc-900">{appointment.date}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                        <Clock size={16} className="mx-auto text-zinc-400 mb-2" />
                        <p className="text-xs text-zinc-500 uppercase">Horário</p>
                        <p className="font-bold text-zinc-900">{appointment.time}</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">Apresente na Recepção</p>
                    {/* Simulated QR Code */}
                    <div className="w-48 h-48 bg-white mx-auto p-2 border-4 border-zinc-900 rounded-xl flex items-center justify-center">
                        <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=slimfit-valid')] bg-cover bg-no-repeat bg-center opacity-90"></div>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 mt-2">HASH: {appointment.id.substring(0,8).toUpperCase()}</p>
                </div>
            </div>

            {/* Dotted Divider */}
            <div className="relative h-1 w-full">
               <div className="absolute left-0 top-0 -ml-3 w-6 h-6 bg-black/60 rounded-full"></div>
               <div className="absolute right-0 top-0 -mr-3 w-6 h-6 bg-black/60 rounded-full"></div>
               <div className="border-t-2 border-dashed border-zinc-300 w-full h-0 mt-3"></div>
            </div>

            <div className="p-6 bg-zinc-50 text-center">
               <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs">
                   <MapPin size={14} />
                   <span>Av. Paulista, 1000 - Cj 42</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
