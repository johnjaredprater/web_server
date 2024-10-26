import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { baseUrl, Exercise, Workout } from "./Home";
import { CurrentUserContext } from "./App";
import axios from "axios";
import { useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface Data {
  exercise: Exercise;
  date: string;
  weight: number;
  reps: number;
  sets: number;
  rpe: number | undefined;
}

interface ExercisesBoardProps {
  maxWidth: number;
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExercisesBoard(props: ExercisesBoardProps) {
  const theme = useTheme();
  const maxWidth = props.maxWidth;

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [boardData, updateBoardData] = useState<Data[]>([]);
  const userContext = useContext(CurrentUserContext);

  useEffect(() => {
    const getBoardData = async () => {
      const accessToken = await userContext?.user?.getIdToken();
      const response = await axios
        .get(`${baseUrl}/api/workouts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      if (response) {
        const workouts: Workout[] = response.data;

        const exercises: Partial<Record<number, Workout[]>> = Object.groupBy(
          workouts,
          ({ exercise }) => exercise.id,
        );

        return Object.values(exercises).map((workouts) => {
          const personalBest = workouts!.reduce((workout_a, workout_b) => {
            return workout_a.weight >= workout_b.weight &&
              new Date(workout_a.updated_at) < new Date(workout_b.updated_at)
              ? workout_a
              : workout_b;
          });
          const tableRow = {
            exercise: personalBest.exercise,
            date: personalBest.updated_at,
            weight: personalBest.weight,
            reps: personalBest.reps,
            sets: personalBest.sets,
            rpe: personalBest.rpe,
          };
          return tableRow;
        });
      }
      return [];
    };
    const update = async () => {
      updateBoardData(await getBoardData());
    };
    update();
  }, [userContext, props.workoutsModified]);

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - boardData.length) : 0;

  // const visibleRows = React.useMemo(
  //   () =>
  //     [...boardData].slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage,
  //     ),
  //   [page, rowsPerPage, boardData],
  // );

  console.log(maxWidth);

  return (
    <Paper sx={{ width: "100%" }}>
      <Grid
        container
        maxWidth={maxWidth}
        sx={{ padding: 2 }}
        spacing={2}
        columns={{ xs: 2, sm: 6, md: 12 }}
        justifyContent="center"
      >
        {boardData.map((personalBest) => (
          <Grid size={{ xs: 2, sm: 3, md: 4 }} key={personalBest.exercise.id}>
            <Card
              sx={{
                bgcolor: theme.palette.grey[100],
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <CardMedia
            component="iframe"
            height="120"
            src={personalBest.exercise.video_link}
            // title="Embedded Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          /> */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography align="left">
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    {personalBest.exercise.name}
                  </Typography>
                  <Typography variant="body2">
                    <Typography sx={{ color: "text.primary" }}>
                      Weight: {personalBest.weight}kg
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      <div>Reps: {personalBest.reps}</div>
                      <div>Sets: {personalBest.sets}</div>
                      {/* <div>
                  Date: {format(new Date(personalBest.date), "yyyy-MM-dd")}
                  </div> */}
                    </Typography>
                  </Typography>
                </Typography>
              </CardContent>
              {/* <CardActions>
            <Button size="small">Video</Button>
          </CardActions> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
