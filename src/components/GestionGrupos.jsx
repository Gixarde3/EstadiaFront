import Cookies from "js-cookie";
import CrearCohorte from "./CrearCohorte";
import Grupos from "./Grupos";
import CrearGrupo from "./CrearGrupo";
function GestionGrupos() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Grupos />
        <CrearGrupo/>
    </>);
}

export default GestionGrupos;