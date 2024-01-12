import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";

function CrearCalificaciones() {
    const endpoint = config.endpoint;
    const {id} = useParams();
    const [periodo, setPeriodo] = useState("P");
    const [anio, setAnio] = useState(0);
    const [plan, setPlan] = useState("");
    const [carrera, setCarrera] = useState("ITI");
    const [archivo, setArchivo] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState(null);
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

    const handleFileUpload = (e) => {
        try{
            setArchivo(e.target.files[0]);
        }catch(error){
            openAlert("Error al subir el archivo", "Ocurrió un error inesperado al subir el archivo", "error", null);
        }
    };
    const token = Cookies.get("token");
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo las calificaciones", "Espere un momento por favor", "loading");
        const formData = new FormData();
        formData.append("periodo", periodo);
        formData.append("anio", anio);
        formData.append("programaEducativo", plan);
        formData.append("carrera", carrera);
        archivo ? formData.append("archivo", archivo) : null;
        formData.append("token", token);
        try{
            const response = await axios.post(endpoint + "/calificacion/" + id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                }
            });
            if(response.data.success){
                openAlert("Calificaciones registradas", "Las calificaciones se actualizaron correctamente", "success", "/dashboard/calificaciones");
            }else{
                openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al actualizar las calificaciones: " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar las calificaciones", "No tienes permiso para actualizar las calificaciones", "error", null);
            }else{
                openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al actualizar las calificaciones", "error", null);
                console.log(error);
            }
        }
    }
    
    useEffect(() => {
        const getCalificacion = async() => {
            try{
                const response = await axios.get(endpoint + "/calificacion/" + id);
                if(response.data.success){
                    const calificacion = response.data.calificaciones;
                    setPeriodo(calificacion.periodo);
                    setAnio(calificacion.anio);
                    setPlan(calificacion.programaEducativo);
                    setCarrera(calificacion.carrera);
                    setNombreArchivo(calificacion.archivo);
                    console.log(calificacion);
                }else{
                    openAlert("Error al obtener la calificación", "Ocurrió un error inesperado al obtener la calificación", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", "Ocurrió un error de conexión", "error", null);
                console.log(error);
            }
        }
        getCalificacion();
    }, [endpoint]);
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
            <label htmlFor="anio">Ingresa el año del cohorte</label>
            <input type="number" name="anio" id="anio" className="inputDashboard"
                onChange={(e) => setAnio(e.target.value)}
                value={anio}
            required/>
            <label htmlFor="plan">Ingresa el plan del cohorte</label>
            <input type="text" name="plan" id="plan" className="inputDashboard" 
                onChange={(e) => setPlan(e.target.value)}
                value={plan}
            required/>
            <label htmlFor="carrera">Selecciona la carrera</label>
            <select name="carrera" id="carrera" className="inputDashboard" 
                onChange={(e) => setCarrera(e.target.value)}
                value={carrera}
            required>
                <option value="ITI">Ingeniería en Tecnologías de la Información</option>
                <option value="IET">Ingeniería en Electricidad y Telecomunicaciones</option>
                <option value="IFI">Ingeniería en Financiera</option>
                <option value="IIN">Ingeniería Industrial</option>
                <option value="IBT">Ingeniería en Biotecnología</option>
                <option value="ITA">Ingeniería en Tecnología Ambiental</option>
                <option value="LAE">Licenciatura en Administración y gestión Empresarial</option>
            </select>
            <label htmlFor="Archivo" className="login" style={{marginBottom: "1rem"}}>Selecciona el archivo</label>
            <input type="file" name="Archivo" id="Archivo" className="inputDashboard" 
                onChange={handleFileUpload} style={{display: "none"}}
            />
            {
                archivo ? <p style={{marginBottom:"1rem"}}>Archivo seleccionado: {archivo.name}</p> : <p>Archivo seleccionado: {nombreArchivo}</p>
            }
            <button className="login">Actualizar calificación</button>
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