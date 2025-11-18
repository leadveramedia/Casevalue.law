import { useState, useCallback } from 'react';

/**
 * Custom hook to manage form validation
 * Handles email/phone validation, real-time validation state, and contact form updates
 *
 * @param {Object} contact - Contact form state
 * @param {Function} setContact - Function to update contact state
 * @param {Function} setError - Function to set form error messages
 * @returns {Object} - Validation functions and state
 */
export function useFormValidation(contact, setContact, setError) {
  // State for real-time validation feedback
  const [validationState, setValidationState] = useState({
    email: null, // null = not touched, true = valid, false = invalid
    phone: null,
    firstName: null
  });

  // Email validation
  const validateEmail = useCallback((email) => {
    // Trim whitespace
    email = email.trim();

    // Basic format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return false;

    // Split into user and domain parts
    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const domain = parts[1];
    const domainParts = domain.split('.');

    // Realistic email domains have 2-3 parts (e.g., example.com, mail.example.com, mail.example.co.uk)
    // Reject domains with more than 3 parts to prevent invalid patterns like test.com.xyz.abc
    if (domainParts.length > 3) return false;

    // Last part (TLD) must be 2-6 letters only
    const tld = domainParts[domainParts.length - 1];
    if (!/^[a-zA-Z]{2,6}$/.test(tld)) return false;

    // Each domain part should be valid (letters, numbers, hyphens only)
    for (const part of domainParts) {
      if (!/^[a-zA-Z0-9-]+$/.test(part)) return false;
      // Domain parts can't start or end with hyphen
      if (part.startsWith('-') || part.endsWith('-')) return false;
    }

    return true;
  }, []);

  // Phone validation
  const validatePhone = useCallback((phone) => {
    // Strip all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    // Must be exactly 10 digits (US phone number format)
    return digitsOnly.length === 10;
  }, []);

  // Handle contact form field updates with real-time validation
  const handleUpdateContact = useCallback((field, value) => {
    setContact(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    if (field === 'email') {
      if (value === '') {
        setValidationState(prev => ({ ...prev, email: null }));
      } else {
        setValidationState(prev => ({ ...prev, email: validateEmail(value) }));
      }
      setError('');
    } else if (field === 'phone') {
      if (value === '') {
        setValidationState(prev => ({ ...prev, phone: null }));
      } else {
        setValidationState(prev => ({ ...prev, phone: validatePhone(value) }));
      }
      setError('');
    } else if (field === 'firstName') {
      if (value === '') {
        setValidationState(prev => ({ ...prev, firstName: null }));
      } else {
        setValidationState(prev => ({ ...prev, firstName: value.length >= 2 }));
      }
    }
  }, [validateEmail, validatePhone, setContact, setError]);

  return {
    validationState,
    validateEmail,
    validatePhone,
    handleUpdateContact
  };
}
