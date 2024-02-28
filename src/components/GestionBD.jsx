import Perfiles from "./Perfiles";
import Cookies from "js-cookie";
import DBLogs from "./DBLogs";
import axios from "axios";
import Alert from "./Alert";
import { React, useState } from "react";
import config from "./config.json";
function GestionUsuarios() {
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const tipoUsuario = Cookies.get("tipoUsuario");
    const [archivo, setArchivo] = useState(null);
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

    const downloadSQL = async() => {
        try{
            
            const enlace = document.createElement('a');
            enlace.href = `${endpoint}/backup/download/${token}`;
            enlace.download = "Respaldo.sql"; // Cambia el nombre de descarga si es necesario
            // Simula un clic en el enlace para iniciar la descarga
            enlace.style.display = 'none';
            document.body.appendChild(enlace);
            enlace.click();
            // Elimina el enlace después de la descarga
            document.body.removeChild(enlace);
            
        }catch(error){
            openAlert("Error al descargar el archivo", "Ocurrió un error inesperado al descargar el archivo", "error", null);
            console.log(error);
        }
    };
    const uploadSQL = async() => {
        try{
            const formData = new FormData();
            formData.append('sql', archivo);
            formData.append('token', token);
            openAlert("Subiendo archivo", "Espere un momento por favor", "loading");
            const response = await axios.post(`${endpoint}/backup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.success){
                openAlert("Archivo subido", "Base de datos restaurada con éxito", "success", null);
            }else{
                openAlert("Error al subir el archivo", "Ocurrió un error inesperado al subir el archivo", "error", null);
            }
        }catch(error){
            openAlert("Error al subir el archivo", "Ocurrió un error inesperado al subir el archivo", "error", null);
            console.log(error);
        }
    }
    return (<>
        <DBLogs />
        {
           tipoUsuario === "3" ? 
           <>
           <h2>Operaciones de la BD</h2>
           <form>
                <div className="db-buttons">
                    <button type="button" className="login" onClick={()=>downloadSQL()}>Realizar respaldo</button>
                    <label htmlFor="archivo" className="login">Cargar respaldo</label>
                    <input type="file" id="archivo" name="archivo" onChange={handleFileUpload} hidden/>
                </div>
                {archivo && 
                    <div style={{
                        display:'flex',
                        flexDirection: 'column',
                        marginTop:'1rem'
                    }}>

                        <p>Archivo seleccionado: {archivo.name}</p>
                        <button type="button" className="login" onClick={() => uploadSQL()}>Cargar SQL con el respaldo</button>
                    </div>
                }
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
           </> : <></>
        }
    </>);
}

export default GestionUsuarios;