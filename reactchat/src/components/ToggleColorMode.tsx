import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import createMuiTheme from "../theme/theme";
import { ColorModeContext } from "../context/DarkModeContext"

interface ToggleColorModeProps {
    children: React.ReactNode
}

const ToggleColorMode: React.FC<ToggleColorModeProps> = ({ children }) => {
    const [mode, setMode] = 
        useState<"light" | "dark">(
            () => localStorage.getItem("colorMode") as "light" | "dark"
        ) || (useMediaQuery("([prefers-color-scheme: dark") ? "dark" : "light");

        const ToggleColorMode = React.useCallback(() => {
            setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        }, []);
        
        useEffect(() => {
            localStorage.setItem("colorMode", mode);
        }, [mode]);

        const colorMode = useMemo(() => ({ToggleColorMode}), [ToggleColorMode]);

        const theme = React.useMemo(() => createMuiTheme(mode), [mode]);

        return (
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        )
}

export default ToggleColorMode;
