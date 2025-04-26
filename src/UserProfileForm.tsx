import * as React from "react";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { baseUrl } from "./Home";
import { CurrentUserContext } from "./App";
import axios from "axios";
import { Button, TextField, MenuItem, InputLabel, Paper } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid2";
import Slider from "@mui/material/Slider";
import { UserProfile, UserProfileFormData } from "./types";
import { useDataStore } from "./DataStoreContext";
import NumberInputField from "./components/NumberInputField";
import { useLocation, useNavigate } from "react-router-dom";

interface UserProfileFormProps {
  maxWidth: number;
}

export default function UserProfileForm(props: UserProfileFormProps) {
  const { data, fetchData, updateData } = useDataStore();
  const userProfile = data.user_profile;
  const userProfileForm: UserProfileFormData = data.user_profile_form_data;

  const location = useLocation();
  const navigate = useNavigate();

  const userContext = useContext(CurrentUserContext);

  const createUserProfile = async (userProfileForm: UserProfileFormData) => {
    console.log("userProfileForm", userProfileForm);
    const accessToken = await userContext?.user?.getIdToken();
    const response = await axios
      .post(
        `${baseUrl}/api/user_profile`,
        { ...userProfileForm },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          if (error.response.status === 404) {
            console.log("User profile not found");
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    if (response && response.status.toString().startsWith("2")) {
      const userProfile: UserProfile = response.data;
      return userProfile;
    }
    return userProfile;
  };

  const updateUserProfile = async (userProfileForm: UserProfileFormData) => {
    const accessToken = await userContext?.user?.getIdToken();
    const response = await axios
      .patch(
        `${baseUrl}/api/user_profile`,
        { ...userProfileForm },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          if (error.response.status === 404) {
            console.log("User profile not found");
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    if (response && response.status.toString().startsWith("2")) {
      const userProfile: UserProfile = response.data;
      return userProfile;
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userProfile) {
      fetchData("user_profile", () => createUserProfile(userProfileForm));
    } else {
      updateData("user_profile", await updateUserProfile(userProfileForm));
    }
    // TODO handle errors
    const from = location.state?.from?.pathname || "/workout-plan";
    navigate(from, { replace: true });
  };

  const updateFormField = (name: keyof UserProfileFormData, value: string) => {
    const updatedValues = {
      ...userProfileForm,
      [name]: value,
    };
    updateData("user_profile_form_data", updatedValues);
  };

  return (
    <Paper
      sx={{
        width: props.maxWidth,
        minHeight: "640px",
        mb: 2,
        padding: 2,
      }}
    >
      <Typography variant="h4" color="primary" mb={2}>
        User Profile
      </Typography>
      <Grid
        container
        maxWidth={props.maxWidth}
        spacing={2}
        justifyContent="left"
      >
        <>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
            component="div"
            align="left"
          >
            Describe yourself, your goals and any injuries or limitations.
          </Typography>

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
            <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
              <NumberInputField
                required
                validateAsInt={true}
                id="age"
                label="Age"
                value={userProfileForm.age?.toString()}
                setFormData={(value) => updateFormField("age", value)}
                min={0}
                max={200}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
              <FormControl sx={{ m: 1, width: "90%" }} size="small">
                <InputLabel>Gender *</InputLabel>
                <Select
                  required
                  id="gender"
                  label="Gender"
                  value={userProfileForm.gender}
                  onChange={(event) =>
                    updateFormField("gender", event.target.value)
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
              component="div"
              align="left"
            >
              How many different workouts would you like to do each week, and
              how long would you like each workout to be?
            </Typography>
            <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
              <Typography variant="body1" component="div" align="center">
                Days
              </Typography>
              <Slider
                value={
                  userProfileForm.number_of_days
                    ? parseInt(userProfileForm.number_of_days)
                    : 1
                }
                step={1}
                marks={Array.from({ length: 7 }, (_, i) => ({
                  value: i + 1,
                  label: (i + 1).toString(),
                }))}
                min={1}
                max={7}
                track={false}
                onChange={(event, value) =>
                  updateFormField("number_of_days", value.toString())
                }
                sx={{ width: "90%" }}
              />
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
              <NumberInputField
                required
                validateAsInt={true}
                id="duration"
                label="Duration"
                value={userProfileForm.workout_duration?.toString()}
                setFormData={(value) =>
                  updateFormField("workout_duration", value)
                }
                min={0}
                max={600}
                size="small"
                adornment="minutes"
              />
            </Grid>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
              component="div"
              align="left"
            >
              How much experience do you have with strength training?
            </Typography>
            <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={{ padding: "none" }}>
              <FormControl sx={{ m: 1, width: "90%" }} size="small">
                <InputLabel id="demo-simple-select-label">
                  Experience *
                </InputLabel>
                <Select
                  required
                  id="fitness_level"
                  label="Fitness Level"
                  value={userProfileForm.fitness_level}
                  onChange={(event) =>
                    updateFormField("fitness_level", event.target.value)
                  }
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 8 }} sx={{ padding: "none" }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
                component="div"
                align="left"
              >
                What are your strength training goals?
              </Typography>
              <FormControl sx={{ m: 1, width: "100%" }} size="small">
                <TextField
                  required
                  id="goal"
                  label="Goals"
                  value={userProfileForm.goal}
                  onChange={(event) =>
                    updateFormField("goal", event.target.value)
                  }
                  multiline
                  rows={4}
                  placeholder="e.g. I want to get stronger, I want to lose weight, I want to improve my endurance, etc."
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 8 }} sx={{ padding: "none" }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
                component="div"
                align="left"
              >
                Any injuries or limitations?
              </Typography>
              <FormControl sx={{ m: 1, width: "100%" }} size="small">
                <TextField
                  id="injury_description"
                  label="Injuries"
                  value={userProfileForm.injury_description}
                  onChange={(event) =>
                    updateFormField("injury_description", event.target.value)
                  }
                  multiline
                  rows={4}
                  placeholder="e.g. I have a bad back, I have a bad shoulder, etc."
                />
              </FormControl>
            </Grid>
            <div>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </div>
          </Grid>
        </>
      </Grid>
    </Paper>
  );
}
