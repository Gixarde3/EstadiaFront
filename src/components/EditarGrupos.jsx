import { useState, useEffect } from "react";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import config from "./config.json";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
function CrearGrupo() {
    const {id} = useParams();
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [clave, setClave] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [nombre, setNombre] = useState("");
    const [letra, setLetra] = useState("");
    const [grado, setGrado] = useState(0);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    useEffect(()=>{
        const getGrupoData = async(id) => {
            try{
                const grupo = await axios.get(endpoint + "/grupo/" + id);
                if(grupo.data.success){
                    console.log(grupo.data);
                    setClave(grupo.data.resultados.clave);
                    setNombre(grupo.data.resultados.nombre);
                    setLetra(grupo.data.resultados.letra);
                    setGrado(grupo.data.resultados.grado);
                    setPeriodo(grupo.data.resultados.periodo);
                }else{
                    openAlert("Error al obtener el grupo", "No se ha podido obtener el grupo, intenta más tarde.", "error", null);
                }
            }catch(e){
                openAlert("Error de conexión", `La petición ha fallado por ${e}`, "error", null);
                console.log(e);
            }
        }
        if(id) getGrupoData(id);
    }, [id]);
    const handleSubmit = async(event) => {
        event.preventDefault();
        openAlert("Subiendo el grupo", "Espere un momento por favor", "loading");
        const token = Cookies.get("token");
        try{
            const formData = new FormData();
            formData.append("clave", clave);
            formData.append("nombre", nombre);
            formData.append("letra", letra);
            formData.append("grado", grado);
            formData.append("periodo", periodo);
            formData.append("token", token);
            const response = await axios.post(endpoint + "/grupo/edit/" + id, formData);
            if(response.data.success){
                openAlert("Grupo editado", "El grupo se editó correctamente", "success", null);
            }else{
                openAlert("Error al editar el grupo", "Ocurrió un error inesperado al editar el grupo: " + response.data.message, "error", null);
            }
        }catch(error){
            if(error.response.status === 401){
                openAlert("Error al editar el grupo", "No tienes permiso para editar el grupo", "error", null);
            }else{
                openAlert("Error al editar el grupo", "Ocurrió un error inesperado al editar el grupo", "error", null);
                console.log(error);
            }
        }
    }
    
    return (<>
        <h2>Crear grupo</h2>
        <form className="dashboardForm" onSubmit={handleSubmit}>
            <label htmlFor="clave">Clave del grupo</label>
            <input type="text" name="clave" id="clave" className="inputDashboard" 
                onChange={(e) => setClave(e.target.value)}
                value={clave}
                required/>
            <label htmlFor="nombre">Nombre del grupo</label>
            <input type="text" name="nombre" id="nombre" className="inputDashboard"
                onChange={(e) => setNombre(e.target.value)} 
                value={nombre}
                required/>
            <label htmlFor="letra">Letra del grupo</label>
            <select type="text" maxLength={1} className="inputDashboard" 
                onChange={(e) => setLetra(e.target.value)}
                value={letra}
            required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
            </select>
            <label htmlFor="grado">Grado del grupo</label>
            <input type="number" name="grado" id="grado" className="inputDashboard" 
                onChange={(e) => setGrado(e.target.value)}
                value={grado}
                required/>
            <label htmlFor="periodo">Periodo</label>
            <input type="text" name="periodo" id="periodo" className="inputDashboard" 
                onChange={(e) => setPeriodo(e.target.value)}
                value={periodo}
                required/>
            <button className="login">Editar grupo</button>
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

export default CrearGrupo;