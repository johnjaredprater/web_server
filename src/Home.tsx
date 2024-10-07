import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";
import { CurrentUserContext } from "./App";
import { format } from "date-fns";
import {
  Avatar,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip } from "react-tooltip";

interface Exercise {
  id: number;
  name: string;
  video_link?: string;
}

interface Workout {
  id: number;
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageWIdth = windowWidth >= 660 ? 600 : windowWidth - 60;

  const userContext = useContext(CurrentUserContext);
  console.log(userContext?.user);

  const [exercises, updateExercises] = useState<Exercise[] | null>();
  const [workouts, updateWorkouts] = useState<Workout[] | null>();

  useEffect(() => {
    const getExercises = async () => {
      const accessToken = await userContext?.user?.getIdToken();
      const response = await axios
        // .get("http://localhost:8000/api/exercises"
        .get("https://gym.johnprater.me/api/exercises", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      if (response) {
        updateExercises(response.data);
      }
    };
    getExercises();
  }, [userContext]);

  useEffect(() => {
    const getWorkouts = async () => {
      const accessToken = await userContext?.user?.getIdToken();
      const response = await axios
        // .get("http://localhost:8000/api/workouts"
        .get("https://gym.johnprater.me/api/workouts", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      if (response) {
        updateWorkouts(response.data);
      }
    };
    getWorkouts();
  }, [userContext]);

  return (
    <>
      <header className="App-header">
        <Grid container sx={{ width: "100%", maxWidth: pageWIdth }}>
          <Grid size={7}>
            <Typography variant="h4" marginTop={2} align="left">
              <SvgIcon
                fontSize="large"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              >
                <FitnessCenterIcon />
              </SvgIcon>
              GymTrack
            </Typography>
          </Grid>
          <Grid size={1}>
            {userContext?.user?.displayName && (
              <Avatar
                alt={userContext.user.displayName}
                src={
                  userContext.user.photoURL
                    ? userContext.user.photoURL
                    : undefined
                }
                style={{ color: "#fbe9be" }}
                data-tooltip-content={
                  "Signed in as " + userContext?.user?.displayName
                }
                data-tooltip-id="tooltip"
                data-tooltip-place="bottom"
              />
            )}
          </Grid>
          <Grid size={4}>
            <Typography variant="subtitle1" marginTop={3} align="right">
              <Tooltip id="tooltip" />
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
                  <span className="gsi-material-button-contents">Sign out</span>
                </div>
              </button>
            </Typography>
          </Grid>
        </Grid>
      </header>

      <main className="App-main">
        <div>
          <Grid container sx={{ width: "100%", maxWidth: pageWIdth }}>
            <Typography variant="h6" align="left" gutterBottom>
              Workouts:
            </Typography>
          </Grid>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: pageWIdth, maxWidth: pageWIdth }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Exercise</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Sets</TableCell>
                  <TableCell>RPE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workouts &&
                  workouts.map((workout) => (
                    <TableRow
                      key={workout.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        {format(new Date(workout.updated_at), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{workout.exercise.name}</TableCell>
                      <TableCell>{workout.weight}</TableCell>
                      <TableCell>{workout.reps}</TableCell>
                      <TableCell>{workout.sets}</TableCell>
                      <TableCell>{workout.rpe}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Grid container sx={{ width: "100%", maxWidth: pageWIdth }}>
          <Typography variant="h6" align="left" gutterBottom>
            Here are some exercises you could be doing:
          </Typography>
        </Grid>

        <div>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: pageWIdth, maxWidth: pageWIdth }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Video Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercises &&
                  exercises.map((exercise) => (
                    <TableRow
                      key={exercise.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {exercise.id}
                      </TableCell>
                      <TableCell>{exercise.name}</TableCell>
                      <TableCell>
                        <a
                          href={exercise.video_link}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <SvgIcon
                            fontSize="small"
                            style={{ verticalAlign: "middle", marginRight: 8 }}
                          >
                            <OpenInNewIcon />
                          </SvgIcon>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <footer className="App-footer">
        <Grid container sx={{ width: "100%", maxWidth: pageWIdth }} spacing={2}>
          <Typography variant="body2" marginTop={2} align="left">
            version {process.env.REACT_APP_VERSION}
          </Typography>
        </Grid>
      </footer>
    </>
  );
}

export default Home;
