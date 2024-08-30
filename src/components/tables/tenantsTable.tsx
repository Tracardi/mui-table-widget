import useTenantsData, {Tenant} from "../../hooks/useTenantsData.ts";
import DataTable, {HeadCell} from "../dataTable/dataTable.tsx"
import TenantFormDialog from "../dialogs/tenant/tenantFormDialog.tsx";
import {useState} from "react";
import TenantDeleteDialog from "../dialogs/tenant/tenantDeleteDialog.tsx";

export default function TenantsTable() {

    const {data, createTenant, deleteTenant, editTenant} = useTenantsData()
    const headCells: HeadCell<Tenant>[] = [
        {
            id: "id",
            dataFormat: "string",
            disablePadding: false,
            label: "ID"
        },
        {
            id: "created",
            dataFormat: "date",
            disablePadding: false,
            label: "Created"
        },
        {
            id: "name",
            dataFormat: "string",
            disablePadding: false,
            label: "Name"
        },
        {
            id: "install_token",
            dataFormat: "string",
            disablePadding: false,
            label: "Install Token"
        },
        {
            id: "email",
            dataFormat: "string",
            disablePadding: false,
            label: "Email"
        },
        {
            id: "expire",
            dataFormat: "date",
            disablePadding: false,
            label: "Expire",
        }
    ]

    const [dialogOptions, setDialogOptions] = useState({
        open: false,
        type: ""
    })

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
    const [selectedTenantsById, setSelectedTenantsById] = useState<string[]>([])


    const onEditClick = (tenant: Tenant) => {
        setSelectedTenant(tenant)
        setDialogOptions({open: true, type: "create"})
    }

    const onCreateClick = () => {
        setSelectedTenant(null)
        setDialogOptions({open: true, type: "create"})
    }

    const onDeleteClick = () => {
        setDialogOptions({open: true, type: "delete"})
    }

    const onClose = () => {
        setDialogOptions({open: false, type: ""})
    }

    const deleteHandler = () => {
        deleteTenant(selectedTenantsById)
        setSelectedTenantsById([])
        onClose()
    }

    const crateComponent = (
        <TenantFormDialog open={dialogOptions.open && dialogOptions.type === "create"} onClose={onClose}
                          data={selectedTenant}
                          onCreate={createTenant} onEdit={editTenant}/>
    )

    const deleteComponent = (
        <TenantDeleteDialog onDelete={deleteHandler} onClose={onClose}
                            open={dialogOptions.open && dialogOptions.type === "delete"}/>
    )

    return (
        <DataTable onRowClick={onEditClick} data={data} title={"Tenants Table"} headCells={headCells}
                   createComponent={crateComponent} selected={selectedTenantsById} deleteComponent={deleteComponent}
                   setSelected={setSelectedTenantsById} onCreateClick={onCreateClick} onDeleteClick={onDeleteClick}/>
    )
}
