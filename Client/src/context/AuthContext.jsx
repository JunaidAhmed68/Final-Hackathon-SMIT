import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true); // loading flag
  const [relod,setRelod]= useState(true);

  const token = Cookies.get("token");

useEffect(() => {
  const fetchUser = async () => {
    try {
      if (token) {
        const response = await axios.get("localhost:3000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } else {
        setUser(null); // token not present
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      Cookies.remove("token");
      setUser(null);
    } finally {
      setLoading(false); // ✅ Move this here
    }
  };

  fetchUser();
}, [relod]);

  



 const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout , loading ,relod, setRelod}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
