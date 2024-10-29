import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { baseUrl, Exercise, Workout } from "./Home";
import { CurrentUserContext } from "./App";
import axios from "axios";
import {
  CardActionArea,
  CardMedia,
  Dialog,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";

interface Data {
  exercise: Exercise;
  weight: number;
  reps: number;
  allPersonalBests: { [key: number]: Workout };
}

interface ExercisesBoardProps {
  maxWidth: number;
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
}

export default function ExercisesBoard(props: ExercisesBoardProps) {
  const theme = useTheme();
  const maxWidth = props.maxWidth;

  const [boardData, updateBoardData] = useState<Data[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<null | Data>(null);

  const handleCardClick = (exerciseData: Data) => {
    setSelectedExercise(exerciseData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedExercise(null);
  };

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
          const workoutsByReps: Partial<Record<number, Workout[]>> =
            Object.groupBy(workouts!, (workout) => workout.reps);
          const heaviestPersonalBest = workouts!.reduce(
            (workout_a, workout_b) => {
              return workout_a.weight >= workout_b.weight
                ? workout_a
                : workout_b;
            },
          );
          const allPersonalBests = Object.fromEntries(
            Object.entries(workoutsByReps).map(([reps, workouts]) => [
              reps,
              workouts!.reduce((workout_a, workout_b) => {
                return workout_a.weight >= workout_b.weight
                  ? workout_a
                  : workout_b;
              }),
            ]),
          );
          const tableRow = {
            exercise: heaviestPersonalBest.exercise,
            weight: heaviestPersonalBest.weight,
            reps: heaviestPersonalBest.reps,
            allPersonalBests: allPersonalBests,
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
        {boardData.map((personalBests) => (
          <Grid size={{ xs: 2, sm: 3, md: 4 }} key={personalBests.exercise.id}>
            <Card
              onClick={() => handleCardClick(personalBests)}
              sx={{
                bgcolor: theme.palette.primary.light,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography align="left">
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {personalBests.exercise.name}
                    </Typography>
                    <Typography variant="body2">
                      <Typography sx={{ color: "text.primary" }}>
                        Weight: {personalBests.weight}kg
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        <div>Reps: {personalBests.reps}</div>
                      </Typography>
                    </Typography>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: theme.palette.primary.main }}
          >
            {selectedExercise?.exercise.name} Personal Bests
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Grid
          container
          maxWidth={maxWidth}
          sx={{ padding: 2 }}
          spacing={2}
          justifyContent="center"
        >
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Reps</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Sets</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedExercise &&
                  Object.entries(selectedExercise.allPersonalBests).map(
                    ([reps, workout]) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {" "}
                          {reps}{" "}
                        </TableCell>
                        <TableCell>{workout.weight}</TableCell>
                        <TableCell>{workout.sets}</TableCell>
                        <TableCell>
                          {format(new Date(workout.updated_at), "yyyy-MM-dd")}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <CardMedia
            component="iframe"
            src={selectedExercise?.exercise.video_link}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              border: "0",
              width: "100%",
              height: "100%",
              maxHeight: 600,
              borderRadius: 2,
            }}
          />
        </Grid>
      </Dialog>
    </Paper>
  );
}
