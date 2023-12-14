import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Alert from "./Alert";
import config from "./config.json";
import axios from "axios";
import "./css/forms.css";
import "./css/page.css";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
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
        openAlert("Iniciando sesión", "Espere un momento por favor", "loading");
        const data = {
            email: email,
            password: password,
        };
        try{
            const response = await axios.post(`${endpoint}/login`, data);
            if(response.data.success === true){
                Cookies.set("token", response.data.token, { expires: 1 });
                Cookies.set("email", response.data.email, { expires: 1 });
                Cookies.set("tipoUsuario", response.data.tipoUsuario, { expires: 1 });
                closeAlert();
                navigate("/dashboard");
            }else{
                openAlert("Inicio de sesión fallido", "Los datos ingresados no son correctos, prueba con otra contraseña o usuario.", "error", null);
            }
        }catch(error){
            if(error.response !== undefined && error.response.status === 401){
                openAlert("Inicio de sesión fallido", "Los datos ingresados no son correctos, prueba con otra contraseña o usuario.", "error", null);
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
                <h1>Inicio de sesión</h1>
                <div className="inputForm">
                    <label htmlFor="email"><img src="/img/user.png" alt="Icono de usuario" /></label>
                    <input type="email" name="email" id="email" placeholder="Ingresa tu correo electrónico" onChange={(event)=>(setEmail(event.target.value))} required/>
                </div>
                <div className="inputForm">
                    <label htmlFor="email"><img src="/img/icon_pass.png" alt="Icono de contraseña" /></label>
                    <input type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Ingresa tu contraseña" onChange={(event)=>(setPassword(event.target.value))}required/>
                    <button type="button" onClick={() => (setShowPassword(!showPassword))}><img src={`/img/${showPassword ? "ver.png" : "no_ver.png"}`} alt="Icono para cambiar visibilidad" /></button>
                </div>
                <p>¿Olvidaste tu contraseña?<Link to="/recuperacion">Recupérala dando clic aquí</Link></p>
                <button className="login">Iniciar sesión</button>
            </form>
            <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
        </main>
    );
}

export default Login;