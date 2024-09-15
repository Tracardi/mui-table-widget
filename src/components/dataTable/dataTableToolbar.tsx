import {Toolbar, alpha, Typography, Tooltip, IconButton, Button} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete";

interface DataTableToolbarProps {
    title: string;
    selectedRowsCount: number;
    onDelete: () => void;
    onCreate: () => void;
}

export default function DataTableToolbar({title, selectedRowsCount, onDelete, onCreate}: DataTableToolbarProps) {

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(selectedRowsCount > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {selectedRowsCount > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {selectedRowsCount} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {selectedRowsCount > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={onDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            )}
            <Button onClick={onCreate} variant="contained" sx={{mx: 2, py: 0.6}}>Create</Button>
        </Toolbar>
    );
}
