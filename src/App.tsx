import "./App.css";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./auth/firebase/Auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home, { isRunningLocally } from "./Home";
import Login from "./auth/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, pink } from "@mui/material/colors";
import Components from "./components/Components";

const theme = createTheme({
  palette: {
    primary: {
      main: teal[400],
      light: teal[50],
    },
    secondary: {
      main: pink[500],
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-selected": {
            color: teal[400],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px",
          paddingTop: "0px",
          paddingBottom: "0px",
        },
      },
    },
  },
});

interface CurrentUserContextType {
  user: User | null;
}

export const CurrentUserContext = createContext<CurrentUserContextType | null>(
  null,
);

function CurrentUserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isRunningLocally()) {
        console.log(user); // Useful for debugging
      }
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
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useContext(CurrentUserContext);

  const location = useLocation();

  if (currentUser?.user == null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <section>
            <CurrentUserContextProvider>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <UnauthenticatedOnly>
                      <Login />
                    </UnauthenticatedOnly>
                  }
                />
                {isRunningLocally() && (
                  <Route path="/components/*" element={<Components />} />
                )}
                <Route
                  path="*"
                  element={
                    <AuthenticatedRoute>
                      <Home />
                    </AuthenticatedRoute>
                  }
                />
              </Routes>
            </CurrentUserContextProvider>
          </section>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
