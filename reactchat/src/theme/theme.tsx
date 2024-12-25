import { createTheme, responsiveFontSizes } from "@mui/material"

declare module "@mui/material/styles" {
    interface Theme {
        primaryAppBar: {
            height: number;
        };
        primaryDraw: {
            width: number;
            closed: number;
        };
        secondaryDraw: {
            width: number;
        };
    }
    
    interface ThemeOptions {
        primaryAppBar: {
            height: number;
        };
        primaryDraw: {
            width: number;
            closed: number;
        };
        secondaryDraw: {
            width: number;
        };
    }
}

export const createMuiTheme = () => {
    let theme = createTheme({
        primaryAppBar: {
            height: 50,
        },

        typography: {
            fontFamily: ["IBM Plex Sans", "serif"].join(','),
    
        },
        primaryDraw: {
            width: 240,
            closed: 70,
        },
        secondaryDraw: {
            width: 240,
        },
        components: {
            MuiAppBar: {
                defaultProps: {
                    color: "default",
                    elevation: 0,
                }
            }

        }
    });
    theme = responsiveFontSizes(theme);
    return theme;
};

export default createMuiTheme