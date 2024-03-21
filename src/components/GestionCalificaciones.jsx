import Cookies from "js-cookie";
import CrearCalificaciones from "./CrearCalificaciones";
import Calificaciones from "./Calificaciones";
function GestionCalificaciones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Calificaciones />
        <CrearCalificaciones/>
    </>);
}

export default GestionCalificaciones;