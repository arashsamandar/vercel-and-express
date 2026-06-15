import {useEffect, useState} from "react";
import {ipData} from "../utils/ipData.js";

export default function useIp() {
    const [ip, setIp] = useState({});

    useEffect(() => {
        const fetchIp = async () => {
            if(ipData.data) {
                setIp(ipData.data);
                return;
            }
            console.log("fetch ip started again");
            if(localStorage.getItem("PC_ID") === "771a4fc0-c417-4800-a64d-d0558abf0993") {
                ipData.data = {message: "Localhost was Detected", latitude: 33, longitude: 54, country_name: "Localhost", city: "Salamander Home", ip: "127.0.0.1"};
                setIp(ipData.data);
                return;
            }
            const json1 = await fetch("/api/tests/getIp")
                .then(res => res.json())
                .catch(err => {
                    console.error("Internal IP fetch failed", err);
                    return { ip: "0.0.0.0" }; // Fallback value
                });
            const json2 = await fetch("https://ipapi.co/json/")
                .then(res => res.json())
                .catch(err => {
                    console.error("External Geo fetch failed", err);
                    return { latitude: 51, longitude: 41, country_name: "Location", city: "Is Unknown" }; // Fallback
                });
            ipData.data = {
                ip: json1?.ip ?? "0.0.0.0",
                latitude: json2?.latitude ?? 51,
                longitude: json2?.longitude ?? 41,
                country_name: json2?.country_name ?? "Unknown",
                city: json2?.city ?? "Unknown",
            };
            setIp(ipData.data);
        }
        fetchIp();
    }, []);

    return ip;
}