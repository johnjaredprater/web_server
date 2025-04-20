// DataStoreContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { WeekPlan } from "./types";

// Map of data keys to their types
interface DataMap {
  week_plan: WeekPlan | null;
  // Add more keys and their corresponding types here
}

// Define types for our data store
type DataStore = {
  [K in keyof DataMap]?: DataMap[K];
};

type LoadingStates = {
  [K in keyof DataMap]?: boolean;
};

type DataStoreContextType = {
  data: DataStore;
  isLoading: LoadingStates;
  fetchData: <K extends keyof DataMap>(
    key: K,
    fetchFn: () => Promise<DataMap[K]>,
  ) => Promise<DataMap[K]>;
};

// Create the context with an initial undefined value
const DataStoreContext = createContext<DataStoreContextType | undefined>(
  undefined,
);

interface DataStoreProviderProps {
  children: ReactNode;
}

export function DataStoreProvider({
  children,
}: DataStoreProviderProps): JSX.Element {
  // Our central data store state
  const [dataStore, setDataStore] = useState<DataStore>({});
  // Track loading states for different data keys
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  // Function to fetch and store data
  const fetchData = async <K extends keyof DataMap>(
    key: K,
    fetchFn: () => Promise<DataMap[K]>,
  ): Promise<DataMap[K]> => {
    // If we already have this data, don't fetch again
    if (dataStore[key]) return dataStore[key] as DataMap[K];

    // Set loading state for this key
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    try {
      // Fetch the data
      const result = await fetchFn();

      // Store the result
      setDataStore((prev) => ({
        ...prev,
        [key]: result,
      }));

      return result;
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
      throw error;
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Provide both the data and methods to access/modify it
  const value: DataStoreContextType = {
    data: dataStore,
    isLoading: loadingStates,
    fetchData,
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
}

// Custom hook for components to access the data store
export function useDataStore(): DataStoreContextType {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider");
  }
  return context;
}
