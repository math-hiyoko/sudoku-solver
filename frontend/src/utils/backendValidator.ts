import { BackendErrorDetail } from '../types';

export const convertBackendErrorsToFrontend = (backendErrors: BackendErrorDetail[]): Set<string> => {
  const errorCells = new Set<string>();
  
  backendErrors.forEach(error => {
    // Convert backend format (0-indexed) to frontend format
    errorCells.add(`${error.row}-${error.column}`);
  });
  
  return errorCells;
};

export const formatBackendErrorMessage = (backendErrors: BackendErrorDetail[]): string => {
  const conflictGroups = groupConflictsByNumber(backendErrors);
  const groupCount = Object.keys(conflictGroups).length;
  
  if (groupCount === 1) {
    const number = Object.keys(conflictGroups)[0];
    const positions = conflictGroups[number];
    return `Number ${number} appears ${positions.length} times in conflicting positions.`;
  }
  
  return `Found ${backendErrors.length} constraint violations across ${groupCount} different numbers.`;
};

const groupConflictsByNumber = (errors: BackendErrorDetail[]): Record<string, BackendErrorDetail[]> => {
  return errors.reduce((groups, error) => {
    const key = error.number.toString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(error);
    return groups;
  }, {} as Record<string, BackendErrorDetail[]>);
};