import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { useContext, useEffect, useState } from "react";
import { Workout } from "./Home";
import { format } from "date-fns";
import { CurrentUserContext } from "./App";
import axios from "axios";

interface Data {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
  rpe: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "exercise",
    numeric: false,
    disablePadding: true,
    label: "Exercise",
  },
  {
    id: "weight",
    numeric: true,
    disablePadding: true,
    label: "Weight",
  },
  {
    id: "reps",
    numeric: true,
    disablePadding: true,
    label: "Reps",
  },
  {
    id: "sets",
    numeric: true,
    disablePadding: true,
    label: "Sets",
  },
  {
    id: "rpe",
    numeric: true,
    disablePadding: false,
    label: "RPE",
  },
];

interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          // padding="checkbox"
          padding="none"
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all workouts",
            }}
            size="small"
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ whiteSpace: "nowrap" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  selected: readonly string[];
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>;
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selected, setSelected } = props;
  const userContext = useContext(CurrentUserContext);

  const handleDelete = async () => {
    const accessToken = await userContext?.user?.getIdToken();
    const promises = selected.map(async (tableRow) => {
      console.log(`Deleting Workout ${tableRow}`);
      await axios
        // .delete(`http://localhost:8000/api/workouts/${tableRow}`, {
        .delete(`https://gym.johnprater.me/api/workouts/${tableRow}`, {
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
    });
    await Promise.all(promises);

    setSelected([]);

    props.incrementWorkoutsModified(props.workoutsModified + 1);
  };

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Workouts
        </Typography>
      )}
      {selected.length > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}

interface EnhancedTableProps {
  workoutsModified: number;
  incrementWorkoutsModified: React.Dispatch<React.SetStateAction<number>>;
}

export default function WorkoutTable(props: EnhancedTableProps) {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getTableData = async () => {
    const accessToken = await userContext?.user?.getIdToken();
    const response = await axios
      // .get("http://localhost:8000/api/workouts", {
      .get("https://gym.johnprater.me/api/workouts", {
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
      const workouts: Workout[] = response.data;
      return workouts.map((workout) => {
        const tableRow = {
          id: workout.id,
          date: workout.updated_at,
          exercise: workout.exercise.name,
          weight: workout.weight,
          reps: workout.reps,
          sets: workout.sets,
          rpe: workout.rpe ? workout.rpe : 0,
        };
        return tableRow;
      });
    }
    return [];
  };

  const [tableData, updateTableData] = useState<Data[]>([]);
  const userContext = useContext(CurrentUserContext);

  useEffect(() => {
    const update = async () => {
      updateTableData(await getTableData());
    };
    update();
  }, [userContext, props.workoutsModified]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = tableData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...tableData]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, tableData],
  );

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <EnhancedTableToolbar
        selected={selected}
        setSelected={setSelected}
        workoutsModified={props.workoutsModified}
        incrementWorkoutsModified={props.incrementWorkoutsModified}
      />
      <TableContainer>
        <Table aria-labelledby="tableTitle" size={"small"}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={tableData.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = selected.includes(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    // padding="checkbox"
                    padding="none"
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    // padding="none"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {format(new Date(row.date), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell
                    padding="none"
                    sx={{ whiteSpace: "nowrap" }}
                    align="left"
                  >
                    {row.exercise}
                  </TableCell>
                  <TableCell
                    padding="none"
                    sx={{ whiteSpace: "nowrap" }}
                    align="right"
                  >
                    {`${row.weight} kg`}
                  </TableCell>
                  <TableCell
                    padding="none"
                    sx={{ whiteSpace: "nowrap" }}
                    align="right"
                  >
                    {row.sets}
                  </TableCell>
                  <TableCell
                    padding="none"
                    sx={{ whiteSpace: "nowrap" }}
                    align="right"
                  >
                    {row.reps}
                  </TableCell>
                  <TableCell
                    padding="normal"
                    sx={{ whiteSpace: "nowrap" }}
                    align="right"
                  >
                    {row.rpe}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
