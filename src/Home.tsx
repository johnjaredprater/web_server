import { useContext, useEffect, useState } from "react";
import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";
import { CurrentUserContext } from "./App";
import {
  Avatar,
  Box,
  Button,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Tooltip } from "react-tooltip";
import ExerciseResultInputModal from "./ExerciseResultsInputModal";
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
  const validPaths = [
    "/track/results",
    "/track/personal-bests",
    "/track/workout-plan",
    "/track/user-profile",
    "/track/about",
  ];
  const currentPath = validPaths.includes(location.pathname)
    ? location.pathname
    : false;
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
              to="/track/results"
              value="/track/results"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="Personal Bests"
              to="/track/personal-bests"
              value="/track/personal-bests"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="Workout Plan"
              to="/track/workout-plan"
              value="/track/workout-plan"
              icon={<AutoAwesomeIcon />}
              iconPosition="start"
              sx={{ fontSize: "large", paddingVertical: 1, minHeight: 0 }}
            />
            <Tab
              component={Link}
              label="Profile"
              to="/track/user-profile"
              value="/track/user-profile"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
            <Tab
              component={Link}
              label="About"
              to="/track/about"
              value="/track/about"
              sx={{ fontSize: "large", paddingVertical: 1 }}
            />
          </Tabs>
        </Grid>
      </header>

      <DataStoreProvider>
        <main className="App-main">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/track/results" replace />}
            />
            <Route
              path="/track"
              element={<Navigate to="/track/results" replace />}
            />
            <Route
              path="/track/"
              element={<Navigate to="/track/results" replace />}
            />
            <Route
              path="track/results"
              element={
                <div>
                  <Grid
                    container
                    sx={{ width: "100%", justifyContent: "center" }}
                    marginBottom={2}
                  >
                    <ExerciseResultInputModal maxWidth={pageWidth} />
                  </Grid>
                  <Box
                    sx={{
                      minWidth: pageWidth,
                      maxWidth: pageWidth,
                      width: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <ExerciseResultTable />
                  </Box>
                </div>
              }
            />
            <Route
              path="track/personal-bests"
              element={
                <div>
                  <ExercisesBoard maxWidth={pageWidth} />
                </div>
              }
            />
            <Route
              path="track/workout-plan"
              element={<WeekPlanBoard maxWidth={pageWidth} />}
            />
            <Route
              path="track/about"
              element={
                <Grid container sx={{ width: "100%", maxWidth: pageWidth }}>
                  <About />
                </Grid>
              }
            />
            <Route
              path="track/user-profile"
              element={<UserProfileForm maxWidth={pageWidth} />}
            />
            <Route
              path="*"
              element={
                <>
                  <Typography variant="body1" gutterBottom>
                    404: {window.location.origin}
                    {location.pathname} not found
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/track/results");
                    }}
                  >
                    Go to Results
                  </Button>
                </>
              }
            />
          </Routes>
        </main>
      </DataStoreProvider>
    </>
  );
}

export default Home;
