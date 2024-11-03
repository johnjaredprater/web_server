import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { CurrentUserContext } from "./App";
import {
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { baseUrl, Exercise } from "./Home";

type ExerciseTableProps = {
  maxWidth: number;
};

function ExercisesTable(props: ExerciseTableProps) {
  const pageWidth = props.maxWidth;
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: pageWidth, maxWidth: pageWidth }} size="small">
        <TableHead>
          <TableRow>
            {/* <TableCell>Id</TableCell> */}
            <TableCell>Name</TableCell>
            <TableCell>Video</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises &&
            exercises.map((exercise) => (
              <TableRow
                key={exercise.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {/* <TableCell component="th" scope="row">
                  {exercise.id}
                </TableCell> */}
                <TableCell>{exercise.name}</TableCell>
                <TableCell>
                  <a
                    href={exercise.video_link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <SvgIcon
                      fontSize="small"
                      style={{
                        verticalAlign: "middle",
                        marginRight: 8,
                      }}
                    >
                      <OpenInNewIcon />
                    </SvgIcon>
                  </a>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExercisesTable;
