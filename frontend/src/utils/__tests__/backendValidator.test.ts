import { convertBackendErrorsToFrontend, formatBackendErrorMessage } from '../backendValidator';
import { BackendErrorDetail } from '../../types';

describe('backendValidator', () => {
  describe('convertBackendErrorsToFrontend', () => {
    test('converts backend error details to frontend cell keys', () => {
      const backendErrors: BackendErrorDetail[] = [
        { row: 8, column: 7, number: 1 },
        { row: 8, column: 8, number: 1 }
      ];
      
      const result = convertBackendErrorsToFrontend(backendErrors);
      
      expect(result.size).toBe(2);
      expect(result.has('8-7')).toBe(true);
      expect(result.has('8-8')).toBe(true);
    });

    test('handles empty error array', () => {
      const result = convertBackendErrorsToFrontend([]);
      expect(result.size).toBe(0);
    });

    test('handles duplicate positions', () => {
      const backendErrors: BackendErrorDetail[] = [
        { row: 0, column: 0, number: 5 },
        { row: 0, column: 0, number: 5 } // Same position
      ];
      
      const result = convertBackendErrorsToFrontend(backendErrors);
      
      // Set should deduplicate the same position
      expect(result.size).toBe(1);
      expect(result.has('0-0')).toBe(true);
    });
  });

  describe('formatBackendErrorMessage', () => {
    test('formats single number conflict correctly', () => {
      const backendErrors: BackendErrorDetail[] = [
        { row: 8, column: 7, number: 1 },
        { row: 8, column: 8, number: 1 }
      ];
      
      const result = formatBackendErrorMessage(backendErrors);
      
      expect(result).toBe('Number 1 appears 2 times in conflicting positions.');
    });

    test('formats multiple number conflicts correctly', () => {
      const backendErrors: BackendErrorDetail[] = [
        { row: 0, column: 0, number: 1 },
        { row: 0, column: 1, number: 1 },
        { row: 1, column: 0, number: 2 },
        { row: 1, column: 1, number: 2 },
        { row: 2, column: 0, number: 3 }
      ];
      
      const result = formatBackendErrorMessage(backendErrors);
      
      expect(result).toBe('Found 5 constraint violations across 3 different numbers.');
    });

    test('handles single error correctly', () => {
      const backendErrors: BackendErrorDetail[] = [
        { row: 0, column: 0, number: 5 }
      ];
      
      const result = formatBackendErrorMessage(backendErrors);
      
      expect(result).toBe('Number 5 appears 1 times in conflicting positions.');
    });

    test('handles empty error array', () => {
      const result = formatBackendErrorMessage([]);
      
      expect(result).toBe('Found 0 constraint violations across 0 different numbers.');
    });
  });
});