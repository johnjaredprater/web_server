import { useContext } from "react";
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

function Home() {
  const userContext = useContext(CurrentUserContext);
  console.log(userContext);

  return (
    <>
      <header className="App-header">
        <Grid container sx={{ width: "100%", maxWidth: 720 }} spacing={2}>
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
                style={{ marginLeft: 8 }}
                onClick={() => {
                  signOut(auth);
                }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <span className="gsi-material-button-contents">Logout</span>
                </div>
              </button>
            </Typography>
          </Grid>
        </Grid>
      </header>

      <main className="App-main">
        <p>A table:</p>
        <div>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 720 }}
              size="small"
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  // key={row.message_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>id-1</TableCell>
                  <TableCell>now!</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <footer className="App-footer">
        <Grid container sx={{ width: "100%", maxWidth: 720 }} spacing={2}>
          <Typography variant="body2" marginTop={2} align="left">
            version {process.env.REACT_APP_VERSION}
          </Typography>
        </Grid>
      </footer>
    </>
  );
}

export default Home;
