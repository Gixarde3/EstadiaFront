import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Admisiones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [admisiones, setAdmisiones] = useState([]);
    const periodos = {
        "P": "Primavera",
        "O": "Otoño",
        "I": "Invierno"
    }
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    useEffect(() => {
        const getAdmisiones = async() => {
            try{
                const response = await axios.get(`${endpoint}/admisiones`);
                if(response.data.success){
                    setAdmisiones(response.data.admisiones);
                }else{
                    openAlert("Error al obtener las admisiones", "No se han podido obtener las admisiones, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getAdmisiones();
    }, [tipoUsuario, token, endpoint]);
    const getUserById = async(id) => {
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
    const getAdmisiones = async() => {
        try{
            const response = await axios.get(`${endpoint}/admisiones`);
            if(response.data.success){
                setAdmisiones(response.data.admisiones);
            }else{
                openAlert("Error al obtener las admisiones", "No se han podido obtener las admisiones, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const handleDelete = async(id) => {
        openAlert("¿Seguro de eliminar?", "Esta acción no se puede deshacer.", "question", null, true, async () => {
            openAlert("Eliminando admisión", "Espere un momento por favor", "loading");
            const data = {
                id: id,
                token: token
            };
            try{
                const response = await axios.post(`${endpoint}/admision/delete/${id}`, data);
                if(response.data.success === true){
                    closeAlert();
                    getAdmisiones();
                }else{
                    openAlert("Error al eliminar la admisión", "No se ha podido eliminar la admisión, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        });
    }
    const descargarArchivo = (id, file) => {
        try{
            // Crea un enlace temporal para descargar el archivo
            const enlace = document.createElement('a');
            enlace.href = `${config.endpoint}/admision/download/${id}`;
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

    const procesarAdmisiones = async(id) => {
        openAlert("Procesando admisiones", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/admision/procesar/${id}`, {
                token: token
            });
            if(response.data.success){
                closeAlert();
                getAdmisiones();
            }else{
                openAlert("Error al procesar las admisiones", "No se han podido procesar las admisiones, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }

    return (<>
            <h1>Gestión de admisiones</h1>
            <section id="admisiones" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={getAdmisiones}/>
            {
                admisiones.map((admision) => (
                    <div className="result" key={admision.id}>
                        <div className="info">
                            <h1>{periodos[admision.periodo] + " " + admision.anio}</h1>
                            <p>Cargado el: {admision.updated_at}</p>
                            {admision.archivo && admision.procesado !== 1 ? <p><button className="login" onClick={() => procesarAdmisiones(admision.id)}>Procesar admisiones</button></p> : null}
                            {admision.archivo ? <p><button className="login" onClick={() => (descargarArchivo(admision.id, admision.archivo))}>Descargar admisiones</button></p>: null}
                            {
                                tipoUsuario >= 1 ? (
                                    <div className="opciones">
                                        <Link to={`editar/${admision.id}`}><img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar admisión"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(admision.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar admisión"
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

export default Admisiones;