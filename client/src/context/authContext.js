import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return null;

    // Check if token is expired
    if (new Date().getTime() > storedUser.expiration) {
      localStorage.removeItem("user");
      return null;
    }
    return storedUser;
  });

  // 🛡 Login method: Save full user info
  const login = (userInfo) => {
    const expirationTime = new Date().getTime() + 1000 * 60 * 60; // 1 hour expiration

    const userData = {
      token: userInfo.token,
      expiration: expirationTime,
      name: userInfo.name,
      username:userInfo.username,
      profilePic: userInfo.profilePic,
      email: userInfo.email,
      id:userInfo.id,
      coverPic:userInfo.coverPic,
      city:userInfo.city,
      website:userInfo.website
    };

    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // ⏳ Auto logout when token expires
  useEffect(() => {
    if (!currentUser) return;

    const remainingTime = currentUser.expiration - new Date().getTime();
    const timer = setTimeout(() => {
      logout();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${currentUser.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
