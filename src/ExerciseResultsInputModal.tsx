import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { CurrentUserContext } from "./App";
import {
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { baseUrl } from "./Home";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

import Modal from "@mui/material/Modal";
import React from "react";
import { useDataStore } from "./DataStoreContext";
import CloseIcon from "@mui/icons-material/Close";
import { getExerciseResults } from "./api";

interface ExerciseResultForm {
  exercise_name: string;
  sets: string;
  reps: string;
  weight: string;
  rpe?: string;
  date?: string;
}

type ExerciseResultInputModalProps = {
  maxWidth: number;
};

type NumberInputFieldProps = {
  id: string;
  label: string;
  value: string | undefined;
  formData: ExerciseResultForm;
  setFormData: React.Dispatch<React.SetStateAction<ExerciseResultForm>>;
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
      name: keyof ExerciseResultForm;
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
      sx={{ width: "100%" }}
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

const ExerciseResultInputModal: React.FC<ExerciseResultInputModalProps> = ({
  maxWidth,
}) => {
  const userContext = useContext(CurrentUserContext);

  const { data, isLoading, fetchData, updateData } = useDataStore();
  const exercises = data["exercises"];
  const exercisesLoading = isLoading["exercises"];

  useEffect(() => {
    if (exercises.length === 0 && !exercisesLoading) {
      fetchData("exercises", () => getExercises());
    }
  }, [userContext]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const getExercises = async () => {
    console.log("GETTING EXERCISES");
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
      return response.data;
    }
    return [];
  };

  const [formData, setFormData] = useState<ExerciseResultForm>({
    exercise_name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          `${baseUrl}/api/exercise_results`,
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

    setFormData({
      exercise_name: "",
      sets: "",
      reps: "",
      weight: "",
    });

    const results = await getExerciseResults(accessToken);
    updateData("exercise_results", results);

    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen} variant="contained" color="primary">
        <Typography variant="h6">Add Exercise Result</Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          justifyContent="center"
          component="form"
          sx={{
            width: { xs: "95vw", sm: "90vw", md: "80vw" },
            maxWidth: { xs: "none", sm: 480, md: maxWidth },
            maxHeight: "75vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            overflow: "auto",
            borderRadius: { xs: 1, sm: 2 },
            outline: "none",
          }}
          columnSpacing={2}
          rowSpacing={2}
          columns={{ xs: 2, sm: 4, md: 8 }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Grid
            size={{ xs: 2, sm: 4, md: 8 }}
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
              Add Exercise Result
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 0 }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            {exercisesLoading ? (
              <CircularProgress />
            ) : (
              <Autocomplete
                disablePortal
                options={exercises.map((exercise) => exercise.name)}
                renderInput={(params) => (
                  <TextField {...params} required label="Exercise" />
                )}
                value={formData.exercise_name}
                onChange={handleExerciseChange}
              />
            )}
          </Grid>
          <Grid size={{ xs: 2, sm: 4, md: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
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
      </Modal>
    </>
  );
};

export default ExerciseResultInputModal;
