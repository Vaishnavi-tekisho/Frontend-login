import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastData } from '../types';

interface ToastProps {
  data: ToastData;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data.visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data.visible, onClose]);

  if (!data.visible) return null;

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    info: <Info size={20} className="text-blue-600" />
  };

  return (
    <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColors[data.type]} z-50 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      {icons[data.type]}
      <span className="font-medium text-sm">{data.message}</span>
    </div>
  );
};

export default Toast;