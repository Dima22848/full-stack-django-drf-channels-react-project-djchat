import {Box, CssBaseline} from "@mui/material"
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/main";
import PopularChannels from "../components/PrimaryDraw/PopularChannels";


const Home = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />    
            <PrimaryAppBar />
            <PrimaryDraw>
                <PopularChannels />
            </PrimaryDraw>
            <SecondaryDraw />
            <Main />
        </Box>
    );
};

export default Home;