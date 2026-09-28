import {
    createContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(() =>
        Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                const response = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const currentUser = response.data?.user;

                if (currentUser) {
                    setUser(currentUser);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(currentUser)
                    );
                }
            } catch (error) {
                console.error(
                    "Authentication Error:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated: Boolean(user),
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;