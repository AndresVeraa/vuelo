import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      setUser(currentUser);

      if (currentUser) {

        try {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            setUserData(snap.data());
          } else {
            setUserData(null);
          }

        } catch (error) {
          console.log("Error loading userData:", error);
          setUserData(null);
        }

      } else {
        setUserData(null);
      }

      setAuthReady(true);
      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    setUser(null);
    setUserData(null);
    await signOut(auth);
    setIsLoggingOut(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      authReady,
      logout,
      isLoggingOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);