import Cookies from "js-cookie";
import CrearBajas from "./CrearBajas";
import Bajas from "./Bajas";
function GestionBajas() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (
        
    <>
        <Bajas/>
        {tipoUsuario === "3" ? <CrearBajas/> : <></>}
    </>);
}

export default GestionBajas;