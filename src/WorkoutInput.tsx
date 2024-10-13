import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { CurrentUserContext } from "./App";
import { Box, Button, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Exercise } from "./Home";

interface WorkoutForm {
  exercise_name: string;
  sets: string;
  reps: string;
  weight: string;
  rpe?: string;
}

type WorkoutInputProps = {
  maxWidth: number;
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
};

const WorkoutInput: React.FC<WorkoutInputProps> = ({
  maxWidth,
  workoutsModified,
  incrementWorkoutsModified,
}) => {
  const userContext = useContext(CurrentUserContext);

  const [exercises, updateExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const getExercises = async () => {
      const accessToken = await userContext?.user?.getIdToken();
      const response = await axios
        // .get("http://localhost:8000/api/exercises", {
        .get("https://gym.johnprater.me/api/exercises", {
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
        updateExercises(response.data);
      }
    };
    getExercises();
  }, [userContext]);

  type InputAccordionProps = {
    exercises: Exercise[];
  };

  const InputAccordion: React.FC<InputAccordionProps> = ({ exercises }) => {
    const [formData, setFormData] = useState<WorkoutForm>({
      exercise_name: "",
      sets: "",
      reps: "",
      weight: "",
      rpe: "",
    });

    const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = event.target as {
        name: keyof WorkoutForm;
        value: string;
      };
      const intValue = parseInt(value);
      setFormData({ ...formData, [name]: intValue ? intValue : 0 });
      console.log(formData);
    };

    const handleExerciseChange = (
      event: React.SyntheticEvent,
      value: string | null,
    ) => {
      // eslint-disable-next-line
      setFormData({ ...formData, ["exercise_name"]: value ? value : "" });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const accessToken = await userContext?.user?.getIdToken();
      const exercise = exercises.find(
        (exercise) => exercise.name === formData.exercise_name,
      );
      if (exercise) {
        await axios
          .post(
            // "http://localhost:8000/api/workouts",
            // {
            "https://gym.johnprater.me/api/workouts",
            {
              exercise_id: exercise.id,
              weight: formData.weight,
              reps: formData.reps,
              sets: formData.sets,
              rpe: formData.rpe,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )

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
      }

      incrementWorkoutsModified(workoutsModified + 1);
      setFormData({
        exercise_name: "",
        sets: "",
        reps: "",
        weight: "",
        rpe: "",
      });
    };

    return (
      <div>
        <Accordion
          sx={{
            width: maxWidth,
            zIndex: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "& .MuiAccordionSummary-content": { justifyContent: "center" },
            }}
          >
            <Typography variant="h6">Add Workout</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "90%" } }}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Autocomplete
                disablePortal
                options={exercises.map((exercise) => exercise.name)}
                renderInput={(params) => (
                  <TextField {...params} required label="Exercise" />
                )}
                value={formData.exercise_name}
                onChange={handleExerciseChange}
              />
              <TextField
                required
                id="weight"
                label="Weight"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                required
                id="reps"
                label="Reps"
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
              />
              <TextField
                required
                id="sets"
                label="Sets"
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
              />
              <TextField
                required
                id="rpe"
                label="RPE"
                type="number"
                name="rpe"
                value={formData.rpe}
                onChange={handleChange}
                slotProps={{
                  input: {
                    inputProps: { min: 0, max: 10 },
                    endAdornment: (
                      <InputAdornment position="end">/10</InputAdornment>
                    ),
                  },
                }}
              />
              <div>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </div>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  };

  return (
    <div>
      <InputAccordion exercises={exercises}></InputAccordion>
    </div>
  );
};

export default WorkoutInput;
