import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function EditarCalificaciones() {
    const { id } = useParams();
    const navigate = useNavigate();
    const endpoint = config.endpoint;
    const [archivo, setArchivo] = useState(null);
    const [nameFile, setNameFile]  = useState("");
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
    useEffect(() => {
        const getCalificacion = async() => {
            try{
                const response = await axios.get(`${endpoint}/calificacion/${id}`);
                if(response.data.success){
                    setPeriodo(response.data.calificacion.periodo);
                    setAnio(response.data.calificacion.anio);
                    setCarrera(response.data.calificacion.carrera);
                    setNameFile(response.data.calificacion.archivo);
                }else{
                    openAlert("Error al obtener la calificación", "No se ha podido obtener la calificación, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getCalificacion();
    }, [id, endpoint]);
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
            const response = await axios.post(endpoint + "/calificacion/edit/" + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                }
            });
            if(response.data.success){
                openAlert("Calificaciones registradas", "Las calificaciones se editaron correctamente", "success", "/dashboard/calificaciones");
                
            }else{
                openAlert("Error al editar las calificaciones", "Ocurrió un error inesperado al editar las calificaciones: " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al editar las calificaciones", "No tienes permiso para editar las calificaciones", "error", null);
            }else{
                openAlert("Error al editar las calificaciones", "Ocurrió un error inesperado al editar las calificaciones", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Editar calificaciones</h2>
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
            <input type="text" name="carrera" id="carrera" className="inputDashboard" 
                onChange={(e) => setCarrera(e.target.value)}
                value={carrera}
            required/>
            <label htmlFor="Archivo" className="login" style={{marginBottom: "1rem"}}>Selecciona el archivo</label>
            <input type="file" name="Archivo" id="Archivo" className="inputDashboard" 
                onChange={handleFileUpload} style={{display: "none"}}
            />
            {
                archivo ? <p style={{marginBottom: "1rem"}}>Archivo seleccionado: {archivo.name}</p> : <p style={{marginBottom: "1rem"}}>{nameFile}</p>
            }
            <button className="login">Editar calificaciones</button>
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

export default EditarCalificaciones;