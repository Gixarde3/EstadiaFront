import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Cohortes() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [cohortes, setCohortes] = useState([]);
    const cohortesNames = {
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
        const getCohortes = async() => {
            try{
                const response = await axios.get(`${endpoint}/cohortes`);
                if(response.data.success){
                    setCohortes(response.data.cohortes);
                }else{
                    openAlert("Error al obtener los cohortes", "No se han podido obtener los cohortes, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
        getCohortes();
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
    const getCohortes = async() => {
        try{
            const response = await axios.get(`${endpoint}/cohortes`);
            if(response.data.success){
                setCohortes(response.data.cohortes);
            }else{
                openAlert("Error al obtener los cohortes", "No se han podido obtener los cohortes, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const handleDelete = async(id) => {
        openAlert("¿Seguro de eliminar?", "Esta acción no se puede deshacer.", "question", null, true, async () => {
            openAlert("Eliminando cohorte", "Espere un momento por favor", "loading");
            const data = {
                id: id,
                token: token
            };
            try{
                const response = await axios.post(`${endpoint}/cohorte/delete/${id}`, data);
                if(response.data.success === true){
                    closeAlert();
                    getCohortes();
                }else{
                    openAlert("Error al eliminar el cohorte", "No se ha podido eliminar el cohorte, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            }
        });
    }
    return (<>
            <h1>Gestión de cohortes</h1>
            <section id="cohortes" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={getCohortes}/>
            {
                cohortes.map((cohorte) => (
                    <div className="result" key={cohorte.id}>
                        <div className="info">
                            <h1>{cohorte.plan}</h1>
                            <p>{cohorte.anio}</p>
                            <p>{cohortesNames[cohorte.periodo]}</p>    
                            <p><button className="login"><Link to={`graficas/${cohorte.id}`} style={{color:'black', margin:0}}>Ver gráficas</Link></button></p>                        {
                                tipoUsuario === "3" ? (
                                    <div className="opciones">
                                        <Link to={`editar/${cohorte.id}`}><img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar cohorte"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(cohorte.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar cohorte"
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

export default Cohortes;