import React, { useRef } from 'react';
import { Camera, Upload, Wifi, ChevronRight, Keyboard } from 'lucide-react';
import { ViewState } from '../../types';

interface CaptureMenuViewProps {
  setView: (view: ViewState) => void;
  onUploadSuccess: (files: File[], warning?: string) => void;
}

const CaptureMenuView: React.FC<CaptureMenuViewProps> = ({ setView, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    
    if (fileList && fileList.length > 0) {
      const files: File[] = Array.from(fileList);
      
      // Filter images
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
          console.warn('No valid images selected');
          return;
      }

      let warningMsg: string | undefined = undefined;
      // Check for limit
      if (imageFiles.length > 5) {
          warningMsg = "Limit reached (max 5). Processing first 5 images.";
      }

      // Limit to 5
      const selectedFiles = imageFiles.slice(0, 5);

      onUploadSuccess(selectedFiles, warningMsg);
      
      // Reset input so the same files can be selected again if needed
      event.target.value = '';
    }
  };

  const menuItems = [
    { 
      id: 'camera', 
      label: 'Camera Scan', 
      desc: 'Scan business card or QR code', 
      icon: Camera, 
      action: () => setView('CAMERA'),
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: 'upload', 
      label: 'Upload Images', 
      desc: 'Select up to 5 images from gallery', 
      icon: Upload, 
      action: () => fileInputRef.current?.click(),
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'manual',
      label: 'Manual Entry',
      desc: 'Type in contact details',
      icon: Keyboard,
      action: () => setView('MANUAL_ENTRY'),
      color: 'bg-pink-100 text-pink-600'
    },
    { 
      id: 'nfc', 
      label: 'NFC Tap', 
      desc: 'Tap compatible device or tag', 
      icon: Wifi, 
      action: () => setView('NFC_SCAN'),
      color: 'bg-orange-100 text-orange-600'
    },
  ];

  return (
    <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Choose Capture Method</h2>
        <p className="text-gray-500 text-sm">Select how you want to input the contact data.</p>
      </div>
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <div className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className={`p-3 rounded-lg ${item.color} mr-4`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">{item.label}</h3>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-brand-500" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CaptureMenuView;