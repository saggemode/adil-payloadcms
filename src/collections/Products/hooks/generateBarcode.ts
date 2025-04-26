import { CollectionBeforeChangeHook } from "payload";

/**
 * Generates a UPC-A barcode for products that don't have one
 * Format: First digit is always 0, followed by 10 digits and a check digit
 */
export const generateBarcode: CollectionBeforeChangeHook = async ({ 
  data, 
  req,
  operation,
}) => {
  // Only generate barcode on create operation and if none exists
  if (operation === 'create' && !data.barcode) {
    // Generate a 12-digit UPC-A code
    const prefix = '0'; // Standard UPC-A prefix
    
    // Generate 10 random digits
    const randomDigits = Array.from(
      { length: 10 }, 
      () => Math.floor(Math.random() * 10)
    ).join('');
    
    // Calculate check digit (Modulo 10 algorithm)
    const digits = (prefix + randomDigits).split('').map(Number);
    const oddSum = digits.filter((_, i) => i % 2 === 0).reduce((sum, digit) => sum + digit, 0);
    const evenSum = digits.filter((_, i) => i % 2 === 1).reduce((sum, digit) => sum + digit, 0);
    const total = oddSum * 3 + evenSum;
    const checkDigit = (10 - (total % 10)) % 10;
    
    // Final barcode
    data.barcode = `${prefix}${randomDigits}${checkDigit}`;
    
    console.log(`Generated barcode ${data.barcode} for new product: ${data.title}`);
  }
  
  return data;
}; 