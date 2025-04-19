import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useContext, useEffect, useState } from "react";
import { baseUrl, Exercise, ExerciseResult } from "./Home";
import { CurrentUserContext } from "./App";
import axios from "axios";
import {
  Box,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";

interface Data {
  exercise: Exercise;
  weight: number;
  reps: number;
  allPersonalBests: { [key: number]: ExerciseResult };
}

interface ExercisesBoardProps {
  maxWidth: number;
  exerciseResultsModified: number;
  incrementExerciseResultsModified: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function ExercisesBoard(props: ExercisesBoardProps) {
  const theme = useTheme();
  const maxWidth = props.maxWidth;

  const [boardData, updateBoardData] = useState<Data[]>([]);
  const [filteredItems, setFilteredItems] = useState<Data[]>(boardData);

  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");

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
        .get(`${baseUrl}/api/exercise_results`, {
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
        const exercise_results: ExerciseResult[] = response.data;

        const exercises: Partial<Record<number, ExerciseResult[]>> =
          Object.groupBy(exercise_results, ({ exercise }) => exercise.id);

        return Object.values(exercises).map((exercise_results) => {
          const exerciseResultsByReps: Partial<
            Record<number, ExerciseResult[]>
          > = Object.groupBy(
            exercise_results!,
            (exercise_result) => exercise_result.reps,
          );
          const heaviestPersonalBest = exercise_results!.reduce(
            (exercise_result_a, exercise_result_b) => {
              return exercise_result_a.weight >= exercise_result_b.weight
                ? exercise_result_a
                : exercise_result_b;
            },
          );
          const allPersonalBests = Object.fromEntries(
            Object.entries(exerciseResultsByReps).map(
              ([reps, exercise_results]) => [
                reps,
                exercise_results!.reduce(
                  (exercise_result_a, exercise_result_b) => {
                    return exercise_result_a.weight >= exercise_result_b.weight
                      ? exercise_result_a
                      : exercise_result_b;
                  },
                ),
              ],
            ),
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
  }, [userContext, props.exerciseResultsModified]);

  useEffect(() => {
    if (!searchTerm) {
      // If search is empty, show all items
      setFilteredItems(boardData);
      return;
    }

    // Filter items based on search term
    const filtered = boardData.filter((item) =>
      item.exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredItems(filtered);
  }, [boardData, searchTerm]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      {/* Search control */}
      <Box
        sx={{ mb: 2, display: "flex", justifyContent: "center", width: "100%" }}
      >
        <TextField
          hiddenLabel
          // variant="filled"
          variant="outlined"
          size="small"
          sx={{
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#777",
              opacity: 1,
            },
          }}
          margin="dense"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "grey" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container maxWidth={maxWidth} spacing={2} justifyContent="center">
        {filteredItems.map((personalBests) => (
          <Grid key={personalBests.exercise.id}>
            <Card
              onClick={() => handleCardClick(personalBests)}
              sx={{
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

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxHeight: "none", height: "auto" } }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: theme.palette.primary.main }}
          >
            {selectedExercise?.exercise.name}
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
                    ([reps, exercise_result]) => (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {" "}
                          {reps}{" "}
                        </TableCell>
                        <TableCell>{exercise_result.weight}</TableCell>
                        <TableCell>{exercise_result.sets}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {format(new Date(exercise_result.date), "yyyy-MM-dd")}
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
    </>
  );
}
