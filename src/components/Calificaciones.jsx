import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Calificaciones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [calificaciones, setCalificaciones] = useState([]);
    const cohortesNames = {
        "P": "Primavera",
        "O": "Otoño",
        "I": "Invierno"
    };
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
                    openAlert("Error al obtener las calificaciones", "No se han podido obtener las calificaciones, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getCalificaciones();
    }, [tipoUsuario, token, endpoint]);
    const getCalificaciones = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificaciones`);
            if(response.data.success){
                setCalificaciones(response.data.calificaciones);
            }else{
                openAlert("Error al obtener las calificaciones", "No se han podido obtener las calificaciones, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const handleDelete = async(id) => {
        openAlert("Eliminando calificacion", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/calificacion/delete/${id}`,{
                token: token
            });
            if(response.data.success){
                openAlert("Baja eliminada", "La calificacion ha sido eliminada", "success", null);
                getCalificaciones();
            }else{
                openAlert("Error al eliminar la calificacion", "No se ha podido eliminar la calificacion, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const procesarCalificacion = async(id) => {
        openAlert("Procesando calificaciones", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/calificacion/procesar/${id}`,{
                token: token
            });
            if(response.data.success){
                openAlert("Calificaciones procesadas", "Las calificaciones han sido procesadas", "success", null);
                getCalificaciones();
            }else{
                openAlert("Error al procesar las calificaciones", "No se han podido procesar las calificaciones, intenta más tarde." + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const descargarArchivo = (id, file) => {
        try{
            // Crea un enlace temporal para descargar el archivo
            const enlace = document.createElement('a');
            enlace.href = `${config.endpoint}/calificacion/download/${id}`;
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
    return (<>
        <h1>Calificaciones</h1>
            <section id="calificaciones" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={getCalificaciones}/>
            {
                calificaciones.map((calificacion) => (
                    <div className="result" key={calificacion.id}>
                        <div className="info">
                            <h1>{calificacion.periodo}</h1>
                            <p>{calificacion.anio}</p>
                            {calificacion.archivo ? <p>Archivo con las calificaciones: {calificacion.archivo}</p> : null}
                            {calificacion.archivo && calificacion.procesado === 1 ? <p>Calificaciones procesadas</p> : <p>Calificaciones no procesadas</p>}
                            {calificacion.archivo && calificacion.procesado !== 1 ? <p><button className="login" onClick={() => (procesarCalificacion(calificacion.id))}>Procesar calificaciones</button></p> : null}
                            {calificacion.archivo ? <p><button className="login" onClick={() => (descargarArchivo(calificacion.id, calificacion.archivo))}>Descargar calificaciones</button></p>: null}
                            {calificacion.archivo && calificacion.procesado === 1 ? <p><button className="login"><Link to={`graficas/${calificacion.id}`} style={{color:'black', margin:0}}>Ver gráficas</Link></button></p> : null}
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
            onAccept={alert ? alert.onAccept : null}
        />
    </>);
}

export default Calificaciones;