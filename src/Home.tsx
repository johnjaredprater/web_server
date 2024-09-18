import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { auth } from "./auth/firebase/Auth";
import { signOut } from "firebase/auth";
import { CurrentUserContext } from "./App";
import {
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

interface Exercise {
  id: number;
  name: string;
  video_link?: string;
}

const pageWIdth = 600;

function Home() {
  const userContext = useContext(CurrentUserContext);

  console.log(userContext?.user);

  const [data, updateData] = useState<Exercise[] | null>();

  useEffect(() => {
    const getData = async () => {
      // const accessToken = await userContext?.user?.getIdToken()
      const response = await axios
        // .get(
        //   "http://localhost:8000/api/exercises"
        // )
        .get("https://gym.johnprater.me/api/exercises")
        // , {
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`
        //   }
        // })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      if (response) {
        updateData(response.data);
      }
    };
    getData();
  }, []);

  return (
    <>
      <header className="App-header">
        <Grid container sx={{ width: "100%", maxWidth: pageWIdth }} spacing={2}>
          <Grid size={6}>
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
          <Grid size={6}>
            <Typography variant="subtitle1" marginTop={2} align="right">
              Welcome {userContext?.user?.displayName}!
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
                {data &&
                  data.map((exercise) => (
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
