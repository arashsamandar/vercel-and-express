import { useEffect, useState } from "react";
import { ipData } from "../utils/ipData.js";

async function loadIp() {
    if (localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf09") {
        return { message: "Localhost was Detected", latitude: 33, longitude: 54, country_name: "Localhost", city: "Salamander Home", ip: "127.0.0.1" };
    }

    const [json1, json2] = await Promise.all([
        fetch("/api/tests/getIp")
            .then(res => res.json())
            .catch(err => {
                console.error("Internal IP fetch failed", err);
                return { ip: "0.0.0.0" };
            }),
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .catch(err => {
                console.error("External Geo fetch failed", err);
                return { latitude: null, longitude: null, country_name: null, city: null };
            }),
    ]);

    return {
        ip: json1?.ip ?? "0.0.0.0",
        latitude: json2.latitude,
        longitude: json2.longitude,
        country_name: json2.country_name,
        city: json2.city,
    };
}

export default function useIp() {
    const [ip, setIp] = useState(ipData.data ?? {});

    useEffect(() => {
        let cancelled = false;

        if (ipData.data) {
            setIp(ipData.data);
            return;
        }

        // First caller creates the promise; everyone else reuses it
        if (!ipData.promise) {
            ipData.promise = loadIp().then(data => {
                ipData.data = data;
                return data;
            });
        }

        ipData.promise.then(data => {
            if (!cancelled) setIp(data);
        });

        return () => { cancelled = true; };
    }, []);

    return ip;
}