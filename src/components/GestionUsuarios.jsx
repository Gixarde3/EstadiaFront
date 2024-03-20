import Perfiles from "./Perfiles";
import Cookies from "js-cookie";
import { useState } from "react";
import Usuarios from "./Usuarios";
function GestionUsuarios() {
    const [editar, setEditar] = useState(false);
    const tipoUsuario = Cookies.get("tipoUsuario");
    return (<>
        <Usuarios />
        {
            tipoUsuario === "3" &&  <button className="login" onClick={()=>setEditar(!editar)}>Registrar usuario</button>
        }
        {
            editar === true && <Perfiles/> 
        }
    </>);
}

export default GestionUsuarios;