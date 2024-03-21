import Cookies from "js-cookie";
import CrearCohorte from "./CrearCohorte";
import Cohortes from "./Cohortes";
function GestionCohortes() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
    <Cohortes />
        {
           tipoUsuario >= 2 ? <CrearCohorte/> : <></>
        }
    </>);
}

export default GestionCohortes;