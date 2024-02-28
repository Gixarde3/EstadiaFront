import config from './config.json';
import { useState } from 'react';
import './css/filter.css';
function Filter({setValue}) {
    const [filter, setFilter] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const endpointLocal = config.endpointLocal;
    const openClose = () => {
        setIsOpen(!isOpen);
    }
    const changeFilter = (filter) => {
        setFilter(filter);
        setValue(filter);
        setIsOpen(false);
    }
    return (
        <div className="filter login"
            data-tooltip-id="tooltip"
            data-tooltip-content="Cambiar el filtro de búsqueda"
            data-tooltip-place="top"
        >
            <button type="button" className="icon-filter" onClick = {() => {openClose()}}>
                <img className='icon' src={`${endpointLocal}img/filter.png`} alt="Icono de filtro" />
                <img className={`select ${isOpen ? "open" : ""}`} src={`${endpointLocal}img/flecha_abajo.png`} alt="Icono para seleccionar" />
            </button>
            <div className={`filter-options ${isOpen ? "open" : ""}`}>
                <button className='filter-option' type="button" onClick = {() => {changeFilter(1)}}>
                    Clave
                </button>
                <button className='filter-option' type="button" onClick = {() => {changeFilter(2)}}>
                    Nombre
                </button>
                <button className='filter-option' type="button" onClick = {() => {changeFilter(3)}}>
                    Letra
                </button>
                <button className='filter-option' type="button" onClick = {() => {changeFilter(4)}}>
                    Grado
                </button>
                <button className='filter-option' type="button" onClick = {() => {changeFilter(5)}}>
                    Cohorte
                </button>
            </div>
        </div>
        );
}

export default Filter;