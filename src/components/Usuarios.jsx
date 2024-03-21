import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReloadButton from "./ReloadButton";
function Usuarios() {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointImage = config.endpointImage;
    const endpointLocal = config.endpointLocal;
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
    const [usuarios, setUsuarios] = useState([]);
    const tiposUsuario = ["Usuario sin acceso","Profesor/Coordinador",  "Director", "Administrador"];
    useEffect(() => {
        const getUsuarios = async() => {
            try{
                const response = await axios.get(`${endpoint}/usuarios`);
                if(response.data.success){
                    setUsuarios(response.data.usuarios);
                }else{
                    openAlert("Error al obtener los usuarios", "No se han podido obtener los usuarios, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
            }
        };
        getUsuarios();
    }, [tipoUsuario, token, endpoint]);
    const getUsuarios = async() => {
        try{
            const response = await axios.get(`${endpoint}/usuarios`);
            if(response.data.success){
                setUsuarios(response.data.usuarios);
            }else{
                openAlert("Error al obtener los usuarios", "No se han podido obtener los usuarios, intenta más tarde.", "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    };
    const handleDelete = async(id) => {
        openAlert("¿Seguro de eliminar?", "Esta acción no se puede deshacer.", "question", null, true, async () => {
            openAlert("Eliminando usuario", "Espere un momento por favor", "loading");
            const data = {
                id: id,
                token: token
            };
            try{
                const response = await axios.post(`${endpoint}/usuario/delete/${id}`, data);
                if(response.data.success === true){
                    closeAlert();
                    openAlert("Usuario eliminado", "Se ha eliminado el usuario correctamente.", "success");
                    getUsuarios();
                }else{
                    openAlert("Error al eliminar al usuario", "No se ha podido eliminar al usuario, intenta más tarde.", "error", null);
                }
            }catch(error){
                if(error.response !== undefined && error.response.status === 401){
                    openAlert("Error al eliminar al usuario", "No se ha podido eliminar al usuario, no cuentas con los permisos necesarios.", "error", null);
                }
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        });
        
    }
    const handleDeactivate = async(id, activo) => {
        if(activo){
            openAlert("¿Seguro de desactivar a este usuario?", "Esto le quitará el acceso total al usuario.", "question", null, true, async () => {
                openAlert("Desactivando usuario", "Espere un momento por favor", "loading");
                const data = {
                    id: id,
                    token: token
                };
                try{
                    const response = await axios.post(`${endpoint}/usuario/desactivar/${id}`, data);
                    if(response.data.success === true){
                        closeAlert();
                        openAlert("Usuario desactivado", "Se ha desactivado el usuario correctamente.", "success");
                        getUsuarios();
                    }else{
                        openAlert("Error al desactivar al usuario", "No se ha podido desactivar al usuario, intenta más tarde.", "error", null);
                    }
                }catch(error){
                    if(error.response !== undefined && error.response.status === 401){
                        openAlert("Error al desactivar al usuario", "No se ha podido desactivar al usuario, no cuentas con los permisos necesarios.", "error", null);
                    }
                    openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                }
            });
        }else{
            openAlert("¿Seguro de reactivor a este usuario?", "Esto le regresará el acceso al usuario.", "question", null, true, async () => {
                openAlert("Reactivando usuario", "Espere un momento por favor", "loading");
                const data = {
                    id: id,
                    token: token
                };
                try{
                    const response = await axios.post(`${endpoint}/usuario/activar/${id}`, data);
                    if(response.data.success === true){
                        closeAlert();
                        openAlert("Usuario reactivado", "Se ha reactivado el usuario correctamente.", "success");
                        getUsuarios();
                    }else{
                        openAlert("Error reactivar al usuario", "No se ha podido reactivar al usuario, intenta más tarde.", "error", null);
                    }
                }catch(error){
                    if(error.response !== undefined && error.response.status === 401){
                        openAlert("Error reactivar al usuario", "No se ha podireactivar al usuario, no cuentas con los permisos necesarios.", "error", null);
                    }
                    openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                }
            });
        }
    }
    return (
        <>
            <h1>Gestión de usuarios</h1>
            <section id="usuarios" className="results" style={{position: 'relative', paddingTop:'calc(50px + 1rem)'}}>
                <ReloadButton reloadFunction={getUsuarios}/>
            
            {
                usuarios.map((usuario) => (
                    <div className="result" key={usuario.id}>
                        <div className="fotoPerfilResultado">
                            <img src={`${endpointImage}${usuario.foto}`} alt="Foto de perfil del usuario"/>
                        </div>
                        <div className="info">
                            <h1>{usuario.nombre + " " + usuario.apP + " " + usuario.apM}</h1>
                            <p>Número de empleado: {usuario.noEmp}</p>
                            <p>{usuario.email}</p>
                            <p>Cargado el: {usuario.updated_at}</p>
                            <p>{tiposUsuario[usuario.tipoUsuario]}</p>
                            {
                                tipoUsuario === "3" || usuario.token === Cookies.get("token") ? (
                                    <div className="opciones">
                                        <Link to={`editar/${usuario.id}`}>
                                            <img src={`${endpointLocal}img/edit.png`} alt="Icono de editar" 
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Editar usuario"
                                            data-tooltip-place="top"
                                        /></Link>
                                        <button type="button" className="deleteButton" onClick={()=>(handleDelete(usuario.id))}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content="Eliminar usuario"
                                            data-tooltip-place="top"
                                        ><img src={`${endpointLocal}img/close.webp`} alt="Eliminar"/></button>
                                        <button className={`deactivateButton` + (usuario.activo === 1 ? "" : " deactivated")} type="button" onClick={()=>(handleDeactivate(usuario.id, usuario.activo === 1))}
                                             data-tooltip-id="tooltip"
                                             data-tooltip-content={usuario.activo === 1 ? `Desactivar usuario`: `Reactivar usuario`}
                                             data-tooltip-place="top"
                                        >
                                            <img src={`${endpointLocal}img/desactivar.png`} alt="Desactivar usuario"/>
                                        </button>
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
        </>
        
    );
}

export default Usuarios;