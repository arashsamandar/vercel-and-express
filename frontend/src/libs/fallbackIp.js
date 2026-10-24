export const fallbackIp = {
    localhost: {
        message: "Localhost was Detected",
        latitude: 33,
        longitude: 54,
        country_name: "Localhost",
        city: "Salamander Home",
        ip: "127.0.0.1"
    },
    ipError: {
        ip: "0.0.0.0",
    },
    ipApiError: {
        latitude: null,
        longitude: null,
        country_name: null,
        city: null
    }
}