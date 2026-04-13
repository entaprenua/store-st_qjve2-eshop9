export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  } else if (email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateProductName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  } else if (name.length > 255) {
    errors.push('Product name must be less than 255 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validatePrice(price: number | null | undefined): ValidationResult {
  const errors: string[] = [];
  
  if (price !== null && price !== undefined) {
    if (price < 0) {
      errors.push('Price cannot be negative');
    }
    if (!Number.isFinite(price)) {
      errors.push('Price must be a valid number');
    }
    if (price > 99999999.99) {
      errors.push('Price is too large');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateQuantity(quantity: number): ValidationResult {
  const errors: string[] = [];
  
  if (!Number.isInteger(quantity)) {
    errors.push('Quantity must be a whole number');
  }
  if (quantity < 0) {
    errors.push('Quantity cannot be negative');
  }
  if (quantity > 999999) {
    errors.push('Quantity is too large');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateStoreName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push('Store name is required');
  } else {
    if (name.length < 2) {
      errors.push('Store name must be at least 2 characters');
    }
    if (name.length > 100) {
      errors.push('Store name must be less than 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      errors.push('Store name can only contain letters, numbers, spaces, hyphens, and underscores');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateDomain(domain: string): ValidationResult {
  const errors: string[] = [];
  
  if (domain && domain.trim() !== '') {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      errors.push('Invalid domain format');
    }
    if (domain.length > 253) {
      errors.push('Domain is too long');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateSubdomain(subdomain: string): ValidationResult {
  const errors: string[] = [];
  
  if (subdomain && subdomain.trim() !== '') {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/.test(subdomain)) {
      errors.push('Invalid subdomain format');
    }
    if (subdomain.length > 63) {
      errors.push('Subdomain is too long');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateFileSize(file: File, maxSizeMB: number = 50): ValidationResult {
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  const errors: string[] = [];
  
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
  
  if (!isAllowed) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateImageFile(file: File): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const errors: string[] = [];
  
  const sizeResult = validateFileSize(file, 50);
  const typeResult = validateFileType(file, allowedTypes);
  
  errors.push(...sizeResult.errors, ...typeResult.errors);
  
  return { valid: errors.length === 0, errors };
}

export function validateVideoFile(file: File): ValidationResult {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const errors: string[] = [];
  
  const sizeResult = validateFileSize(file, 500);
  const typeResult = validateFileType(file, allowedTypes);
  
  errors.push(...sizeResult.errors, ...typeResult.errors);
  
  return { valid: errors.length === 0, errors };
}

export function validate<T>(
  value: T,
  validator: (v: T) => ValidationResult
): ValidationResult {
  return validator(value);
}

export function validateAll(validations: ValidationResult[]): ValidationResult {
  const allErrors = validations.flatMap(v => v.errors);
  return { valid: allErrors.length === 0, errors: allErrors };
}
