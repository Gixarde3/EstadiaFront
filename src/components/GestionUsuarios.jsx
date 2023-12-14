import Perfiles from "./Perfiles";
import Cookies from "js-cookie";
import Usuarios from "./Usuarios";
function GestionUsuarios() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Usuarios />
        {
           tipoUsuario === "3" ? <Perfiles/> : <></>
        }
    </>);
}

export default GestionUsuarios;