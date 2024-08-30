import {useState} from "react";

export interface Tenant {
    id: string,
    created: string,
    name: string,
    install_token: string,
    email: string,
    expire: string
}

export default function useTenantsData() {

    const [data, setData] = useState<Tenant[]>([
        {
            "id": "2345a",
            "created": "2024-05-15 10:54:03",
            "name": "Home1",
            "install_token": "4324-4321-32312",
            "email": "abcd@abcd.pl",
            "expire": "2025-05-31T10:00:00"
        },
    ])

    const createTenant = (tenant: Tenant) => {
        setData(prevState => [...prevState, tenant])
        console.log(tenant)
    }

    const deleteTenant = (idArr: string[]) => {
        setData(prevState => prevState.filter(tenant => !idArr.includes(tenant.id)))
    }

    const editTenant = (updatedTenant: Tenant) => {
        setData(prevState => prevState.map(currentTenant => currentTenant.id === updatedTenant.id ? updatedTenant : currentTenant))
    }

    return {data, createTenant, deleteTenant, editTenant}
}
