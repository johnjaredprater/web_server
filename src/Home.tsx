import { useContext, useEffect, useState } from "react";
import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";
import { CurrentUserContext } from "./App";
import { Avatar, Box, SvgIcon, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Tooltip } from "react-tooltip";
import ExerciseResultInput from "./ExerciseResultsInput";
import React from "react";
import ExerciseResultTable from "./ExerciseResultTable";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useTheme } from "@mui/material/styles";
import ExercisesBoard from "./ExercisesBoard";
import About from "./About";
import WeekPlanBoard from "./WeekPlanBoard";
import { DataStoreProvider } from "./DataStoreContext";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import UserProfileForm from "./UserProfileForm";

export function isRunningLocally() {
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export let baseUrl = "https://gym.johnprater.me";
if (isRunningLocally()) {
  baseUrl = "http://localhost:8000";
}

export interface Exercise {
  id: number;
  name: string;
  video_link?: string;
}

export interface ExerciseResult {
  id: string;
  exercise_id: number;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  rpe?: number;
  date: string;
}

function Home() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageWidth = windowWidth >= 660 ? 600 : windowWidth - 60;

  const userContext = useContext(CurrentUserContext);

  const [exerciseResultsModified, incrementExerciseResultsModified] =
    useState(0);

  return (
    <>
      <header className="App-header">
        <Grid container sx={{ width: "100%", maxWidth: pageWidth }}>
          <Grid size={7}>
            <Typography
              variant="h4"
              marginTop={2}
              align="left"
              data-tooltip-content={`version: ${process.env.REACT_APP_VERSION}`}
              data-tooltip-id="version-tooltip"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            >
              <SvgIcon
                fontSize="large"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              >
                <FitnessCenterIcon />
              </SvgIcon>
              GymTrack
            </Typography>
            <Typography variant="subtitle2">
              <Tooltip
                id="version-tooltip"
                style={{ display: "inline-block", zIndex: 1 }}
                place="left"
              />
            </Typography>
          </Grid>
          <Grid size={5}>
            <Box
              display="flex"
              alignItems="right"
              justifyContent="flex-end"
              gap={1}
            >
              <Typography variant="subtitle1" marginTop={3} align="right">
                {userContext?.user?.displayName && (
                  <Avatar
                    alt={userContext.user.displayName}
                    src={
                      userContext.user.photoURL
                        ? userContext.user.photoURL
                        : undefined
                    }
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: theme.palette.primary.main,
                      color: "#001c56",
                    }}
                    style={{ cursor: "pointer" }}
                    data-tooltip-content={"Edit Profile"}
                    data-tooltip-id="user-tooltip"
                    onClick={() => {
                      navigate("/user-profile");
                    }}
                  />
                )}
                <Tooltip
                  id="user-tooltip"
                  style={{ display: "inline-block", zIndex: 1 }}
                  place="bottom"
                />
              </Typography>
              <Typography variant="subtitle1" marginTop={3} align="right">
                <button
                  className="gsi-material-button"
                  style={{
                    marginLeft: 8,
                    height: 28,
                    fontSize: 16,
                    verticalAlign: "top",
                    padding: 8,
                  }}
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <span className="gsi-material-button-contents">
                      Sign out
                    </span>
                  </div>
                </button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{ width: "100%", justifyContent: "center" }}
          marginBottom={1}
        >
          <Tabs
            value={currentPath}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              maxWidth: pageWidth,
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              component={Link}
              label="Results"
              to="/results"
              value="/results"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="Personal Bests"
              to="/personal-bests"
              value="/personal-bests"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="Workout Plan"
              to="/workout-plan"
              value="/workout-plan"
              icon={<AutoAwesomeIcon />}
              iconPosition="start"
              sx={{ fontSize: "large", paddingVertical: 1, minHeight: 0 }}
            />
            <Tab
              component={Link}
              label="Profile"
              to="/user-profile"
              value="/user-profile"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="About"
              to="/about"
              value="/about"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
          </Tabs>
        </Grid>
      </header>

      <DataStoreProvider>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to="/results" replace />} />
            <Route
              path="/results"
              element={
                <div>
                  <Grid
                    container
                    sx={{ width: "100%", justifyContent: "center" }}
                    marginBottom={2}
                  >
                    <ExerciseResultInput
                      maxWidth={pageWidth}
                      exerciseResultsModified={exerciseResultsModified}
                      incrementExerciseResultsModified={
                        incrementExerciseResultsModified
                      }
                    ></ExerciseResultInput>
                  </Grid>
                  <Box
                    sx={{
                      minWidth: pageWidth,
                      maxWidth: pageWidth,
                      width: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <ExerciseResultTable
                      exerciseResultsModified={exerciseResultsModified}
                      incrementExerciseResultsModified={
                        incrementExerciseResultsModified
                      }
                    />
                  </Box>
                </div>
              }
            />
            <Route
              path="/personal-bests"
              element={
                <div>
                  <ExercisesBoard
                    maxWidth={pageWidth}
                    exerciseResultsModified={exerciseResultsModified}
                    incrementExerciseResultsModified={
                      incrementExerciseResultsModified
                    }
                  />
                </div>
              }
            />
            <Route
              path="/workout-plan"
              element={<WeekPlanBoard maxWidth={pageWidth} />}
            />
            <Route
              path="/about"
              element={
                <Grid container sx={{ width: "100%", maxWidth: pageWidth }}>
                  <About />
                </Grid>
              }
            />
            <Route
              path="/user-profile"
              element={<UserProfileForm maxWidth={pageWidth} />}
            />
          </Routes>
        </main>
      </DataStoreProvider>
    </>
  );
}

export default Home;
