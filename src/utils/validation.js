
// src/utils/validation.js

// ============================================
// EMAIL VALIDATION RULES
// ============================================
export const validateEmail = (email) => {
  // Rule 1: Email is required
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  // Rule 2: Must contain exactly one @
  const atCount = (trimmedEmail.match(/@/g) || []).length;
  if (atCount === 0) {
    return { valid: false, error: 'Email must contain @ symbol' };
  }
  if (atCount > 1) {
    return { valid: false, error: 'Email can only contain one @ symbol' };
  }

  // Rule 3: Check for invalid characters
  const invalidCharsRegex = /[^a-zA-Z0-9@._-]/;
  if (invalidCharsRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Email contains invalid characters' };
  }

  // Rule 4: Email format validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Rule 5: Must have valid domain (check for common domains or at least proper structure)
  const parts = trimmedEmail.split('@');
  const domain = parts[1];
  
  if (!domain || domain.length < 3) {
    return { valid: false, error: 'Email must have a valid domain' };
  }

  // Rule 6: Domain must have at least one dot
  if (!domain.includes('.')) {
    return { valid: false, error: 'Email domain must include a valid extension (e.g., .com)' };
  }

  // Rule 7: Check if domain extension is valid (at least 2 characters after last dot)
  const domainParts = domain.split('.');
  const extension = domainParts[domainParts.length - 1];
  if (extension.length < 2) {
    return { valid: false, error: 'Email domain extension must be at least 2 characters' };
  }

  return { valid: true, error: '' };
};

// ============================================
// PASSWORD POLICY RULES
// ============================================
export const validatePassword = (password) => {
  // Rule 1: Password is required
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  // Rule 2: Must start with a capital letter
  if (!/^[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must start with a capital letter' };
  }

  // Rule 3: Minimum length (8 characters)
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  // Rule 4: Maximum length (optional but recommended)
  if (password.length > 64) {
    return { valid: false, error: 'Password must not exceed 64 characters' };
  }

  // Rule 5: Must include at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z)' };
  }

  // Rule 6: Must include at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z)' };
  }

  // Rule 7: Must include at least one digit
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit (0-9)' };
  }

  // Rule 8: Must include at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*...)' };
  }

  // Rule 9: Must include alphabets (both upper and lower)
  const hasAlphabets = /[a-zA-Z]/.test(password);
  if (!hasAlphabets) {
    return { valid: false, error: 'Password must contain alphabetic characters' };
  }

  // All rules passed - calculate strength
  return { 
    valid: true, 
    error: '', 
    strength: calculatePasswordStrength(password) 
  };
};

// Calculate password strength based on complexity
const calculatePasswordStrength = (password) => {
  let strength = 0;

  // Length scoring
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 20;
  if (password.length >= 16) strength += 10;

  // Character variety scoring
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) strength += 15;

  // Bonus for multiple digits
  const digitCount = (password.match(/[0-9]/g) || []).length;
  if (digitCount >= 2) strength += 5;

  // Bonus for multiple special chars
  const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/g) || []).length;
  if (specialCount >= 2) strength += 5;

  if (strength <= 40) return 'weak';
  if (strength <= 60) return 'medium';
  if (strength <= 80) return 'good';
  return 'strong';
};

// ============================================
// NAME VALIDATION RULES
// ============================================
export const validateName = (name) => {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 50) {
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  // Only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  // Check for consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return { valid: false, error: 'Name cannot contain consecutive spaces' };
  }

  return { valid: true, error: '' };
};

// ============================================
// ORGANIZATION CODE VALIDATION RULES
// ============================================
export const validateOrgCode = (code) => {
  if (!code) {
    return { valid: false, error: 'Organization code is required' };
  }

  // Alphanumeric only, 3-20 characters, uppercase
  if (code.length < 3) {
    return { valid: false, error: 'Organization code must be at least 3 characters' };
  }

  if (code.length > 20) {
    return { valid: false, error: 'Organization code must not exceed 20 characters' };
  }

  const orgCodeRegex = /^[A-Z0-9]+$/;
  if (!orgCodeRegex.test(code)) {
    return { valid: false, error: 'Organization code must contain only uppercase letters and numbers' };
  }

  return { valid: true, error: '' };
};

// ============================================
// PASSWORD MATCH VALIDATION
// ============================================
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  return { valid: true, error: '' };
};

// ============================================
// PHONE NUMBER VALIDATION (Optional - for OTP)
// ============================================
export const validatePhone = (phone, countryCode = '+1') => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Check length based on country (US: 10 digits, India: 10 digits)
  const minLength = 10;
  const maxLength = 15;

  if (cleanPhone.length < minLength) {
    return { valid: false, error: `Phone number must be at least ${minLength} digits` };
  }

  if (cleanPhone.length > maxLength) {
    return { valid: false, error: `Phone number must not exceed ${maxLength} digits` };
  }

  return { valid: true, error: '' };
};

// ============================================
// OTP VALIDATION
// ============================================
export const validateOTP = (otp) => {
  if (!otp) {
    return { valid: false, error: 'OTP is required' };
  }

  // Must be exactly 6 digits
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return { valid: false, error: 'OTP must be exactly 6 digits' };
  }

  return { valid: true, error: '' };
};