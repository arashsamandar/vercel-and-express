import React, {useState} from "react";

async function loadData(){
    const [dataOne, dataTwo] = await Promise.all([
        fetch('/api/tests/getIp').then((res) => res.json()).catch(() => ({ip:'0.0.0.0'})),
        fetch('/api/tests/playground').then((res) => res.json()).catch(()=>({ip:'arash', family:'samandar'})),
    ])
}

export default function PlayGround() {

    return (
        <>
        </>
    )
}