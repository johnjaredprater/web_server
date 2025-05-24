import "../App.css";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase/Auth";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { SvgIcon, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import About from "../About";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  console.log("Redirecting to:", from);

  async function onLogin(): Promise<void> {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());

      // await signInWithRedirect(auth, new GoogleAuthProvider());
      // Currently the redirect raises: GET https://auth.johnprater.me/__/firebase/init.json 404 (Not Found)

      // // This will trigger a full page redirect away from your app

      // // After returning from the redirect when your app initializes you can obtain the result
      // const result = await getRedirectResult(auth);
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) {
        message = error.message;
      }
      console.log(error);
      setErrorMessage(message);
    }
  }

  return (
    <>
      <main className="App-fullpage">
        <section>
          <div>
            <Typography variant="h4" gutterBottom>
              <SvgIcon
                fontSize="large"
                style={{ verticalAlign: "middle", marginRight: 8 }}
              >
                <FitnessCenterIcon />
              </SvgIcon>
              GymTrack
            </Typography>
            <div style={{ marginBottom: 16 }}>
              <SignInWithGoogleButton
                onClick={onLogin}
              ></SignInWithGoogleButton>
            </div>

            <p> {errorMessage} </p>
          </div>

          <Grid
            container
            sx={{ width: "100%", maxWidth: 400 }}
            alignSelf="center"
          >
            <About />
          </Grid>
        </section>
      </main>
    </>
  );
};

export default Login;
