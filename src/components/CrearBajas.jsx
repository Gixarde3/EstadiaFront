import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";

function CrearBajas() {
    const endpoint = config.endpoint;
    const [cohortes, setCohortes] = useState([]);
    const [archivo, setArchivo] = useState(null);
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [idCohorte, setIdCohorte] = useState(0);
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

    useEffect(()=>{
        const getCohortes = async() => {
            try{
                const cohortes = await axios.get(endpoint + "/cohortes");
                if(cohortes.data.success){
                    setCohortes(cohortes.data.cohortes);
                }else{
                    openAlert("Error al obtener los cohortes", "No se han podido obtener los cohortes, intenta más tarde.", "error", null);
                }
            }catch(e){
                openAlert("Error de conexión", `La petición ha fallado por ${e}`, "error", null);
            }
            
        };
        getCohortes();
    }, [])
    const token = Cookies.get("token");
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo las bajas", "Espere un momento por favor", "loading");
        const formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("token", token);
        try{
            const response = await axios.post(endpoint + "/baja/" + idCohorte, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                }
            });
            if(response.data.success){
                openAlert("Bajas registradas", "Las bajas se registraron correctamente", "success", null);
            }else{
                openAlert("Error al registrar las bajas", "Ocurrió un error inesperado al registrar las bajas: " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar las bajas", "No tienes permiso para registrar las bajas", "error", null);
            }else{
                openAlert("Error al registrar las bajas", "Ocurrió un error inesperado al registrar las bajas", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Subir bajas</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="Cohorte">Selecciona el cohorte</label>
            <select name="Cohorte" id="Cohorte" style={{marginBottom:'1rem'}} onChange={(event)=>(setIdCohorte(event.target.value))}>
                <option value="">Selecciona el cohorte</option>
                {
                    cohortes.map((co) => {
                        return <option value={co.id} key={co.id}>{co.plan}</option>
                    })
                }
            </select>
            <label htmlFor="Archivo" className="login" style={{marginBottom: "1rem"}}>Selecciona el archivo</label>
            <input type="file" name="Archivo" id="Archivo" className="inputDashboard" 
                onChange={handleFileUpload} style={{display: "none"}}
            required/>
            {
                archivo ? <p style={{marginBottom: "1rem"}}>Archivo seleccionado: {archivo.name}</p> : null
            }
            <button className="login">Subir bajas</button>
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

export default CrearBajas;