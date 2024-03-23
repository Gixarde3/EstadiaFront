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
    const endpointLocal = config.endpointLocal;
    const [user, setUser] = useState(null);
    const token = Cookies.get('token');
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [optionsOpened, setOptionsOpened] = useState(false);
    const [notificacionesPendientes, setNotificacionesPendientes] = useState(0);
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
    const logout = ()=>{
        Cookies.remove('token');
        Cookies.remove('tipoUsuario');
        Cookies.remove('email');
        window.location.href = "/";
    }
    useEffect(()=>{
        const expirationTime = new Date(new Date().getTime() + 15 * 60 * 1000);
        Cookies.set("token", Cookies.get("token"), { expires: expirationTime });
        Cookies.set("email", Cookies.get("email"), { expires: expirationTime });
        Cookies.set("tipoUsuario", Cookies.get("tipoUsuario"), { expires: expirationTime });   
    });
    const getNotificacionesPendientes = async () => {
        const response = await axios.get(`${endpoint}/notificaciones/pendientes/${Cookies.get('token')}`);
        console.log("Obteniendo notis");
        console.log(response.data);
        if(response.data.success){
            setNotificacionesPendientes(response.data.cantidad);
        }
    }
    useEffect(()=>{
        console.log(notificacionesPendientes);
    }, [notificacionesPendientes])
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
        getNotificacionesPendientes();
    },[endpoint, token]);
    return (
        <>
            <nav>
                
                <div className={`pages ${optionsOpened ? 'open' : ''}`}>
                    <Link to="/dashboard/usuarios">Usuarios</Link>
                    <Link to="/dashboard/cohortes">Cohortes</Link>
                    <Link to="/dashboard/calificaciones">Calificaciones cuatrimestrales</Link>
                    <Link to="/dashboard/grupos">Grupos</Link>
                    <Link to="/dashboard/bajas">Bajas</Link>
                    <Link to="/dashboard/admisiones">Admisiones</Link>
                    <Link to="/dashboard/BD">Base de datos</Link>
                    <Link to="/dashboard/bajasGraficas">Graficas de las bajas</Link>
                    <Link to="/dashboard/admisionesGraficas">Graficas de las admisiones</Link>
                    <Link to="/dashboard/notificaciones" style={notificacionesPendientes > 0 ? {fontWeight: "bold"} : {}}>Notificaciones {((notificacionesPendientes > 0) ? "(" + notificacionesPendientes + ")" : "")}</Link>
                </div>
                <button id="button-down" onClick={()=>setOptionsOpened(!optionsOpened)}><img src={`${endpointLocal}img/flecha_abajo.png`} className={`${optionsOpened ? 'open' : ''}`}/></button>
                <div className="perfil">
                    <h2>{user ? user.nombre : ""} ({tiposUsuarios[Cookies.get("tipoUsuario")]})</h2>
                    <button
                     id="a-perfil">
                        <img src={`${endpointImage}${user ? user.foto : ""}`} alt="Foto de perfil" id="foto-perfil" />
                    </button>
                </div>
            </nav>
            <aside id="opciones">
                <h2>Menú</h2>
                    <Link to="/dashboard/usuarios">Usuarios</Link>
                    <Link to="/dashboard/cohortes">Cohortes</Link>
                    <Link to="/dashboard/calificaciones">Calificaciones cuatrimestrales</Link>
                    <Link to="/dashboard/grupos">Grupos</Link>
                    <Link to="/dashboard/bajas">Bajas</Link>
                    <Link to="/dashboard/admisiones">Admisiones</Link>
                    <Link to="/dashboard/BD">Base de datos</Link>
                    <Link to="/dashboard/bajasGraficas">Graficas de las bajas</Link>
                    <Link to="/dashboard/admisionesGraficas">Graficas de las admisiones</Link>
                    <Link to="/dashboard/notificaciones" style={notificacionesPendientes > 0 ? {fontWeight: "bold"} : {}}>Notificaciones {((notificacionesPendientes > 0) ? "(" + notificacionesPendientes + ")" : "")}</Link>
                    <Link onClick={()=>logout()} style={{
                        fontWeight: "bold",
                    }}>Cerrar sesión</Link>
            </aside>
            <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
            
        </>
    );
}

export default Nav;