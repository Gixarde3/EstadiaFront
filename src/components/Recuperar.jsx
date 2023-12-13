import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Alert from "./Alert";
import config from "./config.json";
import axios from "axios";
import "./css/forms.css";
import "./css/page.css";
function Recuperar() {
    const {hash} = useParams();
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordVerification, setNewPasswordVerification] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordVerification, setShowPasswordVerification] = useState(false);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const endpoint = config.endpoint;
    useEffect(() => {
        const verifyHash = async() => {
            try{
                const response = await axios.post(`${endpoint}/verifyHash/${hash}`);
                if(!response.data.success){
                    openAlert("Error al verificar hash", "El hash no es válido o ha expirado.", "error", "/");
                }
            }catch(error){
                if(error.response !== undefined && error.response.status === 401){
                    openAlert("Error al verificar hash", "El hash no es válido o ha expirado.", "error", "/");
                }
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", "/");
            }
        };
        verifyHash();
    }, [hash, endpoint]);
    const handleSubmit = async(event) => {
        event.preventDefault();
        if(newPassword !== newPasswordVerification){
            openAlert("Error al cambiar contraseña", "Las contraseñas no coinciden.", "error", null);
            return;
        }
        openAlert("Cambiando contraseña", "Espere un momento por favor", "loading");
        const data = {
            password: newPassword
        };
        try{
            const response = await axios.post(`${endpoint}/restorePassword/${hash}`, data);
            if(response.data.success === true){
                closeAlert();
                openAlert("Contraseña cambiada", "Se ha cambiado la contraseña correctamente.", "success", "/");
            }else{
                openAlert("Error al cambiar contraseña", "No se ha podido cambiar la contraseña, intenta más tarde.", "error", null);
            }
        }
        catch(error){
            if(error.response !== undefined && error.response.status === 401){
                openAlert("Error al cambiar contraseña", "No se ha podido cambiar la contraseña, el hash no es válido o ha expirado.", "error", null);
            }else{
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
    };
    return (
        <main>
            <img src="/img/logo.png" alt="Logo Upemor" id="logo_upemor" />
            <form onSubmit={handleSubmit}>
                <img src="/img/user_big.png" alt="Icono de usuario" id="icon_user" />
                <h1>Cambio de contraseña</h1>
                <div className="inputForm">
                    <label htmlFor="email"><img src="/img/icon_pass.png" alt="Icono de contraseña" /></label>
                    <input type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Ingresa tu contraseña" onChange={(event)=>(setNewPassword(event.target.value))}required/>
                    <button type="button" onClick={() => (setShowPassword(!showPassword))}><img src={`/img/${showPassword ? "ver.png" : "no_ver.png"}`} alt="Icono para cambiar visibilidad" /></button>
                </div>
                <div className="inputForm">
                    <label htmlFor="email"><img src="/img/icon_pass.png" alt="Icono de contraseña" /></label>
                    <input type={`${showPasswordVerification ? "text" : "password"}`} name="password" id="password" placeholder="Reingresa tu contraseña" onChange={(event)=>(setNewPasswordVerification(event.target.value))}required/>
                    <button type="button" onClick={() => (setShowPasswordVerification(!showPasswordVerification))}><img src={`/img/${showPasswordVerification ? "ver.png" : "no_ver.png"}`} alt="Icono para cambiar visibilidad" /></button>
                </div>
                <button className="login">Cambiar contraseña</button>
            </form>
            <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
        </main>
    );
}

export default Recuperar;