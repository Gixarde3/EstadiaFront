import { useState } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";
function CrearCohorte() {
    const endpoint = config.endpoint;
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
    const [periodo, setPeriodo] = useState("P");
    const [anio, setAnio] = useState(0);
    const [plan, setPlan] = useState("");
    const token = Cookies.get("token");
    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log("CX")
        openAlert("Registrando al cohorte", "Espere un momento por favor", "loading");
        const formData = new FormData();
        formData.append("periodo", periodo);
        formData.append("anio", anio);
        formData.append("plan", plan);
        formData.append("token", token);
        try{
            const response = await axios.post(endpoint + "/cohorte", formData);
            if(response.data.success){
                openAlert("Cohorte registrado", "El cohorte se registró correctamente", "success", null);
            }else{
                openAlert("Error al registrar al cohorte", "Ocurrió un error inesperado al registrar al cohorte. " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar al cohorte", "No tienes permiso para registrar al cohorte", "error", null);
            }else{
                openAlert("Error al registrar al cohorte", "Ocurrió un error inesperado al registrar al cohorte", "error", null);
            }
        }
    }
    return (
    <>
        <h2>Crear un cohorte</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="periodo">Selecciona el periodo</label>
            <select name="periodo" id="periodo" className="inputDashboard" 
                onChange={(e) => setPeriodo(e.target.value)}
            required>
                <option value="P">Primavera</option>
                <option value="O">Otoño</option>
                <option value="I">Invierno</option>
            </select>
            <label htmlFor="anio">Ingresa el año del cohorte</label>
            <input type="number" name="anio" id="anio" className="inputDashboard"
                onChange={(e) => setAnio(e.target.value)}
            required/>
            <label htmlFor="plan">Ingresa el plan del cohorte</label>
            <input type="text" name="plan" id="plan" className="inputDashboard" 
                onChange={(e) => setPlan(e.target.value)}
            required/>
            <button className="login">Registrar cohorte</button>
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

export default CrearCohorte;