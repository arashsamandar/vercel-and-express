import * as React from "react";
import {useEffect} from "react";

export default function MyApp(){

    useEffect(()=>{
        alert('Hello Solomon');
       document.body.style.backgroundColor = "grey";
    });

    return(
        <div style={{ backgroundColor:"green" }}>
            <h1>Hello Arash Solomon</h1>
        </div>
    )
}