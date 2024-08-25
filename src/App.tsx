import {useState} from "react";
import {lightTheme, darkTheme} from "./lib/theme.ts";
import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import TenantsTable from "./components/tables/tenantsTable.tsx";

export default function App() {

    const [theme,] = useState<"light" | "dark">("dark")

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <CssBaseline/>
            <Container sx={{py: 4, minWidth: "1400px"}}>
                <TenantsTable/>
            </Container>
        </ThemeProvider>
    )
}
