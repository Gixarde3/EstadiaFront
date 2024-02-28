import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
function DBLogs() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }

    return (
    <>
        <h1>Logs de la base de datos</h1>
        <section id="logs" className="results" style={{position: 'relative'}}>
            <Buscar setData={(data)=>(setLogs(data))}
                filters={["nombre", "fecha"]}
                aBuscar="backup"
                aBuscarPlural="backups"
            />
        {
            logs && logs.map((log) => (
                <div className="result" key={log.id}>
                    <div className="info">
                        <h1>{log.operacion}</h1>
                        <p>{log.fecha}</p>
                        <p>{log.nombre}</p>
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

export default DBLogs;