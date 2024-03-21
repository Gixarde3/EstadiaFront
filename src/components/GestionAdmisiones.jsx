import Cookies from "js-cookie";
import CrearAdmisiones from "./CrearAdmisiones";
import Admisiones from "./Admisiones";
function GestionAdmisiones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Admisiones />
        <CrearAdmisiones/> 
    </>);
}

export default GestionAdmisiones;