import { Link } from "react-router-dom";
import config from "./config.json";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Alert from "./Alert";
import './css/nav.css'
function Nav() {
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const [user, setUser] = useState(null);
    const token = Cookies.get('token');
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    useEffect(()=>{
        const getUser = async() => {
            try{    
                const response = await axios.get(`${endpoint}/user/${token}`);
                if(response.data.success){
                    setUser(response.data.usuario);
                }else{
                    openAlert("Error al cargar usuario", "Ocurrió un error inesperado al cargar el usuario", "error", "/")
                }
            }catch(error){
                openAlert("Error de conexión", "Ocurrió un error de conexión",  "error", "/");
            }
        }
        getUser();
    },[endpoint, token]);
    return (
        <>
            <nav>
                <div className="pages">
                    <Link to="/dashboard/cohortes">Cohortes</Link>
                    <Link to="/dashboard/usuarios">Usuarios</Link>
                    <Link to="/dashboard/calificaciones">Calificaciones cuatrimestrales</Link>
                    <Link to="/dashboard/grupos">Grupos</Link>
                    <Link to="/dashboard/bajas">Bajas</Link>
                    <Link to="/dashboard/BD">Base de datos</Link>
                </div>
                <div className="perfil">
                    <h2>{user ? user.nombre : ""}</h2>
                    <Link to="/perfil" id="a-perfil">
                        <img src={`${endpointImage}${user ? user.foto : ""}`} alt="Foto de perfil" id="foto-perfil" />
                    </Link>
                </div>
                
            </nav>
            <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
        </>
    );
}

export default Nav;