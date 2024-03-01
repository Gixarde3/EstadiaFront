import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import ReloadButton from "./ReloadButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
function Grupos() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [grupos, setGrupos] = useState([]);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getGrupos = async() => {
        try{
            const response = await axios.get(`${endpoint}/grupos`);
            if(response.data.success){
                setGrupos(response.data.resultados);
            }else{
                openAlert("Error al obtener los grupos", "No se han podido obtener los grupos, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    useEffect(() => {
        getGrupos();
    }, []);

    const setGru = (data) => {
        setGrupos(data);
        console.log(data);
    }
    const handleDelete = async(id) => {
        openAlert("¿Seguro de eliminar?", "Esta acción no se puede deshacer.", "question", null, true, async () => {
            openAlert("Eliminando grupo", "Espere un momento por favor", "loading");
            const data = {
                id: id,
                token: token
            };
            try{
                const response = await axios.post(`${endpoint}/grupo/delete/${id}`, data);
                if(response.data.success === true){
                    closeAlert();
                    getGrupos();
                }else{
                    openAlert("Error al eliminar el grupo", "No se ha podido eliminar el grupo, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            }
        });
    }
    const handleDeleteGrupos = async(id) => {
        const token = Cookies.get("token");
        openAlert("Eliminando grupos", "Espere un momento por favor", "loading");
        try{
            const response = await axios.post(`${endpoint}/calificacion/delete/${id}`, {token: token});
            if(response.data.success){
                openAlert("Grupos eliminadas", "Las grupos se eliminaron correctamente", "success", null);
                getGrupos();
            }else{
                openAlert("Error al eliminar las grupos", "Ocurrió un error inesperado al eliminar las grupos", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", "Ocurrió un error de conexión",  "error", null);
            console.log(error);
        }
    }
    return (<>
            <h1>Grupos</h1>
            <section id="grupos" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={()=>getGrupos()}/>
            <Buscar setData={(data)=>(setGru(data))}
                filters={["clave", "nombre", "letra", "grado"]}
                aBuscar="grupo"
                aBuscarPlural="grupos"
            />
            {
                grupos && grupos.map((grupo) => (
                    <div className="result" key={grupo.id}>
                        <div className="info">
                            <h1>{grupo.clave}</h1>
                            <h2>{grupo.periodo}</h2>
                            <p>{grupo.nombre}</p>
                            <p>{grupo.plan}</p>
                            {grupo.grado ? <p>{grupo.grado}</p> : <p>Este grupo fue creado por importación, no tiene grado, porfavor agrega uno editando este grupo</p>}
                            
                            {
                                tipoUsuario === "3" ? (
                                    <div className="opciones">
                                        <Link to={`editar/${grupo.id}`}><img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar grupo"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(grupo.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar grupo"
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

export default Grupos;