/**
 * Utility functions for barcode validation and verification
 */

/**
 * Validate if barcode is a valid UPC-A format
 * @param barcode The barcode to validate
 * @returns True if valid UPC-A, false otherwise
 */
export const isValidUPCA = (barcode: string): boolean => {
  // Remove any hyphens or spaces
  barcode = barcode.replace(/[-\s]/g, '');
  
  // Check format: 12 digits
  if (!/^\d{12}$/.test(barcode)) {
    return false;
  }
  
  // Verify the check digit
  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop() as number;
  
  const oddSum = digits.filter((_, i) => i % 2 === 0).reduce((sum, digit) => sum + digit, 0);
  const evenSum = digits.filter((_, i) => i % 2 === 1).reduce((sum, digit) => sum + digit, 0);
  const total = oddSum * 3 + evenSum;
  const expectedCheckDigit = (10 - (total % 10)) % 10;
  
  return checkDigit === expectedCheckDigit;
};

/**
 * Validate if barcode is a valid EAN-13 format
 * @param barcode The barcode to validate
 * @returns True if valid EAN-13, false otherwise
 */
export const isValidEAN13 = (barcode: string): boolean => {
  // Remove any hyphens or spaces
  barcode = barcode.replace(/[-\s]/g, '');
  
  // Check format: 13 digits
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }
  
  // Verify the check digit
  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop() as number;
  
  const sum = digits.reduce((acc, digit, i) => 
    acc + digit * (i % 2 === 0 ? 1 : 3), 0);
  const expectedCheckDigit = (10 - (sum % 10)) % 10;
  
  return checkDigit === expectedCheckDigit;
};

/**
 * Format a barcode with the standard formatting for its type
 * @param barcode The raw barcode to format
 * @returns Formatted barcode string
 */
export const formatBarcode = (barcode: string): string => {
  // Remove any existing formatting
  const clean = barcode.replace(/[-\s]/g, '');
  
  // Format based on length
  if (clean.length === 12) {
    // UPC-A: Format as X-XXXXX-XXXXX-X
    return `${clean.slice(0, 1)}-${clean.slice(1, 6)}-${clean.slice(6, 11)}-${clean.slice(11)}`;
  } else if (clean.length === 13) {
    // EAN-13: Format as XXX-XXXX-XXXX-X
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 12)}-${clean.slice(12)}`;
  }
  
  // Return as-is if no formatting rule applies
  return barcode;
};

/**
 * Get information about a barcode
 * @param barcode The barcode to analyze
 * @returns Object with barcode info
 */
export const getBarcodeInfo = (barcode: string): {
  type: string;
  valid: boolean;
  formatted: string;
  country?: string;
} => {
  // Clean the barcode
  const clean = barcode.replace(/[-\s]/g, '');
  
  // Determine type and validity
  if (clean.length === 12) {
    const valid = isValidUPCA(clean);
    return {
      type: 'UPC-A',
      valid,
      formatted: valid ? formatBarcode(clean) : clean,
      country: 'US/Canada'
    };
  } else if (clean.length === 13) {
    const valid = isValidEAN13(clean);
    const prefix = clean.substring(0, 3);
    let country = 'Unknown';
    
    // Determine country code (simplified)
    if (prefix >= '000' && prefix <= '019') country = 'US/Canada';
    else if (prefix >= '300' && prefix <= '379') country = 'France';
    else if (prefix >= '400' && prefix <= '440') country = 'Germany';
    else if (prefix >= '450' && prefix <= '459') country = 'Japan';
    else if (prefix >= '460' && prefix <= '469') country = 'Russia';
    else if (prefix >= '471') country = 'Taiwan';
    else if (prefix >= '489') country = 'Hong Kong';
    else if (prefix >= '500' && prefix <= '509') country = 'UK';
    
    return {
      type: 'EAN-13',
      valid,
      formatted: valid ? formatBarcode(clean) : clean,
      country
    };
  }
  
  // Default for unknown barcode format
  return {
    type: 'Unknown',
    valid: false,
    formatted: clean
  };
}; 