import * as React from "react";
import {createContext} from "react";
import MyChild from "./myChild.jsx";

const myObject = {
    name: 'arash',
    family: 'salamander',
}

export const MyContext = createContext(myObject);

export default function MyParent() {
    return (
        <MyContext.Provider value={myObject.family}>
            <MyChild />
        </MyContext.Provider>
    )
}