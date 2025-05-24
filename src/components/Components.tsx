import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import NumberInputField from "./NumberInputField";
import { Routes, Route, Link } from "react-router-dom";

export default function Components() {
  return (
    <main className="App-fullpage" style={{ width: "80vw", height: "80vh" }}>
      <Paper sx={{ width: "100%", height: "100%", padding: 2 }}>
        <Routes>
          <Route
            path="/"
            element={<Typography variant="h6">Components</Typography>}
          />
          <Route
            path="/number-input-field"
            element={
              <NumberInputField
                id="test"
                label="Test"
                value="10"
                setFormData={() => {}}
                min={0}
                max={100}
              />
            }
          />
        </Routes>
        <Grid container spacing={2} columns={1}>
          <Grid>
            <Typography variant="body1">
              <Link to="number-input-field">Number Input Field</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </main>
  );
}
