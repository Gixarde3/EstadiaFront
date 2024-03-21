import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "./config.json";
import Cookies from "js-cookie";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";

function EditarCohorte() {
    const {id} = useParams();
    const [cohorte, setCohorte] = useState(null); 
    const endpoint = config.endpoint;
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
    const [periodo, setPeriodo] = useState("P");
    const [anio, setAnio] = useState(0);
    const [plan, setPlan] = useState("");
    const token = Cookies.get("token");
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Editando el cohorte", "Espere un momento por favor", "loading");
        const formData = new FormData();
        formData.append("periodo", periodo);
        formData.append("anio", anio);
        formData.append("plan", plan);
        formData.append("token", token);
        try{
            const response = await axios.post(endpoint + "/cohorte/edit/" + id, formData);
            if(response.data.success){
                openAlert("Cohorte editado", "El cohorte se editó correctamente", "success", "/dashboard/cohortes");
            }else{
                openAlert("Error al editar al cohorte", "Ocurrió un error inesperado al editar el cohorte. " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al editar al cohorte", "No tienes permiso para editar el cohorte", "error", null);
            }else{
                openAlert("Error al editar al cohorte", "Ocurrió un error inesperado al editar el cohorte", "error", null);
            }
        }
    }
    useEffect(() => {
        const getCohorte = async() => {
            try{
                const response = await axios.get(endpoint + "/cohorte/" + id);
                if(response.data.success){
                    setCohorte(response.data.cohorte);
                }else{
                    openAlert("Error al obtener el cohorte", "Ocurrió un error inesperado al obtener el cohorte", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", "Ocurrió un error de conexión", "error", null);
                console.log(error);
            }
        }
        getCohorte();
    }, [id]);
    useEffect(() => {
        if(cohorte){
            setPeriodo(cohorte.periodo);
            setAnio(cohorte.anio);
            setPlan(cohorte.plan);
        }
    }, [cohorte]);
    return (
        <>
            <h2>Editar un cohorte</h2>
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
                <button className="login">Editar cohorte</button>
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
        </>
    );
}

export default EditarCohorte;