import React, { useState, useRef, useEffect } from 'react';
import { CameraOff, QrCode, AlertTriangle, CheckCircle } from 'lucide-react';

interface QrScannerViewProps {
  onSuccess: (data: string) => void;
  onSwitchMode: () => void;
}

const QrScannerView: React.FC<QrScannerViewProps> = ({ onSuccess, onSwitchMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannedRef = useRef(false);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let active = true;
    
    // Reset scan state on mount
    scannedRef.current = false;
    
    const startCamera = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1080 },
            height: { ideal: 1080 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!active) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);

        // Check for Native BarcodeDetector support
        if ('BarcodeDetector' in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const BarcodeDetector = (window as any).BarcodeDetector;
          
          try {
             const formats = await BarcodeDetector.getSupportedFormats();
             if (formats.includes('qr_code')) {
                 const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
                 
                 const detect = async () => {
                    if (!active) return;
                    if (videoRef.current && videoRef.current.readyState === 4 && !scannedRef.current) {
                      try {
                        const barcodes = await barcodeDetector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                          scannedRef.current = true;
                          setScanned(true); // Trigger visual feedback
                          
                          // Delay the success callback slightly so the user sees the "lock on" visual
                          setTimeout(() => {
                             if (active) onSuccess(barcodes[0].rawValue);
                          }, 800);
                          
                          return; 
                        }
                      } catch (e) {
                        // Ignore frame detection errors (common while video is initializing)
                      }
                    }
                    if (!scannedRef.current && active) {
                       animationFrameId = requestAnimationFrame(detect);
                    }
                  };
                  detect();
             } else {
                 setSupportError("QR code detection is not supported by this device.");
             }
          } catch (e) {
              console.error(e);
              setSupportError("Failed to initialize QR detector.");
          }
        } else {
          // If the browser doesn't support BarcodeDetector, we inform the user instead of faking a success.
          setSupportError("This browser does not support native QR scanning.");
        }

      } catch (err) {
        console.error("Error accessing camera:", err);
        if (active) setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onSuccess]);

  if (hasPermission === false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-6 md:rounded-b-2xl h-full">
        <div className="bg-gray-900 p-8 rounded-2xl flex flex-col items-center text-center max-w-sm">
          <CameraOff size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Please allow camera access to scan QR codes.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-xl font-bold transition-colors w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black relative overflow-hidden md:rounded-b-2xl">
      <style>{`
        @keyframes scan-vertical {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Video Feed */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mode Switcher Overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-8 pt-12 bg-gradient-to-t from-black/90 to-transparent flex justify-center gap-8 animate-in fade-in slide-in-from-bottom-2">
         <button 
           onClick={onSwitchMode} 
           className="text-gray-500 font-medium text-xs tracking-widest hover:text-white pb-2 transition-colors"
         >
           CARD
         </button>
         <span className="text-white font-bold text-xs tracking-widest border-b-2 border-brand-500 pb-2 cursor-default">QR CODE</span>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pb-20">
         
         {/* Dark Background Mask */}
         <div className="absolute inset-0 bg-black/60 z-0"></div>
         
         {/* Cutout Container */}
         <div className="relative z-10 p-1">
             <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden transition-all duration-300">
                {/* Clear Cutout Effect using Box Shadow */}
                <div className={`absolute inset-0 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-300 ${scanned ? 'shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]' : ''}`}></div>
                
                {/* Border Frame */}
                <div className={`absolute inset-0 border-4 rounded-3xl transition-all duration-500 ease-out 
                    ${scanned 
                        ? 'border-green-400 shadow-[0_0_60px_rgba(74,222,128,0.6),inset_0_0_30px_rgba(74,222,128,0.4)] scale-105' 
                        : 'border-white/50'
                    }
                `}></div>
                
                {/* Corner Accents - Hide when scanned to reduce clutter */}
                <div className={`transition-opacity duration-300 ${scanned ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                </div>

                {/* Scanning Laser (Only if supported and not yet scanned) */}
                {!scanned && !supportError && (
                   <div 
                     className="absolute left-0 right-0 h-1 bg-brand-500 shadow-[0_0_15px_rgba(59,130,246,1)] z-20"
                     style={{ animation: 'scan-vertical 2s linear infinite' }}
                   />
                )}
             </div>

             {/* Status Text / Error Message */}
             <div className="absolute -bottom-24 left-0 right-0 text-center px-4">
               {supportError ? (
                  <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-900/80 backdrop-blur-md rounded-xl text-red-100 text-sm font-medium border border-red-500/30 max-w-xs">
                    <AlertTriangle size={18} className="flex-shrink-0" />
                    <span>{supportError}</span>
                  </div>
               ) : (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full text-sm font-medium border transition-all duration-300
                    ${scanned 
                        ? 'bg-green-500/20 border-green-500/50 text-green-300 scale-110' 
                        : 'bg-black/50 border-white/10 text-white/90'
                    }
                  `}>
                    {!scanned ? (
                      <>
                       <QrCode size={16} /> Point at a QR Code
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-green-400 font-bold">Code Detected!</span>
                      </>
                    )}
                  </div>
               )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default QrScannerView;