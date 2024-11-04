import { Link, Paper, Typography } from "@mui/material";

function About() {
  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Typography
        variant="body1"
        marginTop={2}
        align="center"
        sx={{ margin: 2, fontStyle: "italic" }}
      >
        <div>
          This project allows users to log workouts and track personal bests.
        </div>
      </Typography>
      <Typography variant="body1" marginTop={2} align="left" sx={{ margin: 2 }}>
        <div>
          • The{" "}
          <Link
            href="https://github.com/johnjaredprater/web_server"
            target="_blank"
            rel="noopener"
          >
            frontend
          </Link>{" "}
          is built with React and TypeScript.
        </div>
        <div>
          • The{" "}
          <Link
            href="https://github.com/johnjaredprater/gym_track_core"
            target="_blank"
            rel="noopener"
          >
            backend
          </Link>{" "}
          uses Litestar and is written in Python.
        </div>
        <div>
          • The components are deployed on an EKS cluster in AWS, along with an
          RDS database. The infrastructure is defined in code and is managed
          from{" "}
          <Link
            href="https://github.com/johnjaredprater/infrastructure"
            target="_blank"
            rel="noopener"
          >
            this
          </Link>{" "}
          GitHub repository.
        </div>
      </Typography>
    </Paper>
  );
}

export default About;
