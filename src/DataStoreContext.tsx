// DataStoreContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, UserProfileFormData, WeekPlan } from "./types";

interface DataMap {
  week_plan?: WeekPlan | null;
  user_profile?: UserProfile | null;
  user_profile_form_data: UserProfileFormData;
}

// Define types for our data store
type DataStore = {
  [K in keyof DataMap]: DataMap[K];
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
  // New method specifically for updating existing data
  updateData: <K extends keyof DataMap>(key: K, newData: DataMap[K]) => void;
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
  const [dataStore, setDataStore] = useState<DataStore>({
    user_profile_form_data: {
      gender: "male",
      fitness_level: "beginner",
      number_of_days: "1",
    },
  });
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

  // New method for direct updates to the data store
  const updateData = <K extends keyof DataMap>(
    key: K,
    newData: DataMap[K],
  ): void => {
    setDataStore((prev) => ({
      ...prev,
      [key]: newData,
    }));
  };

  // Provide both the data and methods to access/modify it
  const value: DataStoreContextType = {
    data: dataStore,
    isLoading: loadingStates,
    fetchData,
    updateData,
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
