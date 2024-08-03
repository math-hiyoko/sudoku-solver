export const loadState = (
  key: string,
  defaultValue: (number | undefined)[],
): (number | undefined)[] => {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const serializedState: string | null = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    const parsedState = JSON.parse(serializedState) as (number | null)[];
    return parsedState.map((value) => (value === null ? undefined : value));
  } catch (error) {
    console.error("Error loading state from localStorage", error);
    return defaultValue;
  }
};

export const saveState = (key: string, state: (number | undefined)[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    const serializedState = JSON.stringify(
      state.map((value) => (value === undefined ? null : value)),
    );
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage", error);
  }
};
