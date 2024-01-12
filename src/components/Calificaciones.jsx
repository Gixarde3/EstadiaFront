import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Calificaciones() {
    const endpoint = config.endpoint;
    const endpointLocal = config.endpointLocal;
    const tipoUsuario = Cookies.get("tipoUsuario");
    const [calificaciones, setCalificaciones] = useState([]);
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
    useEffect(() => {
        const getCalificaciones = async() => {
            try{
                const response = await axios.get(`${endpoint}/calificaciones`);
                if(response.data.success){
                    setCalificaciones(response.data.calificaciones);
                }else{
                    openAlert("Error al obtener los calificaciones", "No se han podido obtener los calificaciones, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getCalificaciones();
    }, [endpoint]);
    const getCalificaciones = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificaciones`);
            if(response.data.success){
                setCalificaciones(response.data.calificaciones);
            }else{
                openAlert("Error al obtener los calificaciones", "No se han podido obtener los calificaciones, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const handleDelete = async(id) => {
        const token = Cookies.get("token");
        openAlert("Eliminando calificaciones", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/calificacion/delete/${id}`, {token: token});
            if(response.data.success){
                openAlert("Calificaciones eliminadas", "Las calificaciones se eliminaron correctamente", "success", null);
                getCalificaciones();
            }else{
                openAlert("Error al eliminar las calificaciones", "Ocurrió un error inesperado al eliminar las calificaciones", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", "Ocurrió un error de conexión",  "error", "/");
        }
    }
    const getUsernameById = async(id) => {
        try{
            const response = await axios.get(`${endpoint}/user/${id}`);
            if(response.data.success){
                return response.data.usuario.nombre + " " + response.data.usuario.apP + " " + response.data.usuario.apM;
            }else{
                return null;
            }
        }catch(error){
            return null;
        }
    }
    const handleDownload = (file) => {
            try{
                // Crea un enlace temporal para descargar el archivo
                const enlace = document.createElement('a');
                enlace.href = `${config.endpoint}/calificacion/download/${file}`;
                enlace.download = file; // Cambia el nombre de descarga si es necesario
            
                // Simula un clic en el enlace para iniciar la descarga
                enlace.style.display = 'none';
                document.body.appendChild(enlace);
                enlace.click();
            
                // Elimina el enlace después de la descarga
                document.body.removeChild(enlace);
            
            }catch(error){
                openAlert('Error inesperado con la descarga', `Error de descarga: ${error}`, 'error', null);
            }
    };
    const procesarCalificacion = async(id) => {
        const token = Cookies.get("token");
        openAlert("Procesando calificacion", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/calificacion/procesar/${id}`, {token: token});
            if(response.data.success){
                openAlert("Calificacion procesada", "La calificacion se procesó correctamente", "success", null);
                getCalificaciones();
            }else{
                openAlert("Error al procesar la calificacion", "Ocurrió un error inesperado al procesar la calificacion", "error", null);
            }
        }catch(error){
            console.log(error);
            openAlert("Error de conexión", "Ocurrió un error de conexión",  "error", null);
        }
    }
    return (<>
            <h1>Calificaciones</h1>
            <section id="calificaciones">
            {
                calificaciones.map((calificacion) => (
                    <div className="result" key={calificacion.id}>
                        <div className="info">
                            <h1>{calificacion.programaEducativo}</h1>
                            <p>{calificacion.anio}</p>
                            <p>{calificacion.periodo}</p>
                            <p>{calificacion.carrera}</p>
                            <p>{calificacion.procesado === 0 ? "No ha sido procesada" : "Procesada"}</p>
                            <p>
                                {calificacion.procesado === 0 ? <button type="button" className="login" onClick={() => procesarCalificacion(calificacion.id)}>Procesar</button> : null}
                            </p>
                            <button className="login" type="button" onClick={()=>(handleDownload(calificacion.archivo))}>Descargar archivo</button>
                            {
                                tipoUsuario === "3" ? (
                                    <div className="opciones">
                                        <Link to={`editar/${calificacion.id}`}><img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar calificacion"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(calificacion.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar calificacion"
                                            data-tooltip-place="top"
                                        ><img src={`${endpointLocal}img/close.webp`} alt="Eliminar"/></button>
                                    </div>
                                ) : (<> </>)
                            }
                        </div>
                    </div>
                ))
            }
            </section>
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

export default Calificaciones;