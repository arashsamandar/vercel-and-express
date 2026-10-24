export default function getPCId(value) {
    let pcId = localStorage.getItem("PC_ID");
    return ( pcId === value );
}