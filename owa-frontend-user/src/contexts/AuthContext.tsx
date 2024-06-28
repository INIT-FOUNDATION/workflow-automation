// AuthContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import * as AppPreferences from "../utility/AppPreferences";

interface AuthContextProps {
  isAuthenticated: boolean;
  userDetails: any;
  userToken: string;
  

  login: () => void;
  logout: () => void;
  addUserDetailsToContext: (userDetails: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
 
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userToken, setUserToken] = useState<any>(null);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserDetails(null);
    setUserToken(null);

    await AppPreferences.clearAll();
  };

  const addUserDetailsToContext = async (userDetails: any) => {
    setUserDetails(userDetails);
    await AppPreferences.setValue(
      "user_details",
      JSON.stringify(userDetails)
    );
  };

  useEffect(() => {
    (async () => {
      const storedToken = await AppPreferences.getValue("userToken");
      const storedUserDetails = await AppPreferences.getValue(
        "user_details"
      );

   
      setIsAuthenticated(() => {
        return storedToken ? true : false;
      });
      setUserToken(storedToken);
      setUserDetails(() => {
        return storedUserDetails ? JSON.parse(storedUserDetails) : null;
      });

     
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userDetails,
        userToken,
        login,
        logout,
        addUserDetailsToContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
