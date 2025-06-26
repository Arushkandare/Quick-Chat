import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if(data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log("Auth 1");
            toast.error(error.message);
        }
    } 

    const connectSocket = (userData) => {
        console.log("connectSocket called with:", userData);
        if (!userData || socket?.connected) {
          console.log("Skipping socket connection");
          return;
        }
        console.log("Connecting to socket with backend URL:", backendUrl);
        const newSocket = io("http://localhost:3001", {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    } 

    const login = async (state, credentials) => {
      try {
        console.log("Calling:", `/api/auth/${state}`);
        console.log("With credentials:", credentials);

        const { data } = await axios.post(`/api/auth/${state}`, credentials);
        console.log("Response:", data);

        if(data.success) {
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            localStorage.setItem("token", data.token);
            toast.success(data.message);
        } else {
            console.log("Login failed:", data);
            toast.error(data.message);
        }
      } catch (error) {
        console.log("Login error:", error.message);
        toast.error(error.message);
      }
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        socket.disconnect();
    }

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if(data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if(token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, []);

    const value = {
      axios, 
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };