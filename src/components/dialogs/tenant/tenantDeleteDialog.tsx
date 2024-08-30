import DataDialog from "../dataDialog.tsx";
import {DialogContentText} from "@mui/material";

interface ITenantDeleteDialog {
    onDelete: () => void,
    onClose: () => void,
    open: boolean,
}

export default function TenantDeleteDialog({onDelete, onClose, open}: ITenantDeleteDialog) {

    return (
        <DataDialog title={"Delete Tenant?"} open={open} onClose={onClose} onSubmit={onDelete} isForm={false}>
            <DialogContentText>
                Tenant will be deleted permanently.
            </DialogContentText>
        </DataDialog>
    )
}
