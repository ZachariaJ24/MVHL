import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@shared/schema";

interface DraftStatus {
  isActive: boolean;
  currentPick: number;
  round: number;
}

interface AuthContextType {
  user: User | null;
  login: (role: "player" | "management" | "admin") => void;
  logout: () => void;
  isLoading: boolean;
  draftStatus: DraftStatus;
  setDraftStatus: (status: Partial<DraftStatus>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draftStatus, setDraftStatusState] = useState<DraftStatus>({
    isActive: false,
    currentPick: 1,
    round: 1,
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("mvhl_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (role: "player" | "management" | "admin") => {
    // Use existing database users
    let mockUser: User;
    
    if (role === "admin") {
      mockUser = {
        id: "admin-001",
        email: "admin@mvhl.com",
        username: "League Administrator",
        role: "admin",
        teamId: null,
        playerId: null,
        createdAt: new Date(),
      };
    } else if (role === "management") {
      mockUser = {
        id: "mgmt-001",
        email: "gm@mvhl.com",
        username: "General Manager",
        role: "management",
        teamId: "4dc29267-2c12-4b20-b380-4c5c1a65c5f0", // New York Rangers
        playerId: null,
        createdAt: new Date(),
      };
    } else {
      mockUser = {
        id: "a2a3d8fd-b7ee-4b51-ad3c-8690a45dc090", // Use existing player ID
        email: "player@mvhl.com",
        username: "Connor McDavid",
        role: "player",
        teamId: "4dc29267-2c12-4b20-b380-4c5c1a65c5f0",
        playerId: "a2a3d8fd-b7ee-4b51-ad3c-8690a45dc090",
        createdAt: new Date(),
      };
    }
    
    setUser(mockUser);
    localStorage.setItem("mvhl_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mvhl_user");
  };

  const setDraftStatus = (status: Partial<DraftStatus>) => {
    setDraftStatusState(prev => ({ ...prev, ...status }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, draftStatus, setDraftStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}