import getPCId from "../libs/localStorage.js";
import getIp from "../services/backend/getIp.js";
import {fallbackIp} from "../libs/fallbackIp.js";
import getIpApi from "../services/ipapi/ipapi.js";


export default async function loadIp() {
    if (getPCId("771a4fc0-c417-4800-a64d-d0558abf0993"))
        return fallbackIp.localhost;

    const [json1, json2] = await Promise.all([
        getIp().catch((err) => {
            console.error("Internal IP fetch failed", err);
            return fallbackIp.ipError;
        }),
        getIpApi().catch((err) => {
            console.error("External IP fetch failed", err);
            return fallbackIp.ipApiError;
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