import axios from "axios";
import { baseUrl, ExerciseResult } from "./Home";

export async function getExerciseResults(
  accessToken: string | undefined,
): Promise<ExerciseResult[]> {
  if (!accessToken) return [];

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
    return response.data;
  }
  return [];
}
