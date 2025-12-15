import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Smartphone, AlertCircle, X, CheckCircle, RefreshCw } from 'lucide-react';

interface NfcScanViewProps {
  onSuccess: (data: string) => void;
  onCancel: () => void;
}

const NfcScanView: React.FC<NfcScanViewProps> = ({ onSuccess, onCancel }) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap "Start Scan" to begin');
  const [error, setError] = useState<string | null>(null);
  const readerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    // Check if NDEFReader is available in the window object
    if ('NDEFReader' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError("Web NFC is not supported on this device or browser. Try Chrome on Android.");
    }

    return () => {
      // Cleanup not strictly necessary for NFC as it usually cancels on visibility change, 
      // but good practice if we had an abort controller.
    };
  }, []);

  const startScan = async () => {
    setError(null);
    setStatusMessage('Hold your device near the tag...');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const NDEFReader = (window as any).NDEFReader;
      const ndef = new NDEFReader();
      readerRef.current = ndef;

      await ndef.scan();
      setIsScanning(true);
      setStatusMessage('Scanning... Bring tag closer.');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder();
        let payload = '';

        for (const record of event.message.records) {
          if (record.recordType === "text") {
            const text = decoder.decode(record.data);
            payload += text + '\n';
          } else if (record.recordType === "url") {
             const text = decoder.decode(record.data);
             payload += text + '\n';
          } else {
             // Try generic decode
             try {
                payload += decoder.decode(record.data) + '\n';
             } catch (e) {
                payload += `[${record.recordType} record]\n`;
             }
          }
        }
        
        // Success feedback
        setIsScanning(false);
        setStatusMessage("Tag Read Successfully!");
        onSuccess(payload.trim());
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ndef.onreadingerror = () => {
        setError("Argh! Cannot read data from the NFC tag. Try another one?");
        setIsScanning(false);
      };

    } catch (err: any) {
      console.error("NFC Error:", err);
      setIsScanning(false);
      if (err.name === 'NotAllowedError') {
        setError("NFC permission was denied. Please allow NFC access.");
      } else if (err.name === 'NotSupportedError') {
        setError("NFC is not compatible with this device context.");
      } else {
        setError(`Failed to start NFC: ${err.message || 'Unknown error'}`);
      }
    }
  };

  // Simulation handler for desktop testing
  const handleSimulate = () => {
      setIsScanning(true);
      setStatusMessage('Simulating scan...');
      setTimeout(() => {
          setIsScanning(false);
          onSuccess("Simulated Contact: John Doe (NFC)");
      }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 relative overflow-hidden md:rounded-b-2xl text-white">
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 2s infinite ease-out;
        }
        .delay-75 { animation-delay: 0.75s; }
        .delay-150 { animation-delay: 1.5s; }
      `}</style>

      {/* Top Bar */}
      <div className="absolute top-4 right-4 z-20">
         <button onClick={onCancel} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <X size={24} />
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
        
        {/* Dynamic Icon Container */}
        <div className="relative mb-12">
            {isScanning && (
                <>
                    <div className="absolute inset-0 bg-brand-500 rounded-full opacity-50 animate-ripple"></div>
                    <div className="absolute inset-0 bg-brand-500 rounded-full opacity-50 animate-ripple delay-75"></div>
                    <div className="absolute inset-0 bg-brand-500 rounded-full opacity-50 animate-ripple delay-150"></div>
                </>
            )}
            
            <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500
                ${isScanning ? 'bg-brand-500 shadow-[0_0_50px_rgba(59,130,246,0.6)]' : 'bg-slate-800 border-2 border-slate-700'}
            `}>
                {error ? (
                    <AlertCircle size={48} className="text-red-400" />
                ) : isScanning ? (
                    <Wifi size={56} className="text-white animate-pulse" />
                ) : (
                    <Smartphone size={56} className="text-slate-400" />
                )}
            </div>
            
            {/* Overlay Icon */}
            {!isScanning && !error && (
                <div className="absolute -bottom-2 -right-2 bg-brand-500 p-3 rounded-full border-4 border-slate-900 shadow-lg">
                    <Wifi size={24} />
                </div>
            )}
        </div>

        {/* Text Status */}
        <h3 className="text-2xl font-bold mb-3 tracking-tight">
            {error ? 'Scan Failed' : isScanning ? 'Scanning...' : 'Ready to Scan'}
        </h3>
        
        <p className={`max-w-xs mx-auto text-sm leading-relaxed mb-8 transition-colors
            ${error ? 'text-red-300' : 'text-slate-400'}
        `}>
            {error || statusMessage}
        </p>

        {/* Action Button */}
        <div className="w-full max-w-xs space-y-4">
            {!isScanning && (
                <button
                    onClick={isSupported ? startScan : handleSimulate}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
                        ${error && isSupported
                            ? 'bg-slate-700 text-white hover:bg-slate-600'
                            : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-900/50'
                        }
                    `}
                >
                    {error && isSupported ? (
                        <> <RefreshCw size={20} /> Retry </>
                    ) : (
                        <> {isSupported ? 'Start Scan' : 'Simulate Scan (Dev)'} </>
                    )}
                </button>
            )}

            {isScanning && (
                <button 
                    onClick={() => { setIsScanning(false); setStatusMessage('Scan canceled.'); }}
                    className="w-full py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                >
                    Cancel
                </button>
            )}
            
            {!isSupported && !isScanning && (
                 <div className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="mb-1 font-semibold text-slate-400">Browser Compatibility:</p>
                    Requires Chrome 89+ on Android. <br/> Use the "Simulate" button to test the flow on this device.
                 </div>
            )}
        </div>

      </div>

      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default NfcScanView;