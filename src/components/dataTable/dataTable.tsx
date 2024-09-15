import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Paper,
    Checkbox,
    IconButton, Tooltip
} from "@mui/material"
import React, {ChangeEvent, Dispatch, ReactNode, SetStateAction, useState} from "react";
import DataTableHead from "./dataTableHead.tsx";
import DataTableToolbar from "./dataTableToolbar.tsx";
import {FaEdit} from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";

export type Order = 'asc' | 'desc';

export interface HeadCell<TData> {
    disablePadding: boolean;
    id: keyof TData;
    label: string;
    dataFormat: "string" | "numeric" | "date"
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

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


interface DataTableProps<TData> {
    onRowClick: (data: TData) => void,
    data: TData[],
    title: string,
    headCells: HeadCell<TData>[],
    createComponent: ReactNode,
    deleteComponent: ReactNode,
    onCreateClick: () => void,
    onDeleteClick: () => void,
    selected: string[],
    setSelected: Dispatch<SetStateAction<string[]>>
}

export default function DataTable<TData extends { id: string }>({
                                                                    onRowClick,
                                                                    data,
                                                                    headCells,
                                                                    title,
                                                                    createComponent,
                                                                    deleteComponent,
                                                                    onCreateClick, onDeleteClick,
                                                                    selected, setSelected
                                                                }: DataTableProps<TData>) {

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof TData>("id");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    function renderCellContent(content: TData[keyof TData]): React.ReactNode {
        if (typeof content === 'string') {
            return content;
        } else if (typeof content === 'object') {
            // Convert object to string or handle it differently depending on your needs
            return JSON.stringify(content);
        } else {
            // Handle other types if needed
            return null;
        }
    }

    function getComparator<Key extends keyof TData>(order: Order, orderBy: Key,): (
        a: TData,
        b: TData,
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof TData,) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelectClick = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (data: TData) => {
        onRowClick(data)
    }

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleData = React.useMemo(
        () =>
            stableSort(data, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, data],
    );

    return (
        <>
            <Box sx={{width: '100%'}}>
                <Paper sx={{width: '100%', mb: 2, p: 4}}>
                    <DataTableToolbar title={title} selectedRowsCount={selected.length}
                                      onDelete={onDeleteClick}
                                      onCreate={onCreateClick}/>
                    <TableContainer>
                        <Table
                            sx={{minWidth: 750}}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <DataTableHead
                                selectedRowsCount={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                                order={order}
                                orderBy={orderBy}
                                rowCount={data.length}
                                headCells={headCells}/>
                            <TableBody>
                                {visibleData.map((dataItem, index) => {
                                    const isItemSelected = isSelected(dataItem.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={dataItem.id}
                                            selected={isItemSelected}
                                            sx={{cursor: 'pointer'}}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                    onClick={(event) => handleSelectClick(event, dataItem.id)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                align="left"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {dataItem.id}
                                            </TableCell>
                                            {headCells.map(cell => {
                                                if (cell.id !== "id") {

                                                    if (cell.dataFormat === "date") {
                                                        const formattedDate = new Date(String(dataItem[cell.id])).toLocaleString()

                                                        return (
                                                            <TableCell align="left" key={cell.label}>
                                                                {formattedDate}
                                                            </TableCell>
                                                        )
                                                    }

                                                    return (
                                                        <TableCell align="left" key={cell.label}>
                                                            {renderCellContent(dataItem[cell.id])}
                                                        </TableCell>
                                                    )
                                                }
                                            })}
                                            <Tooltip title={"edit"}>
                                                <IconButton size="small" onClick={() => handleRowClick(dataItem)}>
                                                    <FaEdit/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={"delete"}
                                                     onClick={() => {
                                                         setSelected(prevState => [...prevState, dataItem.id])
                                                         onDeleteClick()
                                                     }}>
                                                <IconButton size="small">
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 53 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
            {createComponent}
            {deleteComponent}
        </>
    );
}
