import React, { useState } from 'react';
import { User, Building2, Mail, Phone, Briefcase, Save, AlertCircle } from 'lucide-react';

interface ManualEntryViewProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ManualEntryView: React.FC<ManualEntryViewProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    company: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<{ 
    fullName?: string; 
    title?: string; 
    company?: string; 
    email?: string; 
    phone?: string 
  }>({});
  
  const [touched, setTouched] = useState<{ 
    fullName: boolean; 
    title: boolean; 
    company: boolean; 
    email: boolean; 
    phone: boolean 
  }>({ 
    fullName: false, 
    title: false, 
    company: false, 
    email: false, 
    phone: false 
  });

  const validateName = (name: string) => {
    if (!name.trim()) return 'Full name is required';
    return undefined;
  };

  const validateTitle = (title: string) => {
    if (!title.trim()) return 'Job title is required';
    return undefined;
  };

  const validateCompany = (company: string) => {
    if (!company.trim()) return 'Company is required';
    return undefined;
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? undefined : 'Please enter a valid email address';
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return 'Phone number is required';
    // Allow digits, spaces, dots, dashes, parentheses, plus
    const isValidChars = /^[\d\s().+-]+$/.test(phone);
    const digitCount = phone.replace(/\D/g, '').length;
    
    if (!isValidChars) return 'Contains invalid characters';
    if (digitCount < 7) return 'Phone number seems too short'; 
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Immediate validation if already touched
    if (name === 'fullName' && touched.fullName) {
       setErrors(prev => ({ ...prev, fullName: validateName(value) }));
    }
    if (name === 'title' && touched.title) {
        setErrors(prev => ({ ...prev, title: validateTitle(value) }));
    }
    if (name === 'company' && touched.company) {
        setErrors(prev => ({ ...prev, company: validateCompany(value) }));
    }
    if (name === 'email' && touched.email) {
       setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === 'phone' && touched.phone) {
       setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in touched) {
        setTouched(prev => ({ ...prev, [name]: true }));
        
        if (name === 'fullName') setErrors(prev => ({ ...prev, fullName: validateName(value) }));
        if (name === 'title') setErrors(prev => ({ ...prev, title: validateTitle(value) }));
        if (name === 'company') setErrors(prev => ({ ...prev, company: validateCompany(value) }));
        if (name === 'email') setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        if (name === 'phone') setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const nameError = validateName(formData.fullName);
    const titleError = validateTitle(formData.title);
    const companyError = validateCompany(formData.company);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);

    setErrors({ 
        fullName: nameError, 
        title: titleError, 
        company: companyError, 
        email: emailError, 
        phone: phoneError 
    });
    
    setTouched({ 
        fullName: true, 
        title: true, 
        company: true, 
        email: true, 
        phone: true 
    });

    if (!nameError && !titleError && !companyError && !emailError && !phoneError) {
      // Split full name into first and last name for compatibility
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      onSave({ 
        ...formData, 
        firstName, 
        lastName 
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="flex-1 p-6 max-w-2xl mx-auto w-full">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide text-[11px]">
              <User size={14} className="text-brand-500" /> Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Doe"
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                    errors.fullName 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 pr-10' 
                    : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500'
                }`}
              />
               {errors.fullName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                      <AlertCircle size={18} />
                  </div>
              )}
            </div>
             {errors.fullName && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.fullName}</p>}
          </div>

          {/* Job Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide text-[11px]">
              <Briefcase size={14} className="text-brand-500" /> Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior Marketing Manager"
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                    errors.title 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 pr-10' 
                    : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500'
                  }`}
                />
                {errors.title && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {errors.title && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.title}</p>}
          </div>

          {/* Company Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide text-[11px]">
              <Building2 size={14} className="text-brand-500" /> Company <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input 
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Acme Corp"
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                    errors.company
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 pr-10' 
                    : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500'
                  }`}
                />
                {errors.company && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {errors.company && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.company}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide text-[11px]">
              <Mail size={14} className="text-brand-500" /> Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input 
                name="email"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane@example.com"
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                    errors.email 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 pr-10' 
                    : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500'
                }`}
                />
                {errors.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wide text-[11px]">
              <Phone size={14} className="text-brand-500" /> Phone Number <span className="text-red-500">*</span>
            </label>
             <div className="relative">
                <input 
                name="phone"
                required
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                    errors.phone 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400 pr-10' 
                    : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500'
                }`}
                />
                {errors.phone && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
                        <AlertCircle size={18} />
                    </div>
                )}
            </div>
            {errors.phone && <p className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 py-4 px-6 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Contact
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntryView;