import * as React from "react";
import {TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box} from "@mui/material"
import {visuallyHidden} from "@mui/utils";
import {Order} from "./dataTable.tsx";
import {ChangeEvent} from "react";
import {HeadCell} from "./dataTable.tsx";

interface DataTableHeadProps<TData> {
    selectedRowsCount: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TData) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: keyof TData;
    rowCount: number;
    headCells: HeadCell<TData>[]
}

export default function DataTableHead<TData>({
                                                 headCells,
                                                 orderBy,
                                                 order,
                                                 onSelectAllClick,
                                                 selectedRowsCount,
                                                 rowCount,
                                                 onRequestSort
                                             }: DataTableHeadProps<TData>) {

    const createSortHandler =
        (property: keyof TData) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={selectedRowsCount > 0 && selectedRowsCount < rowCount}
                        checked={rowCount > 0 && selectedRowsCount === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={index}
                        align={headCell.dataFormat === "numeric" ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
