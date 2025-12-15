import React, { useState, useRef, useEffect } from 'react';
import { Loader2, RefreshCw, Check, Maximize, FileImage, ScanLine, AlertTriangle, CameraOff, Plus, ArrowRight, Trash2, Settings, Layers, CheckCircle } from 'lucide-react';

interface CameraViewProps {
  onSuccess: (images: string[]) => void;
  onSwitchMode: () => void;
}

type CameraStatus = 'idle' | 'analyzing' | 'review' | 'error';

const CameraView: React.FC<CameraViewProps> = ({ onSuccess, onSwitchMode }) => {
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Stores confirmed images
  const [images, setImages] = useState<string[]>([]);
  // Stores the temporary image currently being reviewed
  const [tempImage, setTempImage] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionErrorType, setPermissionErrorType] = useState<string>('');
  const [flash, setFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMounted = useRef(true);
  const MAX_IMAGES = 5;

  useEffect(() => {
    isMounted.current = true;
    startCamera();
    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported");
      }

      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // If component unmounted during the async call, stop stream immediately and exit
      if (!isMounted.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Handle race condition where play() is interrupted by unmount
        videoRef.current.play().catch(err => {
            if (err.name !== 'AbortError') {
                console.error("Video play error:", err);
            }
        });
      }
      setHasPermission(true);
      setErrorMessage('');
    } catch (err: any) {
      if (!isMounted.current) return;
      
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      
      let type = 'generic';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        type = 'denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        type = 'not-found';
      }
      setPermissionErrorType(type);
      setErrorMessage("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const captureFrame = (): string | null => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }
    return null;
  };

  const handleCapture = () => {
    if (status !== 'idle') return;

    // Trigger flash
    setFlash(true);
    setTimeout(() => setFlash(false), 250);

    const imgData = captureFrame();
    setTempImage(imgData);

    if (videoRef.current) {
      videoRef.current.pause();
    }

    setStatus('analyzing');
    
    // Simulate AI processing
    setTimeout(() => {
      if (!isMounted.current) return;

      const isSuccess = attempt > 0 || Math.random() > 0.3; // 70% success rate on first try

      if (isSuccess) {
        setStatus('review'); // Go to review state instead of immediate success
        setErrorMessage('');
      } else {
        setStatus('error');
        setErrorMessage('Blur detected. Hold steady.');
        setAttempt(prev => prev + 1);
      }
    }, 1500);
  };

  const resetToIdle = () => {
    setStatus('idle');
    setErrorMessage('');
    setTempImage(null);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    }
  };

  const handleSaveImage = () => {
    if (tempImage) {
        const newImages = [...images, tempImage];
        setImages(newImages);
        // Images length check is handled in render logic (hiding capture button)
        resetToIdle();
    }
  };

  const handleFinish = () => {
    // If we are in review mode and user clicks finish, we assume they want to keep the current one too?
    // Usually 'Finish' means 'Done with what I have'.
    // If the user is reviewing a valid image, let's auto-save it before finishing.
    let finalImages = [...images];
    if (status === 'review' && tempImage) {
        finalImages.push(tempImage);
    }
    onSuccess(finalImages);
  };

  if (hasPermission === false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white p-6 md:rounded-b-2xl h-full relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>

        <div className="relative z-10 max-w-sm w-full bg-gray-800/80 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-500/30">
            <CameraOff size={36} className="text-red-500" />
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white">
            {permissionErrorType === 'denied' ? 'Camera Access Denied' : 
             permissionErrorType === 'not-found' ? 'No Camera Found' : 
             'Camera Unavailable'}
          </h3>
          
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            {permissionErrorType === 'denied' 
              ? "We need camera access to capture your documents. Please check your browser permission settings and allow access."
              : permissionErrorType === 'not-found'
              ? "We couldn't detect a camera on your device. Please ensure your device has a working camera."
              : "Something went wrong while trying to access your camera. It might be in use by another application."}
          </p>

          <button 
            onClick={() => {
                if (permissionErrorType === 'denied') {
                    window.location.reload();
                } else {
                    startCamera();
                }
            }}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-900/50 active:scale-95 flex items-center justify-center gap-2 mb-3"
          >
            <RefreshCw size={20} />
            {permissionErrorType === 'denied' ? 'Reload Page' : 'Try Again'}
          </button>
          
          {permissionErrorType === 'denied' && (
             <div className="text-xs text-gray-500 flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700/50">
                <Settings size={14} />
                <span>Check browser address bar for settings</span>
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black relative overflow-hidden md:rounded-b-2xl">
      <style>{`
        @keyframes scan-line {
          0% { 
            top: 0%; 
            opacity: 0; 
            transform: scaleX(0.5);
            box-shadow: 0 0 5px rgba(59, 130, 246, 0);
          }
          15% { 
            opacity: 1; 
            transform: scaleX(1);
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
          50% { 
            box-shadow: 0 0 40px 8px rgba(59, 130, 246, 0.9), 0 0 15px 4px rgba(147, 197, 253, 0.8); 
          }
          85% { 
            opacity: 1; 
            transform: scaleX(1); 
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
          100% { 
            top: 100%; 
            opacity: 0; 
            transform: scaleX(0.5); 
            box-shadow: 0 0 5px rgba(59, 130, 246, 0);
          }
        }
        @keyframes pulse-border-idle {
          0%, 100% { border-color: rgba(255, 255, 255, 0.4); box-shadow: 0 0 0 9999px rgba(0,0,0,0.5), inset 0 0 0 0 rgba(255,255,255,0); }
          50% { border-color: rgba(255, 255, 255, 1); box-shadow: 0 0 0 9999px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.2), 0 0 15px rgba(255,255,255,0.3); }
        }
        @keyframes glow-border-analyzing {
          0%, 100% { border-color: rgba(59, 130, 246, 0.8); box-shadow: 0 0 0 9999px rgba(0,0,0,0.5), inset 0 0 15px rgba(59, 130, 246, 0.2); }
          50% { border-color: #60a5fa; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5), inset 0 0 30px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.4); }
        }
        .animate-pulse-border {
          animation: pulse-border-idle 3s infinite ease-in-out;
        }
        .animate-glow-border {
          animation: glow-border-analyzing 1s infinite ease-in-out;
        }
      `}</style>

      {/* Camera Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ease-out ${flash ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex flex-col gap-2 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex justify-between items-start w-full pointer-events-auto">
             {/* Counter Badge */}
            <div className="flex flex-col items-start gap-1">
                <div className={`backdrop-blur-md rounded-lg px-3 py-1.5 border text-xs font-medium flex items-center gap-2 shadow-lg transition-colors duration-300
                    ${images.length === MAX_IMAGES 
                        ? "bg-green-900/80 border-green-500/50 text-white" 
                        : "bg-black/50 border-white/10 text-white"
                    }
                `}>
                     {images.length === MAX_IMAGES ? <CheckCircle size={12} className="text-green-400" /> : <Layers size={12} className="text-brand-400" />}
                     <span className={images.length === MAX_IMAGES ? "text-green-400 font-bold" : "text-brand-400"}>
                        {images.length} Captured
                     </span>
                     <span className="w-px h-3 bg-white/20"></span>
                     <span className="text-gray-400">{MAX_IMAGES - images.length} Remaining</span>
                </div>
                {/* Visual Dots */}
                <div className="flex gap-1 mt-1 pl-1">
                    {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm
                                ${i < images.length 
                                    ? (images.length === MAX_IMAGES ? 'w-6 bg-green-500' : 'w-6 bg-brand-500') 
                                    : 'w-1.5 bg-white/20'
                                }
                            `}
                        />
                    ))}
                </div>
            </div>
            
            {/* Gallery Preview (Small) if idle */}
            {status === 'idle' && images.length > 0 && (
                <div className="flex gap-2">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative w-10 h-10 rounded overflow-hidden border border-white/30 cursor-pointer hover:border-brand-500 transition-colors bg-gray-900">
                            <img src={img} className="w-full h-full object-cover opacity-80 hover:opacity-100" alt={`scan-${idx}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Video Feed */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Captured Image Overlay (Review Mode) */}
      {tempImage && (status === 'review' || status === 'analyzing') && (
        <div className="absolute inset-0 z-0 bg-black animate-in fade-in duration-200">
          <img src={tempImage} className="w-full h-full object-cover" alt="Captured frame" />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      )}

      {/* Viewfinder */}
      <div className="relative flex-1 flex items-center justify-center p-6 z-10">
        <div 
          className={`relative w-full max-w-md aspect-[1.586/1] border-2 rounded-xl flex items-center justify-center transition-all duration-300
          ${status === 'idle' && images.length < MAX_IMAGES ? 'animate-pulse-border' : ''}
          ${status === 'idle' && images.length === MAX_IMAGES ? 'border-green-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]' : ''}
          ${status === 'analyzing' ? 'animate-glow-border' : ''}
          ${status === 'review' ? 'border-green-500 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]' : ''}
          ${status === 'error' ? 'border-red-500 bg-red-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]' : ''}
        `}>
          
          {/* Inner clipper for scan animations ensures scan line stays inside rounded corners */}
          <div className="absolute inset-0 rounded-[10px] overflow-hidden">
              {/* Scan Line */}
              {(status === 'idle' || status === 'analyzing') && images.length < MAX_IMAGES && (
                <>
                  <div 
                    className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-300 to-transparent z-10"
                    style={{ 
                      animation: `scan-line ${status === 'analyzing' ? '0.6s' : '2.5s'} ease-in-out infinite`
                    }}
                  >
                    {/* Hot Core for extra glow */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-full bg-white blur-[2px] opacity-90"></div>
                  </div>
                </>
              )}
              
               {/* Subtle scanning gradient overlay for idle state */}
              {status === 'idle' && images.length < MAX_IMAGES && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20 animate-[scan-line_2.5s_linear_infinite]" />
              )}
          </div>

          {/* Max Limit Overlay */}
          {status === 'idle' && images.length === MAX_IMAGES && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-[10px] animate-in fade-in zoom-in duration-300">
                <div className="bg-green-500 text-white p-3 rounded-full mb-3 shadow-lg shadow-green-900/50">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-white font-bold text-lg drop-shadow-md">Limit Reached</h3>
                <p className="text-white/80 text-sm text-center px-6 mt-1 mb-4 drop-shadow-sm">
                    You have captured all 5 images.
                </p>
                <button 
                    onClick={handleFinish}
                    className="bg-white text-green-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                >
                    Finish <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
          )}

          {status === 'analyzing' && (
            <div className="flex flex-col items-center gap-2 z-20">
              <Loader2 className="animate-spin text-brand-400" size={32} />
              <span className="text-brand-400 font-semibold tracking-wide shadow-black drop-shadow-md">Processing...</span>
            </div>
          )}

          {status === 'review' && (
            <div className="absolute inset-0 z-10">
                 {/* Show the frozen frame inside the box explicitly if needed, but video is paused so it works naturally */}
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-green-500/90 backdrop-blur px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-2">
                        <Check size={16} /> Scan Captured
                    </div>
                 </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-2 animate-in shake duration-300 z-20">
               <div className="bg-red-500 rounded-full p-2">
                 <AlertTriangle className="text-white" size={32} />
              </div>
              <span className="text-red-400 font-bold text-center px-4 drop-shadow-md">{errorMessage}</span>
            </div>
          )}
          
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-lg z-10"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-lg z-10"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-lg z-10"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-lg z-10"></div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-900 p-6 z-20 border-t border-gray-800 pb-8">
        
        {/* Mode Switcher */}
        {status === 'idle' && (
            <div className="flex justify-center gap-8 pb-6 animate-in fade-in slide-in-from-bottom-2">
                <span className="text-white font-bold text-xs tracking-widest border-b-2 border-brand-500 pb-2 cursor-default">CARD</span>
                <button 
                  onClick={onSwitchMode} 
                  className="text-gray-500 font-medium text-xs tracking-widest hover:text-gray-300 pb-2 transition-colors"
                >
                  QR CODE
                </button>
            </div>
        )}

        {status === 'review' ? (
           <div className="flex flex-col gap-4 w-full animate-in slide-in-from-bottom-5">
             <div className="flex gap-4">
                <button 
                    onClick={resetToIdle}
                    className="flex-1 bg-gray-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-700 active:bg-gray-600 transition-all active:scale-95 shadow-lg"
                    style={{ minHeight: '60px' }}
                >
                    <RefreshCw size={20} /> 
                    <span>Retake</span>
                </button>
                {images.length < MAX_IMAGES ? (
                    <button 
                        onClick={handleSaveImage}
                        className="flex-[1.5] bg-brand-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-500 active:bg-brand-700 transition-all active:scale-95 shadow-xl shadow-brand-900/40"
                        style={{ minHeight: '60px' }}
                    >
                        <Plus size={24} strokeWidth={2.5} /> 
                        <span>Scan Next</span>
                    </button>
                ) : (
                    <div className="flex-1 bg-gray-800 text-gray-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-700" style={{ minHeight: '60px' }}>
                        Limit Reached
                    </div>
                )}
             </div>
             <button 
                onClick={handleFinish}
                className="w-full bg-white text-gray-900 font-extrabold text-lg py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-[0.98] transition-all shadow-2xl"
                style={{ minHeight: '70px' }}
            >
               Finish All ({images.length + 1}) <ArrowRight size={22} />
             </button>
           </div>
        ) : status === 'error' ? (
            <button 
              onClick={resetToIdle}
              className="w-full bg-white text-gray-900 font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg"
            >
              <RefreshCw size={24} /> Retake Photo
            </button>
        ) : (
          <div className="flex items-center justify-between px-4">
             {/* Left Placeholder or Gallery Button */}
             <div className="w-16 flex justify-center">
                 {images.length > 0 && (
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-lg border-2 border-white/50 overflow-hidden bg-gray-800">
                             <img src={images[images.length-1]} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-gray-900 font-bold">
                            {images.length}
                        </div>
                    </div>
                 )}
             </div>

             {/* Main Capture Button */}
             <div className="relative">
                 {images.length >= MAX_IMAGES ? (
                     <div className="flex flex-col items-center gap-1 animate-in zoom-in">
                        <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center opacity-50 cursor-not-allowed">
                            <Check className="text-gray-500" size={24} />
                        </div>
                        <span className="text-gray-500 text-xs font-medium">Max Limit</span>
                     </div>
                 ) : (
                    <button 
                        onClick={handleCapture}
                        disabled={status !== 'idle'}
                        className={`relative group rounded-full transition-all duration-300 
                        ${status !== 'idle' ? 'w-16 h-16 bg-gray-800' : 'w-20 h-20 bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]'}
                        `}
                        aria-label="Capture"
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-gray-300 opacity-30 scale-110"></div>
                        <ScanLine className="absolute inset-0 m-auto text-gray-900" size={32} />
                    </button>
                 )}
             </div>

             {/* Finish Button */}
             <div className="w-16 flex justify-center">
                {images.length > 0 && (
                    <button 
                        onClick={handleFinish}
                        className={`flex flex-col items-center text-white hover:text-brand-400 transition-all gap-1 group ${images.length === MAX_IMAGES ? 'animate-pulse scale-110 text-green-400' : ''}`}
                    >
                        <div className={`p-3 rounded-full transition-colors border ${images.length === MAX_IMAGES ? 'bg-green-900/50 border-green-500 group-hover:bg-green-900' : 'bg-gray-800 border-gray-700 group-hover:bg-gray-700'}`}>
                            <ArrowRight size={24} />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wide">Done</span>
                    </button>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;