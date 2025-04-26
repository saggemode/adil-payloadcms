/**
 * Utility for generating barcodes in batch for bulk product imports
 */

/**
 * Generates a UPC-A barcode with check digit
 * @returns Valid UPC-A barcode
 */
const generateUPCA = (): string => {
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
  return `${prefix}${randomDigits}${checkDigit}`;
};

/**
 * Generate unique barcodes for a batch of products
 * @param count Number of barcodes to generate
 * @param prefix Optional prefix for generated barcodes
 * @returns Array of unique barcodes
 */
export const generateBatchBarcodes = (count: number, options?: { 
  prefix?: string,
  type?: 'EAN-13' | 'UPC-A'
}): string[] => {
  const barcodes = new Set<string>();
  const { type = 'UPC-A' } = options || {};
  
  // Keep generating until we have the requested number of unique barcodes
  while (barcodes.size < count) {
    barcodes.add(generateUPCA());
  }
  
  return Array.from(barcodes);
};

/**
 * Check if barcode is valid based on check digit
 * @param barcode The barcode to validate
 * @returns True if valid, false otherwise
 */
export const isValidBarcode = (barcode: string): boolean => {
  // Remove any hyphens or spaces
  barcode = barcode.replace(/[-\s]/g, '');
  
  // Check format: 12 digits for UPC-A
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