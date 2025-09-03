"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";

const COOKIE_OPTIONS = {
  expires: 7,
  path: "/",
  secure: false,
  sameSite: "lax" as const,
};

const setAuthData = (user: User, token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);
  }

  Cookies.set("authToken", token, COOKIE_OPTIONS);
  Cookies.set("user", JSON.stringify(user), COOKIE_OPTIONS);
  Cookies.set("userRole", user.role, COOKIE_OPTIONS);
  Cookies.set("userId", user.id, COOKIE_OPTIONS);
};

const getAuthData = () => {
  if (typeof window === "undefined") return { token: null, user: null };

  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      clearAuthData();
      return { token: null, user: null };
    }
  }

  return { token, user };
};

const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  }

  Cookies.remove("authToken", { path: "/" });
  Cookies.remove("user", { path: "/" });
  Cookies.remove("userRole", { path: "/" });
  Cookies.remove("userId", { path: "/" });
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: "participant" | "organizer" | "judge";
  avatar?: string;
  bio?: string;
  skills?: string[];
  university?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" }
  | { type: "INIT_COMPLETE" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        loading: false,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "INIT_COMPLETE":
      return { ...state, loading: false };
    default:
      return state;
  }
};

interface LoginResponse {
  data?: {
    safeUser?: {
      userid?: number;
      id?: string;
      email?: string;
      name?: string;
      username?: string;
      role?: User["role"];
      avatar?: string;
      bio?: string;
      skills?: string[];
      university?: string;
    };
    accessToken?: string;
  };
  accessToken?: string;
  token?: string;
  [key: string]: unknown;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: User["role"],
    authProvider?: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const { token, user } = getAuthData();

    if (token && user && user.id && user.role) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } else {
      dispatch({ type: "LOGOUT" });
    }

    dispatch({ type: "INIT_COMPLETE" });
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authAPI.login(email, password) as LoginResponse;

      const safeUser = response.data?.safeUser || response.data;
      const token =
        response.data?.accessToken || response.accessToken || response.token;

      // Extract user data with proper null checks
      const userData = (safeUser || {}) as Record<string, unknown>;

      const user: User = {
        id: (userData.userid as number)?.toString() || (userData.id as string)?.toString() || "1",
        email: (userData.email as string) || email,
        name: (userData.name as string) || (userData.username as string) || email.split("@")[0],
        role: (userData.role as User["role"]) || "participant",
        avatar:
          (userData.avatar as string) ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: (userData.bio as string) || "",
        skills: (userData.skills as string[]) || [],
        university: (userData.university as string) || "",
      };

      if (token) {
        setAuthData(user, token);
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: User["role"],
    authProvider: string = "email"
  ) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await authAPI.signup(email, password, name, role, authProvider);
      dispatch({ type: "CLEAR_ERROR" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = (data: Partial<User>) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
