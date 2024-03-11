import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Alert from "./Alert";
import config from "./config.json";
import axios from "axios";
import { useRef } from "react";
import "./css/forms.css";
import "./css/page.css";
import "./css/codigo.css";
function Codigo() {
    const [code, setCode] = useState(0);
    const {mail} = useParams();
    const num1 = useRef(null);
    const num2 = useRef(null);
    const num3 = useRef(null);
    const num4 = useRef(null);
    const num5 = useRef(null);
    const num6 = useRef(null);
    const inputRef = useRef(null);
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
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Verificando el código", "Espera mientras se verifica el código", "loading");
        try{
            const response = await axios.post(`${endpoint}/verifyCode/${code}`, {email: mail, code: code});
            if(response.data.success){
                openAlert("Código verificado", "El código se ha verificado correctamente", "success", "/recuperar/" + response.data.token);
            }else{
                openAlert("Error al verificar el código", "El código es incorrecto", "error", null);
            }
        }catch(error){
            openAlert("Error al enviar el código", "Ocurrió un error inesperado al enviar el código", "error", null);
        }
    };
    useEffect(() => {
        console.log(code);
        if(code > 999999){
            //truncar a code a 4 digitos
            setCode(code.toString().substring(0, 4));
            inputRef.current.value = code.toString().substring(0, 4);
        }else{
            num1.current.innerHTML = code.toString().charAt(0);
            num2.current.innerHTML = code.toString().charAt(1);
            num3.current.innerHTML = code.toString().charAt(2);
            num4.current.innerHTML = code.toString().charAt(3);
            num5.current.innerHTML = code.toString().charAt(4);
            num6.current.innerHTML = code.toString().charAt(5);
        }
    }, [code]);
    return (
        <main className="formulario-main">
            <img src="/img/logo.png" alt="Logo Upemor" id="logo_upemor" />
            <h1>Reestablecer contraseña</h1>
            <form onSubmit={handleSubmit}>
                <h2>Ingresa el código de restauración enviado al mail: {mail}</h2>
                <label htmlFor="codigo" id="codigoLabel">
                    <div className="inputNumber" >
                        <p ref={num1}></p>
                    </div>
                    <div className="inputNumber" >
                        <p ref={num2}></p>
                    </div>
                    <div className="inputNumber" >
                        <p ref={num3}></p>
                    </div>
                    <div className="inputNumber" >
                        <p ref={num4}></p>
                    </div>
                    <div className="inputNumber" >
                        <p ref={num5}></p>
                    </div>
                    <div className="inputNumber" >
                        <p ref={num6}></p>
                    </div>
                </label>
                <input type="number" name="codigo" id="codigo" maxLength="4" style={{opacity: 0}} onChange={(e)=>setCode(e.target.value)} ref={inputRef} required/>
                <button className="login">Enviar código</button>
            </form>
            <Alert isOpen={alertOpen} title={alert ? alert.title : ""} message={alert ? alert.message : ""} kind={alert ? alert.kind : ""} closeAlert={closeAlert} redirectRoute={alert ? alert.redirectRoute : ""} />
        </main>
    );
}

export default Codigo;