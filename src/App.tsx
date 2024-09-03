import "./App.css";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./auth/firebase/Auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./auth/Login";

interface CurrentUserContextType {
  user: User | null;
}

export const CurrentUserContext = createContext<CurrentUserContextType | null>(
  null,
);

function CurrentUserContextProviser({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={{ user: user }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

function UnauthenticatedOnly({ children }: { children: React.ReactNode }) {
  const currentUser = useContext(CurrentUserContext);

  const location = useLocation();

  if (currentUser?.user !== null) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}/</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useContext(CurrentUserContext);

  const location = useLocation();

  if (currentUser?.user == null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}/</>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <section>
          <CurrentUserContextProviser>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthenticatedRoute>
                    <Home />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <UnauthenticatedOnly>
                    <Login />
                  </UnauthenticatedOnly>
                }
              />
            </Routes>
          </CurrentUserContextProviser>
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
