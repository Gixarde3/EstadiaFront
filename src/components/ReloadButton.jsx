import config from "./config.json";
import { Tooltip } from "react-tooltip";
import './css/reloadButton.css'
function ReloadButton({reloadFunction}) {
    const endpointLocal = config.endpointLocal;
    return (
        <>
            <button onClick={()=>reloadFunction()} id="reloadButton"
                data-tooltip-id="tooltip"
                data-tooltip-content="Recargar la lista"
                data-tooltip-place="top"

            >
                <img src={`${endpointLocal}img/reload.png`} alt="Boton de recargar" />
            </button>
            <Tooltip id="reload"></Tooltip>
        </>
        
    );
}

export default ReloadButton;