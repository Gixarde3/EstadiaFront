import {useState, useEffect} from 'react'
import config from "./config.json";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import React, { useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LineElement,
    BarElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Filter from './Filter';
function GraficasAdmisiones() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        ArcElement, 
        Title,
        Tooltip,
        Legend
    );
    const admisionesRef = useRef(null);
    const [admisiones, setAdmisiones] = useState([]);
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [dataAdmisiones, setDataAdmisiones] = useState(null);
    const [optionsAdmisiones, setOptionsAdmisiones] = useState(null);
    const [anio1, setAnio1] = useState(0);
    const [anio2, setAnio2] = useState(0);
    const [carrera, setCarrera] = useState("");
    const [filter, setFilter] = useState(0);
    const filtrosNames = [
        "fichas",
        "inscritos",
        "examenes",
        "aprobados"
    ]
    const filtrosLargos = ["Fichas vendidas", "Trámites completos", "Exámenes presentados", "número de alumnos aprobados en CENEVAL"];
    const colores = ['#CD8987',
    '#533745',
    '#202030',
    '#626267',
    '#86836D',
    '#8F3985',
    '#25283D',
    '#0D1B2A',
    '#1B263B',
    '#415A77'];
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getAdmisiones = async() => {
        try{
            if(carrera === ""){
                openAlert("Error al obtener los datos", "Selecciona una carrera para obtener los datos", "error", null);
                return;
            }
            if(anio1 >= anio2){
                openAlert("Error al obtener los datos", "El año inicial debe ser menor al año final", "error", null);
                return;
            }
            const response = await axios.get(`${endpoint}/aspirantes/${filtrosNames[filter]}/${anio1}/${anio2}/${carrera}`);
            if(response.data.success){
                setAdmisiones(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    useEffect(()=>{
        if(anio1 > 0 && anio2 > 0 && carrera !== ""){
            getAdmisiones();
        }
    }, [anio1, anio2, carrera, filter]);
    useEffect(()=>{
        const graficarAdmisiones = async() => {
            setOptionsAdmisiones(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Análisis de admisiones: ' + filtrosLargos[filter] + " en el rango de " + anio1 + " a " + anio2 + " en la carrera de " + carrera,
                        },
                    },
                }
            );
            setDataAdmisiones(
                {
                    labels: admisiones.map((admision)=>admision.anio),
                    datasets: [
                        {
                            label: 'Total',
                            data: admisiones.map((admision)=>admision.total),
                            backgroundColor: colores,
                            borderColor: colores,
                        }
                    ]
                  }
                );
        }
        if(admisiones && admisiones.activos !== null && anio1 > 0 && anio2 > 0 && carrera !== ""){
            graficarAdmisiones();
        }
    }, [admisiones, anio1, anio2, carrera, filter]);
    const handleExport = () => { 
        const font = config.font;
        const admisionesCanvas = admisionesRef ? (admisionesRef.current ? admisionesRef.current.canvas : null ) : null;
        const pdf = new jsPDF({ filters: ["ASCIIHexEncode"] });
        pdf.addFileToVFS("RethinkSans.ttf", font);
        pdf.addFont("RethinkSans.ttf", "Rethink", "normal");
        pdf.setFont("Rethink"); // set font
        pdf.setFontSize(15);
        let filtroPdf = "";
        if(admisionesCanvas){
            var canvas = admisionesCanvas;
            var imgData = canvas.toDataURL('image/png');
            pdf.text("Grafica de " + filtrosLargos[filter] + " \nen el rango de " + anio1 + " a " + anio2 + " en la carrera de " + carrera, 10, 10);
            pdf.addImage(imgData, 'PNG', 10, 25, 190, 100);
            autoTable(pdf, {
                head: [["Año", "Total"]],
                body: admisiones.map((admision)=>[admision.anio, admision.total]),
                margin: { top: 135 },
            });
            filtroPdf = "bajas";
        }
        pdf.save("Graficas_admisionesRango_"+anio1+"-"+anio2+"("+carrera+")_"+filtrosLargos[filter]+".pdf");
    }

    const handleExportPNG = () => {
        if(admisionesRef && admisionesRef.current){
            const canvas = admisionesRef.current.canvas;
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'admisiones.png';
            link.click();
        }
    }
    const handleExportJPG = () => {
        if(admisionesRef && admisionesRef.current){
            const canvas = admisionesRef.current.canvas;
            const imgData = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'admisiones.jpg';
            link.click();
        }
    }
    return (
    <>
        <h1>Gráficas de admisiones en general</h1>
        
        <h2>Selecciona un rango para ver l@s {filtrosLargos[filter]} dentro de ese rango de cohortes</h2>
            <form action="" className="dashboardForm">
            <label htmlFor="anio1">Desde el: </label>
            <input type="number" maxLength={4} id="anio1" placeholder="Año inicial" className="inputDashboard" onChange={(e)=>(setAnio1(e.target.value))}/>
            <label htmlFor="anio2">Hasta el: </label>
            <input type="number" maxLength={4} id="anio2" placeholder="Año final" className="inputDashboard" onChange={(e)=>(setAnio2(e.target.value))}/>
            <label htmlFor="carrera">Selecciona una carrera:</label>
            <select name="carrera" id="carrera" onChange={(e)=>setCarrera(e.target.value)} className='inputDashboard'>
                <option value="">Selecciona una carrera</option>
                <option value="ITI">Ingeniería en Tecnologías de la Información</option>
                <option value="IBT">Ingeniería en Biotecnología</option>
                <option value="IET">Ingeniería Electrónica y Telecomunicaciones</option>
                <option value="LAE">Licenciatura en Administración y Gestión empresarial</option>
                <option value="IIN">Ingeniería industrial</option>
                <option value="IFI">ingeniería financiera</option>
            </select>
        </form>
        <h2>Filtro el tipo de gráfica</h2>
        <Filter filters={["Fichas vendidas", "Trámites completos", "Exámenes presentados", "número de alumnos aprobados en CENEVAL"]} setValue={(value)=>setFilter(value)}/>
        {
            dataAdmisiones && optionsAdmisiones &&
            <div className="result grafica">
                <Line data={dataAdmisiones} options={optionsAdmisiones} ref={admisionesRef}/>
            </div>
        }
        {dataAdmisiones && <div className="buttonsExport result">
            {dataAdmisiones ? <button className='login' onClick={() => (handleExport())}>Exportar gráficas a PDF</button> : null}
            {dataAdmisiones ? <button className='login' onClick={() => (handleExportPNG())}>Exportar gráficas a PNG</button> : null}
            {dataAdmisiones ? <button className='login' onClick={() => (handleExportJPG())}>Exportar gráficas a JPG</button> : null}
        </div>}
        <Alert 
            isOpen={alertOpen}
            title={alert ? alert.title : ""}
            message={alert ? alert.message : ""}
            kind={alert ? alert.kind : ""}
            closeAlert={closeAlert}
            redirectRoute={alert ? alert.redirectRoute : ""}
            onAccept={alert ? alert.onAccept : null}
        />
    </>);
}

export default GraficasAdmisiones;