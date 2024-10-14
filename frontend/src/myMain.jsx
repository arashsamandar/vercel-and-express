import React from "react";
import {Button} from "@mui/material";
import './assets/css/myStyles.css';
import useFetch from "./tests/utils/useFetch.jsx";

export default function MyMain() {

    const {data, loading, error} = useFetch('https://jsonplaceholder.typicode.com/todos/1');

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <Button variant="contained" color="error">
                Get Data
            </Button>
            <br/>
            {loading && <div className="bg-green-400">Loading...</div>}
            {error && <div className="bg-red-400">{error}</div>}
            {data && <div className="bg-green-700">Value: {data.title}</div>}
        </div>
    );
}