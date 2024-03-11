import { useState } from "react";
import Alert from "./Alert";
import config from "./config.json";
import axios from "axios";
import "./css/forms.css";
import "./css/page.css";
function Recuperacion() {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const endpoint = config.endpoint;
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    };
    const openAlert = (title, message, kind, redirectRoute) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute});
        setAlertOpen(true);
    };
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Enviando email", "Espere un momento por favor", "loading");
        const data = {
            email: email,
        };
        try{
            const response = await axios.post(`${endpoint}/sendMail`, data);
            if(response.data.success === true){
                closeAlert();
                openAlert("Email enviado", "Se ha enviado un email a tu correo electrónico para recuperar tu contraseña.", "success", "/codigo/" + email);
            }else{
                openAlert("Error al enviar email", "No se ha podido enviar el email, intenta más tarde.", "error", null);
            }
        }
        catch(error){
            if(error.response !== undefined && error.response.status === 401){
                openAlert("Error al enviar email", "No se ha podido enviar el email, no existe cuenta para ese email", "error", null);
            }else{
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
    }
    return (
    <main className="formulario-main">
        <img src="/img/logo.png" alt="Logo Upemor" id="logo_upemor" />
        <form onSubmit={handleSubmit}>
            <img src="/img/user_big.png" alt="Icono de usuario" id="icon_user" />
            <h1>Restauración de contraseña</h1>
            <div className="inputForm">
                <label htmlFor="email"><img src="/img/user.png" alt="Icono de usuario" /></label>
                <input type="email" name="email" id="email" placeholder="Ingresa tu correo electrónico" onChange={(event)=>(setEmail(event.target.value))} required/>
            </div>
            <button className="login">Enviar email de recuperación</button>
        </form>
        <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
    </main>);
}

export default Recuperacion;