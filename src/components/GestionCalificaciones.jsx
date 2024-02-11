import Cookies from "js-cookie";
import CrearCalificaciones from "./CrearCalificaciones";
function GestionCalificaciones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        {
           tipoUsuario === "3" ? <CrearCalificaciones/> : <></>
        }
    </>);
}

export default GestionCalificaciones;