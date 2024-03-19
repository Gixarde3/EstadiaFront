import { useState } from "react";
import config from "./config.json";
import Cookies from "js-cookie";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
function Register() {
    const endpointLocal = config.endpointLocal;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [noEmp, setNoEmp] = useState(0);
    const [nombre, setNombre] = useState("");
    const [apP, setApP] = useState("");
    const [apM, setApM] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); 
    const [tipoUsuario, setTipoUsuario] = useState(0); // 1: Director, 2: Profesor/Coordinador, 3: Administrador
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
    const endpoint = config.endpoint;
    const handleImageUpload = (e) => {
        try{
            const selectedImage = e.target.files[0];
            setImageFile(e.target.files[0]);
            setImage(URL.createObjectURL(selectedImage));
        }catch(error){
            openAlert("Error al subir la imagen", "Ocurrió un error inesperado al subir la imagen", "error", null);
        }
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(password !== passwordConfirm){
            openAlert("Error al registrar al usuario", "Las contraseñas no coinciden.", "error", null);
            return;
        }
        openAlert("Registrando al usuario", "Espere un momento por favor", "loading");
        const cookie = Cookies.get('token');
        event.preventDefault();
        const formData = new FormData();
        formData.append("noEmp", noEmp);
        formData.append("nombre", nombre);
        formData.append("apP", apP);
        formData.append("apM", apM);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("foto", imageFile);
        formData.append("tipoUsuario", 0);
        formData.append("token", cookie);
        try{
            const response = await axios.post(`${endpoint}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                }
            });
            if(response.data.success === true){
                closeAlert();
                openAlert("Usuario registrado", "Se ha registrado el usuario correctamente, espera a que un administrador autorice tu acceso", "success", "/");
            }else{
                openAlert("Error al registrar al usuario", "No se ha podido registrar al usuario, intenta más tarde." + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response !== undefined && error.response.status === 401){
                openAlert("Error al registrar al usuario", "No se ha podido registrar al usuario, intenta más tarde.", "error", null);
            }
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }

    }
    return (
        <main className="formulario-main">
            <img src="/img/logo.png" alt="Logo Upemor" id="logo_upemor" />
            <h2>Registrar usuario</h2>
            <form className="dashboardForm" onSubmit={handleSubmit}>
                <label htmlFor="">Ingresa su foto de perfil</label>
                <div className="testimonial-foto" style={!image ? {
                            border: '2px solid black'
                        } : {}}>
                    <label htmlFor="profileFoto" className="label-photo">
                        <img src={image ? image : `${endpointLocal}img/img_defecto.webp`} alt="Preview Face of testimonial creator" 
                            data-tooltip-id='tooltip'
                            data-tooltip-content='Añadir foro de perfil'
                            data-tooltip-place='top'
                        />
                        <div className="hover-testimonial">
                            <img src={`${endpointLocal}img/change_photo.webp`} alt="Change foto icon " />
                        </div>
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} id="profileFoto" className="file" required/>
                </div>
                <label htmlFor="noEmp">Número de empleado</label>
                <input type="number" id="noEmp" placeholder="Ingresa el número de empleado" className="inputDashboard" 
                    onChange={(event)=>setNoEmp(event.target.value)}required
                />
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" placeholder="Ingresa el nombre del empleado" className="inputDashboard"
                    onChange={(event)=>setNombre(event.target.value)}required
                />
                <label htmlFor="apP">Apellido Paterno</label>
                <input type="text" name="apP" id="apP" className="inputDashboard"placeholder="Ingresa su apellido paterno" 
                    onChange={(event)=>setApP(event.target.value)}required
                />
                <label htmlFor="apM">Apellido Materno</label>
                <input type="text" name="apM" id="apM" className="inputDashboard"placeholder="Ingresa su apellido materno" 
                    onChange={(event)=>setApM(event.target.value)}required
                />
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" name="email" id="email" className="inputDashboard"placeholder="Ingresa su correo electrónico" 
                    onChange={(event)=>setEmail(event.target.value)}required
                />
                <label htmlFor="">Ingresa su contraseña</label>
                <div className="inputForm">
                    <label htmlFor="password"><img src="/img/icon_pass.png" alt="Icono de contraseña" /></label>
                    <input type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="Ingresa su contraseña" onChange={(event)=>setPassword(event.target.value)}required/>
                    <button type="button" onClick={() => (setShowPassword(!showPassword))}><img src={`/img/${showPassword ? "ver.png" : "no_ver.png"}`} alt="Icono para cambiar visibilidad" /></button>
                </div>
                <label htmlFor="">Confirma su contraseña</label>
                <div className="inputForm">
                    <label htmlFor="passwordVerification"><img src="/img/icon_pass.png" alt="Icono de contraseña" /></label>
                    <input type={`${showPasswordConfirm ? "text" : "password"}`} name="password" id="passwordVerification" placeholder="Reingresa tu contraseña" onChange={(event)=>setPasswordConfirm(event.target.value)} required/>
                    <button type="button" onClick={() => (setShowPasswordConfirm(!showPasswordConfirm))}><img src={`/img/${showPasswordConfirm ? "ver.png" : "no_ver.png"}`} alt="Icono para cambiar visibilidad" /></button>
                </div>
                <button className="login">Registrarse</button>
            </form>
            <Alert 
                isOpen={alertOpen}
                title={alert ? alert.title : ""}
                message={alert ? alert.message : ""}
                kind={alert ? alert.kind : ""}
                closeAlert={closeAlert}
                redirectRoute={alert ? alert.redirectRoute : ""}
                asking={alert ? alert.asking : false}
                onAccept={alert ? alert.onAccept : null}
            />
        </main>
    )
}
export default Register;