import { Link, Paper, Typography } from "@mui/material";

function About() {
  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Typography
        variant="body1"
        component="div"
        marginTop={2}
        align="center"
        sx={{ margin: 2, fontStyle: "italic" }}
      >
        This project allows users to log exercise results and track personal
        bests.
      </Typography>
      <Typography
        variant="body1"
        component="div"
        marginTop={2}
        align="left"
        sx={{ margin: 2 }}
      >
        • The{" "}
        <Link
          href="https://github.com/johnjaredprater/web_server"
          target="_blank"
          rel="noopener"
        >
          frontend
        </Link>{" "}
        is built with React and TypeScript.
        <br />• The{" "}
        <Link
          href="https://github.com/johnjaredprater/gym_track_core"
          target="_blank"
          rel="noopener"
        >
          backend
        </Link>{" "}
        uses Litestar and is written in Python.
        <br />• The components are deployed on a Digital Ocean Kubernetes
        Cluster, along with a MySQL database cluster. The infrastructure is
        defined in code and is managed from{" "}
        <Link
          href="https://github.com/johnjaredprater/infrastructure"
          target="_blank"
          rel="noopener"
        >
          this
        </Link>{" "}
        GitHub repository.
      </Typography>
    </Paper>
  );
}

export default About;
