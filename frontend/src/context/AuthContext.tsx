import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../lib/axios";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  university?: string;
  bio?: string;
  phoneNumber?: string;
  role: "USER" | "ADMIN" | "LANDLORD" | "ADVERTISER";
  isVerified?: boolean;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED" | "NONE";
  licenseNumber?: string;
  companyName?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  register: (
    email: string,
    password: string,
    fullName: string,
    role: "USER" | "LANDLORD" | "ADVERTISER",
    phoneNumber?: string,
    university?: string,
    bio?: string,
    preferences?: any,
    companyName?: string,
    licenseNumber?: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Fetch user profile to restore session
          const res = await axiosInstance.get("/users/me");
          setUser(res.data);

          // Restore user's language preference
          if (res.data.language && res.data.language !== i18n.language) {
            i18n.changeLanguage(res.data.language);
            document.dir = res.data.language === "ar" ? "rtl" : "ltr";
          }
        } catch (error: any) {
          console.error("Auth initialization failed:", error);
          // Only clear session if we're sure it's an authorization error
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [i18n]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);

    // Restore user's language preference on login
    if (newUser.language && newUser.language !== i18n.language) {
      i18n.changeLanguage(newUser.language);
      document.dir = newUser.language === "ar" ? "rtl" : "ltr";
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: "USER" | "LANDLORD" | "ADVERTISER",
    phoneNumber?: string,
    university?: string,
    bio?: string,
    preferences?: any,
    companyName?: string,
    licenseNumber?: string,
  ) => {
    try {
      console.log("🔐 Starting registration...", { email, fullName, role });

      const response = await axiosInstance.post("/auth/signup", {
        email,
        password,
        fullName,
        role,
        phoneNumber: phoneNumber || "",
        university: university || "",
        bio: bio || "",
        companyName: companyName || "",
        licenseNumber: licenseNumber || "",
        preferences: preferences || {},
      });

      console.log("✅ Registration successful", response.data);
      const { token: newToken, user: newUser } = response.data;
      login(newToken, newUser);
    } catch (error: any) {
      console.error("❌ Registration failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token, // Use token for internal check, UI should check user && !loading
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
