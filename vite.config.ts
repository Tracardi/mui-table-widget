import path from "node:path";
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({tsconfigPath: "./tsconfig.app.json", rollupTypes: true})],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'mui-table-widget',
            fileName: 'mui-table-widget',
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "@mui/material", "@mui/icons-material",
                "@emotion/react",
                "@emotion/styled", "@mui/utils"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    }
})
