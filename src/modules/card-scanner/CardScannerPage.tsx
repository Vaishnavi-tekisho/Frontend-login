import React, { useState } from 'react';

import { ViewState, Contact, ToastData } from '../../../types';
import Header from './components/Header';
import HomeView from './components/views/HomeView';
import CaptureMenuView from './components/views/CaptureMenuView';
import CameraView from './components/views/CameraView';
import QrScannerView from './components/views/QrScannerView';
import NfcScanView from './components/views/NfcScanView';
import SearchView from './components/views/SearchView';
import EmailSelectView from './components/views/EmailSelectView';
import ManualEntryView from './components/views/ManualEntryView';
import Toast from './components/Toast';
import Navbar from '../dashboard/components/Navbar';

function CardScannerPage() {
  const [currentView, setView] = useState<ViewState>('HOME');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [toast, setToast] = useState<ToastData>({ message: '', type: 'info', visible: false });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
  };

  const handleBack = () => {
    if (currentView === 'CAMERA') setView('CAPTURE_MENU');
    else if (currentView === 'QR_SCANNER') setView('CAPTURE_MENU');
    else if (currentView === 'NFC_SCAN') setView('CAPTURE_MENU');
    else if (currentView === 'MANUAL_ENTRY') setView('CAPTURE_MENU');
    else if (currentView === 'CAPTURE_MENU') setView('HOME');
    else if (currentView === 'SEARCH') setView('HOME');
    else if (currentView === 'EMAIL_SELECT') setView('SEARCH');
    else setView('HOME');
  };

  const handleContactSelect = (contact: Contact) => {
    if (contact.contact_emails.length > 1) {
      setSelectedContact(contact);
      setView('EMAIL_SELECT');
    } else {
      setSelectedContact(contact);
      // Scenario 2: Single email, auto-select
      const email = contact.contact_emails[0]?.email_address || 'No email';
      showToast(`Opening Contact: ${contact.first_name}... (${email})`, 'success');
      // Logic to proceed would go here
    }
  };

  const handleEmailConfirmed = (emailId: string) => {
    if (selectedContact) {
      const email = selectedContact.contact_emails.find(e => e.id === emailId);
      setView('SEARCH'); // Or wherever it should go next
      showToast(`Selected: ${email?.email_address}`, 'success');
    }
  };

  const handleCameraSuccess = (images: string[]) => {
    if (images.length === 0) {
        showToast('No images captured.', 'info');
        return;
    }
    showToast(`Captured ${images.length} image${images.length > 1 ? 's' : ''} successfully!`, 'success');
    console.log("Captured count:", images.length);
    // Navigate back after a brief delay so the user sees the success toast on the new screen
    setTimeout(() => {
      setView('HOME');
    }, 500);
  };

  const handleQrSuccess = (data: string) => {
    showToast('QR Code detected!', 'success');
    console.log("QR Data:", data);
    // Simulate processing
    setTimeout(() => {
        setView('HOME');
    }, 1000);
  };

  const handleNfcSuccess = (data: string) => {
    showToast('NFC Tag Read Successfully!', 'success');
    console.log("NFC Payload:", data);
    // Simulate processing
    setTimeout(() => {
        setView('HOME');
    }, 1000);
  };

  const handleUploadSuccess = (files: File[], warning?: string) => {
    if (files.length === 0) return;

    // Construct message: Warning first if exists, then processing status
    const message = warning 
        ? `${warning}` 
        : `Processing ${files.length} image${files.length > 1 ? 's' : ''}...`;

    // Use 'info' for normal, maybe 'error' or 'info' for warning depending on preference. Using 'info' for consistency.
    showToast(message, warning ? 'info' : 'info');

    // Create a promise for each file to simulate reading/uploading
    const readers = files.map(file => {
        return new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                console.log(`Processed ${file.name} (Size: ${Math.round(file.size / 1024)}KB)`);
                resolve();
            };
            // In a real CardScannerPage we might handle errors here
            reader.readAsDataURL(file);
        });
    });

    Promise.all(readers).then(() => {
        // If there was a warning, we might want to delay the success message slightly or just show it.
        // For now, standard behavior.
        setTimeout(() => {
             showToast(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''} successfully!`, 'success');
             
             // Simulate processing delay and navigation similar to camera success
             setTimeout(() => {
                 setView('HOME');
             }, 500);
        }, 1500); // slightly longer delay if there was a warning so user can read it? keeping standard flow.
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleManualEntrySuccess = (data: any) => {
    showToast(`Saved contact: ${data.firstName} ${data.lastName}`, 'success');
    console.log("Manual Data:", data);
    setTimeout(() => {
      setView('HOME');
    }, 500);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 font-sans">
        {/* Main Responsive Card Container */}
        <div className="w-full h-screen md:h-[800px] md:max-w-4xl bg-white md:rounded-2xl md:shadow-2xl overflow-hidden relative flex flex-col transition-all">
          
          {/* Header */}
          <Header 
            currentView={currentView} 
            onBack={handleBack} 
            title={
              currentView === 'HOME' ? 'LeadQ.AI' :
              currentView === 'SEARCH' ? 'Search Database' :
              currentView === 'CAPTURE_MENU' ? 'New Contact' :
              currentView === 'QR_SCANNER' ? 'Scan QR Code' :
              currentView === 'NFC_SCAN' ? 'NFC Scan' :
              currentView === 'MANUAL_ENTRY' ? 'Enter Details' :
              'Capture'
            }
          />

          {/* View Routing */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            
            {currentView === 'HOME' && (
              <HomeView setView={setView} />
            )}

            {currentView === 'CAPTURE_MENU' && (
              <CaptureMenuView setView={setView} onUploadSuccess={handleUploadSuccess} />
            )}

            {currentView === 'CAMERA' && (
              <CameraView 
                onSuccess={handleCameraSuccess} 
                onSwitchMode={() => setView('QR_SCANNER')} 
              />
            )}

            {currentView === 'QR_SCANNER' && (
              <QrScannerView 
                onSuccess={handleQrSuccess} 
                onSwitchMode={() => setView('CAMERA')}
              />
            )}

            {currentView === 'NFC_SCAN' && (
              <NfcScanView 
                  onSuccess={handleNfcSuccess}
                  onCancel={() => setView('CAPTURE_MENU')}
              />
            )}

            {currentView === 'MANUAL_ENTRY' && (
              <ManualEntryView 
                onSave={handleManualEntrySuccess} 
                onCancel={() => setView('CAPTURE_MENU')} 
              />
            )}

            {(currentView === 'SEARCH' || currentView === 'EMAIL_SELECT') && (
              <SearchView onContactSelect={handleContactSelect} />
            )}

            {/* Modal Overlay for Email Selection */}
            {currentView === 'EMAIL_SELECT' && (
              <EmailSelectView 
                  contact={selectedContact} 
                  onSelect={handleEmailConfirmed}
                  onCancel={() => setView('SEARCH')}
              />
            )}

          </main>

          {/* Global Toast */}
          <Toast 
            data={toast} 
            onClose={() => setToast({ ...toast, visible: false })} 
          />

        </div>
      </div>
    </div>
  );
}

export default CardScannerPage;