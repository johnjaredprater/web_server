import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { baseUrl } from "./Home";
import { CurrentUserContext } from "./App";
import axios from "axios";
import {
  Box,
  Button,
  CardActionArea,
  Paper,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { UserProfile, WeekPlan } from "./types";
import { useDataStore } from "./DataStoreContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
interface WeekPlanBoardProps {
  maxWidth: number;
}

export default function WeekPlanBoard(props: WeekPlanBoardProps) {
  const { data, isLoading, fetchData, updateData } = useDataStore();
  const weekPlan = data["week_plan"];
  const weekPlanLoading = isLoading["week_plan"];
  const userProfile = data["user_profile"];
  const theme = useTheme();
  const maxWidth = props.maxWidth;

  const navigate = useNavigate();
  const [tab_index, setValue] = React.useState(0);
  const userContext = useContext(CurrentUserContext);

  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (!userProfile) {
      fetchData("user_profile", () => getUserProfile());
    }
  }, [userContext]); /* eslint-disable-line react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userProfile) {
      const getUserProfileFormData = () => {
        return {
          ...(userProfile?.age && { age: userProfile.age.toString() }),
          ...(userProfile?.gender && { gender: userProfile.gender }),
          ...(userProfile?.number_of_days && {
            number_of_days: userProfile.number_of_days.toString(),
          }),
          ...(userProfile?.workout_duration && {
            workout_duration: userProfile.workout_duration.toString(),
          }),
          ...(userProfile?.fitness_level && {
            fitness_level: userProfile.fitness_level,
          }),
          ...(userProfile?.goal && { goal: userProfile.goal }),
          ...(userProfile?.injury_description && {
            injury_description: userProfile.injury_description,
          }),
        };
      };
      updateData("user_profile_form_data", getUserProfileFormData());
    }
  }, [userProfile]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const getUserProfile = async () => {
    const accessToken = await userContext?.user?.getIdToken();
    const response = await axios
      .get(`${baseUrl}/api/user_profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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

    if (userProfile && !weekPlan) {
      fetchData("week_plan", () => createWeekPlan());
    }
  };

  const createWeekPlan = async () => {
    setErrorText("");
    const accessToken = await userContext?.user?.getIdToken();
    const response = await axios
      .post(
        `${baseUrl}/api/week_plans`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          if (error.response.status === 400) {
            setErrorText(error.response.data.detail);
          } else if (error.response.status === 402) {
            setErrorText(
              "You've hit the request limit. Please try again later.",
            );
          } else {
            setErrorText("An error occurred. Please try again.");
          }
        } else if (error.request) {
          console.log("error.request", error.request);
          setErrorText(
            "Couldn't communicate with the server. Please try again later.",
          );
        } else {
          console.log("Error", error.message);
        }
      });
    if (response && response.status.toString().startsWith("2")) {
      const weekPlan: WeekPlan = response.data;
      return weekPlan;
    }
    return null;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ width: maxWidth, minHeight: "640px", mb: 2, padding: 2 }}>
      <Grid container maxWidth={maxWidth} spacing={2} justifyContent="left">
        {!userProfile && (
          <>
            <Grid width="100%">
              <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                First, fill out your user profile...
              </Typography>
            </Grid>
            <Grid width="100%">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/user-profile");
                }}
              >
                Create User Profile
              </Button>
            </Grid>
          </>
        )}

        {userProfile && !weekPlan && (
          <Grid
            container
            maxWidth={maxWidth}
            spacing={2}
            justifyContent="right"
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", margin: "0 auto" }}
          >
            <Grid size={12}>
              <Typography variant="body1" component="div" align="left">
                Hi {userContext?.user?.displayName}!
              </Typography>
              <Typography variant="body1" component="div" align="left">
                {" "}
                Your goals: {userProfile.goal}
              </Typography>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  navigate("/user-profile");
                }}
              >
                Edit Profile
              </Button>
            </Grid>
            <Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading["week_plan"]}
              >
                {isLoading["week_plan"] ? "Generating..." : "Create Plan"}
              </Button>
              {weekPlanLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Grid>
            <Grid width="100%">
              <Typography
                variant="body1"
                color="secondary"
                sx={{ fontStyle: "italic" }}
                component="div"
                align="left"
              >
                {errorText}
              </Typography>
            </Grid>
          </Grid>
        )}
        {userProfile && weekPlan && (
          <div>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              fontWeight="bold"
              sx={{ color: theme.palette.primary.main }}
            >
              Generated Workout Plan
            </Typography>
            <Typography
              variant="body1"
              component="div"
              align="left"
              paddingBottom={1}
              sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}
            >
              {weekPlan.summary}
            </Typography>
            <Tabs
              value={tab_index}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {weekPlan.workouts.map((workout, workoutIndex) => (
                <Tab
                  key={workoutIndex}
                  label={`Day ${workoutIndex + 1}`}
                  sx={{
                    fontSize: "medium",
                    color: theme.palette.text.primary,
                  }}
                />
              ))}
            </Tabs>
            {weekPlan.workouts[tab_index] && (
              <div>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  align="left"
                >
                  {weekPlan.workouts[tab_index].title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  align="left"
                  sx={{ color: "text.secondary" }}
                >
                  Warm-ups
                </Typography>

                <Typography
                  component="ul"
                  sx={{ pl: 2 }}
                  variant="body1"
                  align="left"
                  paddingBottom={1}
                >
                  {weekPlan.workouts[tab_index].warm_ups.map((warmUpPlan) => (
                    <Typography
                      key={warmUpPlan.description}
                      variant="body1"
                      component="li"
                    >
                      {warmUpPlan.description}
                    </Typography>
                  ))}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  align="left"
                  sx={{ color: "text.secondary" }}
                >
                  Exercises
                </Typography>

                <Grid
                  container
                  maxWidth={maxWidth}
                  spacing={1}
                  justifyContent="left"
                  size={12}
                  paddingBottom={1}
                >
                  {weekPlan.workouts[tab_index].exercises.map(
                    (exercisePlan, exerciseIndex) => (
                      <Grid key={exercisePlan.exercise} size={12}>
                        <Card variant="outlined">
                          <CardActionArea>
                            <CardContent
                              sx={{
                                padding: theme.spacing(0.25),
                                paddingLeft: theme.spacing(1.25),
                                paddingRight: theme.spacing(1.25),
                                backgroundColor: theme.palette.grey[100],
                              }}
                            >
                              <Typography align="left">
                                <Typography
                                  variant="body1"
                                  component="span"
                                  paddingRight={2}
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  {exerciseIndex + 1}. {exercisePlan.exercise}
                                </Typography>
                                <Typography variant="body2" component="span">
                                  <Typography
                                    component="span"
                                    paddingRight={1}
                                    sx={{ color: "text.primary" }}
                                  >
                                    Sets: {exercisePlan.sets}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    Reps: {exercisePlan.reps}
                                  </Typography>
                                </Typography>
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ),
                  )}
                </Grid>
              </div>
            )}
          </div>
        )}
      </Grid>
    </Paper>
  );
}
