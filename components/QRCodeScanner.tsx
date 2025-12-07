
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { QrCode, X, CheckCircle2, AlertTriangle, ScanLine } from 'lucide-react';
import { validateQRCode } from '../services/geminiService';

interface QRCodeScannerProps {
  onScanSuccess: (appointmentId: string) => void;
  onClose: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [manualCode, setManualCode] = useState('');

  // Simulate scanning process
  const simulateScan = async () => {
    setScanning(true);
    setResult(null);
    // Simulate finding a valid code after 2 seconds
    setTimeout(async () => {
       const res = await validateQRCode("slimfit-valid:1"); // Mock valid hash
       setResult(res);
       setScanning(false);
       if (res.valid && res.appointmentId) {
           setTimeout(() => onScanSuccess(res.appointmentId!), 1500);
       }
    }, 2000);
  };

  const handleManualSubmit = async () => {
      setScanning(true);
      const res = await validateQRCode(manualCode);
      setResult(res);
      setScanning(false);
      if (res.valid && res.appointmentId) {
          setTimeout(() => onScanSuccess(res.appointmentId!), 1500);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-white overflow-hidden relative border-0">
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-10 hover:text-zinc-200">
           <X size={24} />
        </button>
        
        <div className="bg-black relative h-80 flex flex-col items-center justify-center">
            {scanning ? (
                <>
                    <div className="absolute inset-0 border-2 border-green-500/50 m-12 rounded-lg animate-pulse"></div>
                    <ScanLine size={48} className="text-green-500 animate-bounce" />
                    <p className="text-white mt-4 text-sm font-medium">Posicione o QR Code no quadro...</p>
                </>
            ) : result ? (
                 <div className="text-center p-6 animate-fade-in">
                    {result.valid ? (
                        <>
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Acesso Permitido</h3>
                            <p className="text-green-200 mt-2">{result.message}</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">QR Inválido</h3>
                            <p className="text-red-200 mt-2">{result.message}</p>
                            <Button variant="secondary" className="mt-6 w-full" onClick={() => setScanning(true)}>Tentar Novamente</Button>
                        </>
                    )}
                 </div>
            ) : null}
        </div>

        <div className="p-6 bg-white space-y-4">
            <p className="text-sm font-bold text-zinc-900 text-center uppercase tracking-wide">Ou digite o código manual</p>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-zinc-900 text-sm focus:ring-2 focus:ring-zinc-300 outline-none"
                    placeholder="Ex: SLIM-1234"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                />
                <Button onClick={handleManualSubmit}>Validar</Button>
            </div>
            {!scanning && !result && (
                <Button variant="primary" className="w-full" onClick={simulateScan}>
                    <QrCode size={16} className="mr-2" /> Simular Scan Câmera
                </Button>
            )}
        </div>
      </Card>
    </div>
  );
};
