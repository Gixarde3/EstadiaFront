import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";

function CrearCalificaciones() {
    const endpoint = config.endpoint;
    const [cohortes, setCohortes] = useState([]);
    const [archivo, setArchivo] = useState(null);
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [idCohorte, setIdCohorte] = useState(0);
    const [periodo, setPeriodo] = useState("P");
    const [anio, setAnio] = useState(0);
    const [plan, setPlan] = useState("");
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
    const handleSubmitCohorte = async(event) => {
        event.preventDefault();
        openAlert("Registrando al cohorte y subiendo calificaciones", "Espere un momento por favor", "loading");
        const formData = new FormData();
        formData.append("periodo", periodo);
        formData.append("anio", anio);
        formData.append("plan", plan);
        formData.append("token", Cookies.get("token"));
        try{
            const response = await axios.post(endpoint + "/cohorte", formData);
            if(response.data.success){
                const formData = new FormData();
                formData.append("archivo", archivo);
                formData.append("token", token);
                try{
                    const response = await axios.post(endpoint + "/calificacion/" + response.data.cohorte, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                        }
                    });
                    if(response.data.success){
                        openAlert("Calificaciones registradas", "Las calificaciones se registraron correctamente", "success", null);
                    }else{
                        openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones: " + response.data.message, "error", null);
                    }
                }catch(error){
                    if(error.response.status === 401){
                        openAlert("Error al registrar las calificaciones", "No tienes permiso para registrar las calificaciones", "error", null);
                    }else{
                        openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones", "error", null);
                        console.log(error);
                    }
                }

            }else{
                openAlert("Error al registrar al cohorte", "Ocurrió un error inesperado al registrar al cohorte", "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar al cohorte", "No tienes permiso para registrar al cohorte", "error", null);
            }else{
                openAlert("Error al registrar al cohorte", "Ocurrió un error inesperado al registrar al cohorte", "error", null);
            }
        
        }
    }
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
    useEffect(()=>{
        const getCohorteData = async(idCohorte) => {
            try{
                const cohorte = await axios.get(endpoint + "/cohorte/" + idCohorte);
                if(cohorte.data.success){
                    console.log(cohorte.data);
                    setPeriodo(cohorte.data.cohorte.periodo);
                    setAnio(cohorte.data.cohorte.anio);
                    setPlan(cohorte.data.cohorte.plan);
                }else{
                    openAlert("Error al obtener el cohorte", "No se ha podido obtener el cohorte, intenta más tarde.", "error", null);
                }
            }catch(e){
                openAlert("Error de conexión", `La petición ha fallado por ${e}`, "error", null);
                console.log(e);
            }
        }
        if(idCohorte && idCohorte!=0) getCohorteData(idCohorte);
    }, [idCohorte]);
    
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo las calificaciones", "Espere un momento por favor", "loading");
        const token = Cookies.get("token");
        try{
            if(idCohorte == 0){
                const formData = new FormData();
                formData.append("periodo", periodo);
                formData.append("anio", anio);
                formData.append("plan", plan);
                formData.append("token", token);
                const response = await axios.post(endpoint + "/cohorte", formData);
                if(response.data.success){
                    const formData2 = new FormData();
                    formData2.append("archivo", archivo);
                    formData2.append("token", token);
                    const response2 = await axios.post(endpoint + "/calificacion/" + response.data.cohorte, formData2, {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                        }
                    });
                    if(response2.data.success){
                        openAlert("Calificaciones registradas", "Las calificaciones se registraron correctamente", "success", null);
                    }else{
                        openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones: " + response2.data.message, "error", null);
                    }
                }else{
                    openAlert("Error al registrar al cohorte", "Ocurrió un error inesperado al registrar al cohorte", "error", null);
                    console.log(response.data);
                }
            }else{
                const formData = new FormData();
                formData.append("archivo", archivo);
                formData.append("token", token);
                const response = await axios.post(endpoint + "/calificacion/" + idCohorte, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Configura el encabezado para enviar datos multipart/form-data
                    }
                });
                if(response.data.success){
                    openAlert("Calificaciones registradas", "Las calificaciones se registraron correctamente", "success", null);
                }else{
                    openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones: " + response.data.message, "error", null);
                }
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al registrar las calificaciones", "No tienes permiso para registrar las calificaciones", "error", null);
            }else{
                openAlert("Error al registrar las calificaciones", "Ocurrió un error inesperado al registrar las calificaciones", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Subir calificaciones</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="Cohorte">Selecciona el cohorte</label>
            <select name="Cohorte" id="Cohorte" style={{marginBottom:'1rem'}} onChange={(event)=>(setIdCohorte(event.target.value))}>
                <option value={0}>Selecciona el cohorte</option>
                {
                    cohortes.map((co) => {
                        return <option value={co.id} key={co.id}>{co.plan}</option>
                    })
                }
            </select>
            <h3>O crea un cohorte nuevo</h3>
            <label htmlFor="periodo">Selecciona el periodo</label>
            <select name="periodo" id="periodo" className="inputDashboard" 
                onChange={(e) => setPeriodo(e.target.value)}
                value={periodo}
                disabled={idCohorte != 0}
            required>
                <option value="P">Primavera</option>
                <option value="O">Otoño</option>
                <option value="I">Invierno</option>
            </select>
            <label htmlFor="anio">Ingresa el año del cohorte</label>
            <input type="number" name="anio" id="anio" className="inputDashboard"
                onChange={(e) => setAnio(e.target.value)}
                value={anio}
                disabled={idCohorte != 0}
            required/>
            <label htmlFor="plan">Ingresa el plan del cohorte</label>
            <input type="text" name="plan" id="plan" className="inputDashboard" 
                onChange={(e) => setPlan(e.target.value)}
                value={plan}
                disabled={idCohorte != 0}
            required/>
            <label htmlFor="Archivo" className="login" style={{marginBottom: "1rem"}}>Selecciona el archivo</label>
            <input type="file" name="Archivo" id="Archivo" className="inputDashboard" 
                onChange={handleFileUpload} style={{display: "none"}}
            required/>
            {
                archivo ? <p style={{marginBottom: "1rem"}}>Archivo seleccionado: {archivo.name}</p> : null
            }
            <button className="login">Subir calificaciones</button>
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