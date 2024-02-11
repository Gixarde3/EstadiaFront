import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Bajas() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [bajas, setBajas] = useState([]);
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
        const getBajas = async() => {
            try{
                const response = await axios.get(`${endpoint}/bajas`);
                if(response.data.success){
                    setBajas(response.data.bajas);
                }else{
                    openAlert("Error al obtener las bajas", "No se han podido obtener las bajas, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getBajas();
    }, [tipoUsuario, token, endpoint]);
    const getBajas = async() => {
        try{
            const response = await axios.get(`${endpoint}/bajas`);
            if(response.data.success){
                setBajas(response.data.bajas);
            }else{
                openAlert("Error al obtener las bajas", "No se han podido obtener las bajas, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const handleDelete = async(id) => {
        openAlert("Eliminando baja", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/baja/delete/${id}`,{
                token: token
            });
            if(response.data.success){
                openAlert("Baja eliminada", "La baja ha sido eliminada", "success", null);
                getBajas();
            }else{
                openAlert("Error al eliminar la baja", "No se ha podido eliminar la baja, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    const procesarCalificacion = async(id) => {
        openAlert("Procesando bajas", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/baja/procesar/${id}`,{
                token: token
            });
            if(response.data.success){
                openAlert("Bajas procesadas", "Las bajas han sido procesadas", "success", null);
                getBajas();
            }else{
                openAlert("Error al procesar las bajas", "No se han podido procesar las bajas, intenta más tarde." + response.data.message, "error", null);
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
            enlace.href = `${config.endpoint}/baja/download/${id}`;
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
        <h1>Bajas</h1>
            <section id="bajas" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={getBajas}/>
            {
                bajas.map((baja) => (
                    <div className="result" key={baja.id}>
                        <div className="info">
                            <h1>{baja.plan}</h1>
                            <p>{baja.anio}</p>
                            <p>{cohortesNames[baja.periodo]}</p>
                            {baja.archivo ? <p>Archivo con las bajas: {baja.archivo}</p> : null}
                            {baja.archivo && baja.procesado === 1 ? <p>Bajas procesadas</p> : <p>Bajas no procesadas</p>}
                            {baja.archivo && baja.procesado !== 1 ? <p><button className="login" onClick={() => (procesarCalificacion(baja.id))}>Procesar bajas</button></p> : null}
                            {baja.archivo ? <p><button className="login" onClick={() => (descargarArchivo(baja.id, baja.ar))}>Descargar bajas</button></p>: null}
                            {baja.archivo ? <p><button className="login" onClick={() => (handleDelete(baja.id))}>Eliminar bajas</button></p>: null}
                            {
                                tipoUsuario === "3" ? (
                                    <div className="opciones">
                                        <Link to={`editar/${baja.id}`}><img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar baja"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(baja.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar baja"
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

export default Bajas;