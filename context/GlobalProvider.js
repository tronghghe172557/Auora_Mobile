import React, { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        // Get login status
        const isLoggedData = await AsyncStorage.getItem("@is_logged");

        // Get user data if logged in
        if (isLoggedData === "true") {
          const userData = await AsyncStorage.getItem("@user_data");
          if (userData) {
            setUser(JSON.parse(userData));
            setIsLogged(true);
          }
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
