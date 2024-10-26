import { useContext, useEffect, useState } from "react";
import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";
import { CurrentUserContext } from "./App";
import { Avatar, Box, SvgIcon, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Tooltip } from "react-tooltip";
import WorkoutInput from "./WorkoutInput";
import React from "react";
import WorkoutTable from "./WorkoutTable";

import { useTheme } from "@mui/material/styles";
import ExercisesTable from "./ExercisesTable";
import ExercisesBoard from "./ExercisesBoard";

export const baseUrl = "https://gym.johnprater.me";
// export const baseUrl = "http://localhost:8000";

export interface Exercise {
  id: number;
  name: string;
  video_link?: string;
}

export interface Workout {
  id: string;
  exercise_id: number;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  rpe?: number;
  updated_at: string;
}

function Home() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageWidth = windowWidth >= 660 ? 600 : windowWidth - 60;

  const userContext = useContext(CurrentUserContext);
  console.log(userContext?.user);

  const [workoutsModified, incrementWorkoutsModified] = useState(0);

  const [tab_index, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
            >
              <SvgIcon
                fontSize="large"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              >
                <FitnessCenterIcon />
              </SvgIcon>
              GymTrack
            </Typography>
            <Tooltip
              id="version-tooltip"
              style={{ display: "inline-block", zIndex: 1 }}
              place="left"
            />
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
                    data-tooltip-content={
                      "Signed in as " + userContext.user.displayName
                    }
                    data-tooltip-id="user-tooltip"
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
            value={tab_index}
            onChange={handleChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
            centered
          >
            <Tab label="Workouts" sx={{ fontSize: "medium" }} />
            <Tab label="Personal Bests" sx={{ fontSize: "medium" }} />
            <Tab label="Exercises" sx={{ fontSize: "medium" }} />
          </Tabs>
        </Grid>
      </header>

      <main className="App-main">
        {tab_index === 0 && (
          <div>
            <Grid
              container
              sx={{ width: "100%", justifyContent: "center" }}
              marginBottom={2}
            >
              <WorkoutInput
                maxWidth={pageWidth}
                workoutsModified={workoutsModified}
                incrementWorkoutsModified={incrementWorkoutsModified}
              ></WorkoutInput>
            </Grid>
            <Box
              sx={{
                minWidth: pageWidth,
                maxWidth: pageWidth,
                width: "100%",
                overflowX: "auto",
              }}
            >
              <WorkoutTable
                workoutsModified={workoutsModified}
                incrementWorkoutsModified={incrementWorkoutsModified}
              />
            </Box>
          </div>
        )}

        {tab_index === 1 && (
          <div>
            <ExercisesBoard
              maxWidth={pageWidth}
              workoutsModified={workoutsModified}
              incrementWorkoutsModified={incrementWorkoutsModified}
            />
          </div>
        )}

        {tab_index === 2 && (
          <div>
            <ExercisesTable maxWidth={pageWidth} />
          </div>
        )}
      </main>

      {/* <footer className="App-footer">
        <Grid container sx={{ width: "100%", maxWidth: pageWidth }} spacing={2}>
          <Typography variant="body2" marginTop={2} align="left">
            version {}
          </Typography>
        </Grid>
      </footer> */}
    </>
  );
}

export default Home;
