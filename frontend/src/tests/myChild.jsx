import * as React from "react";
import {useContext} from "react";
import {MyContext} from "./myParent.jsx";

export default function MyChild(){
    const name = useContext(MyContext)
    return(
        <div>
            My Child Is .... {name}
        </div>
    );
}