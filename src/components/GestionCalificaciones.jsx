import Cookies from "js-cookie";
import CrearCalificaciones from "./CrearCalificaciones";
import Calificaciones from "./Calificaciones";
function GestionCalificaciones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Calificaciones />
        {
           tipoUsuario === "3" ? <CrearCalificaciones/> : <></>
        }
    </>);
}

export default GestionCalificaciones;