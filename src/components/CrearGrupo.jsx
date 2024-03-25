import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";

function CrearGrupo() {
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [periodo, setPeriodo] = useState("P");
    const [clave, setClave] = useState("");
    const [nombre, setNombre] = useState("");
    const [letra, setLetra] = useState("A");
    const [grado, setGrado] = useState(0);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo el grupo", "Espere un momento por favor", "loading");
        const token = Cookies.get("token");
        try{
            const formData = new FormData();
            formData.append("clave", clave);
            formData.append("nombre", nombre);
            formData.append("letra", letra);
            formData.append("periodo", periodo);
            formData.append("grado", grado);
            formData.append("token", token);
            const response = await axios.post(endpoint + "/grupo", formData);
            if(response.data.success){
                openAlert("Grupo registradas", "El grupo se registraron correctamente", "success", null);
            }else{
                openAlert("Error al registrar el grupo", "Ocurrió un error inesperado al registrar el grupo: " + response.data.message, "error", null);
            }
        }catch(error){
            console.log(error);
            if(error.response.status === 401){
                openAlert("Error al registrar el grupo", "No tienes permiso para registrar el grupo", "error", null);
            }else{
                openAlert("Error al registrar el grupo", "Ocurrió un error inesperado al registrar el grupo", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Crear grupo</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="clave">Clave del grupo</label>
            <input type="text" name="clave" id="clave" className="inputDashboard" 
                onChange={(e) => setClave(e.target.value)}
                required/>
            <label htmlFor="nombre">Nombre del grupo</label>
            <input type="text" name="nombre" id="nombre" className="inputDashboard"
                onChange={(e) => setNombre(e.target.value)} 
                required/>
            <label htmlFor="letra">Letra del grupo</label>
            <select type="text" maxLength={1} className="inputDashboard" 
                onChange={(e) => setLetra(e.target.value)}
            required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
            </select>
            <label htmlFor="grado">Grado del grupo</label>
            <input type="number" name="grado" id="grado" className="inputDashboard" 
                onChange={(e) => setGrado(e.target.value)}
                required/>
            <label htmlFor="periodo">Periodo</label>
            <input type="text" name="periodo" placeholder="Ingresa el periodo (Ejemplo P2024)" className="inputDashboard" 
                onChange={(e) => setPeriodo(e.target.value)}
                required
            />
            <button className="login">Crear grupo</button>
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

export default CrearGrupo;