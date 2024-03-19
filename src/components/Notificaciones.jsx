import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Notificaciones() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getNotificaciones = async() => {
        try{
            const response = await axios.get(`${endpoint}/notificaciones/${token}`);
            if(response.data.success){
                setNotificaciones(response.data.notificaciones);
            }else{
                openAlert("Error al obtener las notificaciones", "No se han podido obtener las notificaciones, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            console.log(error);
        }
    }
    useEffect(() => {
        getNotificaciones();
    }, [tipoUsuario, token, endpoint]);
    return (<>
        <h1>Notificaciones</h1>
        <section id="notificaciones" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
            <ReloadButton reloadFunction={getNotificaciones}/>
        {
            notificaciones.map((notificacion) => (
                <div className="result" key={notificacion.id}>
                    <div className="info">
                        <h2>{notificacion.titulo}</h2>
                        <p>{notificacion.descripcion}</p>
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

export default Notificaciones;