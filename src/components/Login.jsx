import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/forms.css";
import "./css/page.css";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (
        <main>
            <img src="/img/logo.png" alt="Logo Upemor" id="logo_upemor" />
            <form>
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
        </main>
    );
}

export default Login;