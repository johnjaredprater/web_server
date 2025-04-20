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
  TextField,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { WeekPlan } from "./types";
import { useDataStore } from "./DataStoreContext";
import CircularProgress from "@mui/material/CircularProgress";

interface WeekPlanBoardProps {
  maxWidth: number;
}

export default function WeekPlanBoard(props: WeekPlanBoardProps) {
  const { data, isLoading, fetchData } = useDataStore();

  const theme = useTheme();
  const maxWidth = props.maxWidth;

  const [userProfile, setUserProfile] = useState<string>(
    "I am male, in my late 20s.\n\n" +
      "My goal is to build upper body strength.\n\n" +
      "I would like two different workout days generated.\n\n" +
      "I can dedicate up to 1 hour 30 minutes to a training session.\n\n" +
      "I have a knee injury, and don't want to put any significant force through my legs.\n\n" +
      "I'm moderately experienced with strength training but am quite new to gymnastics and calisthenics",
  );

  const [tab_index, setValue] = React.useState(0);
  const userContext = useContext(CurrentUserContext);

  const [errorText, setErrorText] = useState("");

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      console.log("Getting access token");
      const accessToken = await userContext?.user?.getIdToken();
      if (accessToken) {
        setAccessToken(accessToken);
      }
    };
    getAccessToken();
  }, [userContext]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data["week_plan"]) {
      fetchData("week_plan", () => createWeekPlan(userProfile));
    }
  };

  const createWeekPlan = async (userProfile: string) => {
    const response = await axios
      .post(
        `${baseUrl}/api/week_plans`,
        {
          user_prompt: userProfile,
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
          if (error.response.status === 400) {
            setErrorText(error.response.data.detail);
          } else if (error.response.status === 402) {
            setErrorText(
              "You've hit the request limit. Please try again later.",
            );
          } else {
            setErrorText(
              "An error occurred. Please modify your description and try again.",
            );
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
    if (response && response.status.toString().startsWith("2")) {
      console.log("response");
      setErrorText("");
      const week_plan: WeekPlan = response.data;
      return week_plan;
    }
    return null;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{ width: maxWidth, minHeight: "640px", mb: 2, padding: 2 }}>
      <Grid container maxWidth={maxWidth} spacing={2} justifyContent="left">
        {!data["week_plan"] && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", margin: "0 auto" }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
              component="div"
              align="left"
              mb={2}
            >
              Describe yourself, your goals, your preferences and any
              constraints to create a custom workout plan.
            </Typography>
            <TextField
              fullWidth
              id="text-input"
              label="Enter text"
              variant="outlined"
              multiline
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              sx={{ marginBottom: 1 }}
              error={errorText !== ""}
              helperText={errorText}
              disabled={isLoading["week_plan"]}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading["week_plan"]}
            >
              {isLoading["week_plan"] ? "Generating..." : "Create Plan"}
            </Button>
            {isLoading["week_plan"] && (
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
          </Box>
        )}
        {data["week_plan"] && (
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
              {data["week_plan"].summary}
            </Typography>
            <Tabs
              value={tab_index}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {data["week_plan"].workouts.map((workout, workoutIndex) => (
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
            {data["week_plan"].workouts[tab_index] && (
              <div>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  align="left"
                >
                  {data["week_plan"].workouts[tab_index].title}
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
                  {data["week_plan"].workouts[tab_index].warm_ups.map(
                    (warmUpPlan) => (
                      <Typography
                        key={warmUpPlan.description}
                        variant="body1"
                        component="li"
                      >
                        {warmUpPlan.description}
                      </Typography>
                    ),
                  )}
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
                  {data["week_plan"].workouts[tab_index].exercises.map(
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
