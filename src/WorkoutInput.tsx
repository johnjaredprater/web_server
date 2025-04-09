import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { CurrentUserContext } from "./App";
import { Button, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid2";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { baseUrl, Exercise } from "./Home";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

interface WorkoutForm {
  exercise_name: string;
  sets: string;
  reps: string;
  weight: string;
  rpe?: string;
  date?: string;
}

type WorkoutInputProps = {
  maxWidth: number;
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
};

type NumberInputFieldProps = {
  id: string;
  label: string;
  value: string | undefined;
  formData: WorkoutForm;
  setFormData: React.Dispatch<React.SetStateAction<WorkoutForm>>;
  min: number;
  max: number;
  validateAsInt?: boolean;
  adornment?: string;
  required?: boolean;
};

const NumberInputField: React.FC<NumberInputFieldProps> = ({
  id,
  label,
  value,
  formData,
  setFormData,
  min,
  max,
  validateAsInt = false,
  adornment = "",
  required = false,
}) => {
  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof WorkoutForm;
      value: string;
    };
    if (value === "") {
      setFormData({ ...formData, [name]: value });
    } else if (validateAsInt) {
      const intValue = parseInt(value);
      if (intValue >= min && intValue <= max) {
        setFormData({ ...formData, [name]: intValue.toFixed(0) });
      }
    } else {
      const floatValue = parseFloat(value);
      if (floatValue >= min && floatValue <= max) {
        setFormData({
          ...formData,
          [name]: (Math.round(floatValue * 100) / 100).toString(),
        });
      }
    }
  };

  return (
    <TextField
      required={required}
      id={id}
      label={label}
      type="number"
      name={id}
      value={value}
      onChange={handleChange}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">{adornment}</InputAdornment>
          ),
        },
      }}
    />
  );
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
        .get(`${baseUrl}/api/exercises`, {
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
    });

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
            `${baseUrl}/api/workouts`,
            {
              exercise_id: exercise.id,
              weight: formData.weight,
              reps: formData.reps,
              sets: formData.sets,
              rpe: formData.rpe,
              date: dayjs(formData.date).format(),
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
          <AccordionDetails sx={{ padding: 1 }}>
            <Grid
              container
              justifyContent="center"
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "90%" } }}
              columnSpacing={1}
              rowSpacing={1}
              columns={{ xs: 2, sm: 4, md: 8 }}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <Autocomplete
                  disablePortal
                  options={exercises.map((exercise) => exercise.name)}
                  renderInput={(params) => (
                    <TextField {...params} required label="Exercise" />
                  )}
                  value={formData.exercise_name}
                  onChange={handleExerciseChange}
                />
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={formData.date ? dayjs(formData.date) : null}
                    onChange={(newValue) => {
                      setFormData({ ...formData, date: newValue?.toString() });
                    }}
                    format="YYYY-MM-DD"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
                <NumberInputField
                  required
                  validateAsInt={false}
                  id="weight"
                  label="Weight"
                  value={formData.weight}
                  formData={formData}
                  setFormData={setFormData}
                  min={-1000}
                  max={10000}
                  adornment="kg"
                />
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <NumberInputField
                  required
                  validateAsInt={true}
                  id="reps"
                  label="Reps"
                  value={formData.reps}
                  formData={formData}
                  setFormData={setFormData}
                  min={0}
                  max={10000}
                />
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <NumberInputField
                  required
                  validateAsInt={true}
                  id="sets"
                  label="Sets"
                  value={formData.sets}
                  formData={formData}
                  setFormData={setFormData}
                  min={0}
                  max={10000}
                />
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <NumberInputField
                  validateAsInt={true}
                  id="rpe"
                  label="RPE"
                  value={formData.rpe}
                  formData={formData}
                  setFormData={setFormData}
                  min={0}
                  max={10}
                  adornment="/10"
                />
              </Grid>
              <div>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </div>
            </Grid>
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
