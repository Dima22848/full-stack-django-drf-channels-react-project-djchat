import { AppBar,Box,Drawer,IconButton,Link,Toolbar, Typography } from "@mui/material"
import {useTheme} from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";


const PrimaryAppBar = () => {
    const theme = useTheme();
    return(
        <AppBar sx={{zIndex: (theme) => theme.zIndex.drawer + 2, backgroundColor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}`}}>
            <Toolbar variant="dense" sx={{ 
                height: theme.primaryAppBar.height,
                minHeight: theme.primaryAppBar.height, 
            }}>
                <Box sx={{display: {xs: "block", sm: "none"}}}>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{mr:2}}>
                        <MenuIcon />
                    </IconButton>
                </Box>
                
                <Box>

                    <Drawer anchor="left">
                        {[...Array(100)].map((_, i) => (
                            <Typography key={i} paragraph>
                                {i + 1}
                            </Typography>
                        )}
                    </Drawer>

                </Box>

                <Link href="/" underline="none" color="black">
                    <Typography variant="h6" noWrap component="div" sx={{display:{fontWeight: 700, letterSpacing: "-0.5px"}}}>
                        DJCHAT
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    ) 
}

export default PrimaryAppBar