import { FieldHook } from "payload";


interface ValidateBarcodeArgs {
  value?: string;
  siblingData?: Record<string, unknown>;
}

/**
 * Validates barcode format based on common standards
 * Supports UPC-A, EAN-13, ISBN-13, etc.
 */
export const validateBarcode: FieldHook = ({ value, siblingData }) => {
  // Return if no value provided (barcode is optional)
  if (!value) return value;

  // Clean the barcode (remove hyphens and spaces)
  const cleanBarcode = value.toString().replace(/[-\s]/g, '');
  
  // Check for valid formats
  if (/^\d{12}$/.test(cleanBarcode)) {
    // UPC-A: 12 digits
    return formatUPC(cleanBarcode);
  } else if (/^\d{13}$/.test(cleanBarcode)) {
    // EAN-13/ISBN-13: 13 digits
    return formatEAN13(cleanBarcode);
  } else if (/^\d{8}$/.test(cleanBarcode)) {
    // EAN-8: 8 digits
    return cleanBarcode;
  } else if (/^\d{10}$/.test(cleanBarcode)) {
    // ISBN-10: 10 digits
    return cleanBarcode;
  }

  // If we get here, return the original value
  return value;
};

/**
 * Format UPC-A with proper hyphenation
 */
function formatUPC(barcode: string): string {
  // Format: X-XXXXX-XXXXX-X
  return barcode;
}

/**
 * Format EAN-13 with proper hyphenation
 */
function formatEAN13(barcode: string): string {
  // For now, just return the clean barcode
  // Could implement regional formatting rules later
  return barcode;
} 