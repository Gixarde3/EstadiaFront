import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";

function CrearCalificaciones() {
    const endpoint = config.endpoint;
    const [archivo, setArchivo] = useState(null);
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [periodo, setPeriodo] = useState("P");
    const [anio, setAnio] = useState(0);
    const [carrera, setCarrera] = useState("");
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }

    const handleFileUpload = (e) => {
        try{
            setArchivo(e.target.files[0]);
        }catch(error){
            openAlert("Error al subir el archivo", "Ocurrió un error inesperado al subir el archivo", "error", null);
        }
    };
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo las calificaciones", "Espere un momento por favor", "loading");
        const token = Cookies.get("token");
        try{    
            const formData = new FormData();
            formData.append("archivo", archivo);
            formData.append("token", token);
            formData.append("periodo", periodo);
            formData.append("anio", anio);
            formData.append("carrera", carrera)
            const response = await axios.post(endpoint + "/calificacion", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                }
            });
            if(response.data.success){
                openAlert("Calificaciones registradas", "Las calificaciones se registraron correctamente", "success", null);
            }else{
                openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones: " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar las calificaciones", "No tienes permiso para registrar las calificaciones", "error", null);
            }else{
                openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Subir calificaciones</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="periodo">Selecciona el periodo</label>
            <select name="periodo" id="periodo" className="inputDashboard" 
                onChange={(e) => setPeriodo(e.target.value)}
                value={periodo}
            required>
                <option value="P">Primavera</option>
                <option value="O">Otoño</option>
                <option value="I">Invierno</option>
            </select>
            <label htmlFor="anio">Ingresa el año</label>
            <input type="number" name="anio" id="anio" className="inputDashboard"
                onChange={(e) => setAnio(e.target.value)}
                value={anio}
            required/>
            <label htmlFor="carrera">Ingresa la carrera de estas calificaciones</label>
            <select type="text" name="carrera" id="carrera" className="inputDashboard" 
                onChange={(e) => setCarrera(e.target.value)}
                value={carrera}
            required>
                <option value="">Selecciona una carrera</option>
                <option value="ITI">Ingeniería en Tecnologías de la Información</option>
                <option value="IBT">Ingeniería en Biotecnología</option>
                <option value="IET">Ingeniería Electrónica y Telecomunicaciones</option>
                <option value="LAE">Licenciatura en Administración y Gestión empresarial</option>
                <option value="IIN">Ingeniería industrial</option>
                <option value="IFI">ingeniería financiera</option>
            </select>
            <label htmlFor="Archivo" className="login" style={{marginBottom: "1rem"}}>Selecciona el archivo</label>
            <input type="file" name="Archivo" id="Archivo" className="inputDashboard" 
                onChange={handleFileUpload} style={{display: "none"}}
            required/>
            {
                archivo ? <p style={{marginBottom: "1rem"}}>Archivo seleccionado: {archivo.name}</p> : null
            }
            <button className="login">Subir calificaciones</button>
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
    </>);
}

export default CrearCalificaciones;