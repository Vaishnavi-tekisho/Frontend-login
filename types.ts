// Company Research and Profile
export type ViewState = 'HOME' | 'CAPTURE_MENU' | 'CAMERA' | 'QR_SCANNER' | 'NFC_SCAN' | 'SEARCH' | 'EMAIL_SELECT' | 'MANUAL_ENTRY';

export interface ContactEmail {
  id: string;
  email_address: string;
  label: string;
  is_primary: boolean;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  contact_emails: ContactEmail[];
  scan_images_data: any[];
}

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export interface InsightPoint {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ResearchProfile {
  name: string;
  role?: string;
  industry?: string;
  summary: string;
  keyInsights: string[];
  metrics?: InsightPoint[];
  lastUpdated: string;
}

export interface ResearchData {
  id: string;
  professional: ResearchProfile;
  company: ResearchProfile;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// Settings

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User (Employee)'
}

export enum Tab {
  PROFILE = 'Profile',
  NOTIFICATIONS = 'Notifications',
  SECURITY = 'Security',
  PLANS_BILLING = 'Plans & Billing',
  ADMIN = 'Admin Control',
  REFERRAL = 'Referral',
  HELP = 'Help & Support',
  ABOUT = 'About'
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  tone: string;
}

export interface CompanyProfile {
  name: string;
  website: string;
  address: string;
  intro: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}