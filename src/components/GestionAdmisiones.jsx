import Cookies from "js-cookie";
import CrearAdmisiones from "./CrearAdmisiones";
import Admisiones from "./Admisiones";
function GestionAdmisiones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Admisiones />
        {
           tipoUsuario === "3" ? <CrearAdmisiones/> : <></>
        }
    </>);
}

export default GestionAdmisiones;