import Cookies from "js-cookie";
import config from "./config.json";
import Alert from "./Alert";
import axios from "axios";
import { useState} from "react";
import Filter from "./Filter";
import './css/buscar.css';
function Buscar({setData, filters, aBuscar, aBuscarPlural}) {
    const tipoUsuario = Cookies.get("tipoUsuario");
    const token = Cookies.get("token");
    const endpoint = config.endpoint;
    const endpointLocal = config.endpointLocal;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [filter, setFilter] = useState(filters[0]);
    const [search, setSearch] = useState("");
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const handleSubmitSearch = async(event) => {
        event.preventDefault();
        openAlert("Buscando", "Espere un momento por favor", "loading");
        if(search === ""){
            try{
                const response = await axios.get(`${endpoint}/${aBuscarPlural}`);
                if(response.data.success){
                    setData(response.data.resultados);
                    closeAlert();
                }else{
                    openAlert("Error al buscar", "No se han podido obtener los resultados, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }else{
            try{
                const response = await axios.get(`${endpoint}/${aBuscar}/${filter}/${search}`);
                if(response.data.success){
                    setData(response.data.resultados);
                    closeAlert();
                }else{
                    openAlert("Error al buscar", "No se han podido obtener los resultados, intenta más tarde.", "error", null);
                }
            }catch(error){
                openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
                console.log(error);
            }
        }
    }
    return (
    <>
        <div id="search" className="search result">
            <form className="row-search" onSubmit={handleSubmitSearch}>
                <Filter filters={filters} setValue={(value) => (setFilter(filters[value]))}/>
                <input type="text" name="title-search" className="title-search" placeholder={`Ingresa un(a) ${filter} para buscar`} onChange = {(event) => {setSearch(event.target.value)}}/>
                <button type="submit" className="login btn-buscar" 
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Buscar"
                    data-tooltip-place="top"
                ><img src={`${endpointLocal}img/search.png`} alt="icono_buscar" className="icono-buscar"/></button>
            </form>
        </div>
        <Alert 
            isOpen={alertOpen} 
            title={alert ? alert.title : ""} 
            message={alert ? alert.message : ""} 
            kind={alert ? alert.kind : ""} 
            closeAlert={closeAlert} 
            redirectRoute={alert ? alert.redirectRoute : ""}
        />
    </>);
}

export default Buscar;