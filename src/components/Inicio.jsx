import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
function Inicio() {
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [user, setUser] = useState(null);
    const token = Cookies.get('token');
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [optionsOpened, setOptionsOpened] = useState(false);
    const tiposUsuarios = [
        "Usuario sin acceso",
        "Director",
        "Profesor/Coordinador",
        "Administrador"
    ];
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
            <h1 style={{fontSize: '3rem'}}>Bienvenid@ {user ? user.nombre : ""} ({tiposUsuarios[Cookies.get("tipoUsuario")]})</h1>
            <Alert 
                 isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} 
            />
        </>
    );
}

export default Inicio;