import { useState } from "react";

export const validators = {
  email: (value: string): string | null => {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[\W_]/.test(value)) return "Password must contain at least one special character.";
    return null;
  },

  fullName: (value: string): string | null => {
    if (!value.trim()) return "Full name is required.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return "Phone number is required.";
    if (!/^[0-9]{10}$/.test(value)) return "Please enter a valid 10-digit phone number.";
    return null;
  },

  confirmPassword: (value: string, password: string): string | null => {
    if (!value) return "Please confirm your password.";
    if (value !== password) return "Passwords do not match.";
    return null;
  },

  otp: (otp: string[]): string | null => {
    if (otp.some((v) => !v)) return "Please enter the complete 6-digit code.";
    return null;
  },
};

export function useFieldValidation<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const touch = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const validateField = (key: string, value: any, validator: (val: any) => string | null) => {
    const error = validator(value);
    setErrors((prev) => ({ ...prev, [key]: error }));
    return error;
  };

  const validateAll = (fields: { key: string; validator: (val: any) => string | null }[]): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;
    for (const { key, validator } of fields) {
      const error = validator(values[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    }
    setErrors(newErrors);
    setTouched(fields.reduce((acc, { key }) => ({ ...acc, [key]: true }), {}));
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  };

  return { values, touched, errors, setValue, touch, validateField, validateAll, reset, setValues, setErrors };
}
