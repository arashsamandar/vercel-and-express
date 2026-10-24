export default async function getIp(){
    const response = await fetch("api/tests/getIp");
    const data = await response.json();
    return data
}