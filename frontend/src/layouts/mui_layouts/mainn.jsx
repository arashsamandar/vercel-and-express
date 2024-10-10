import * as React from "react";
import Box from "@mui/material/Box";
import MyToolbar from "./myToolbar.jsx";

export default function Mainn(){
    return (
        <Box sx={{
            backgroundColor: 'gray',
            height: '100vh',
            width: '80vw',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column'}}>

        <MyToolbar />

        </Box>
    );
}