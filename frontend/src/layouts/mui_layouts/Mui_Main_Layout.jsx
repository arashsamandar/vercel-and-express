import * as React from "react";
import Box from "@mui/material/Box";
import MyToolbar from "./myToolbar.jsx";

export default function Mui_Main_Layout(){
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