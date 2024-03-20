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
import { Bar, Pie, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Filter from './Filter';
function GraficasBajas() {
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
    const reprobadosRef = useRef(null);
    const [reprobados, setReprobados] = useState([]);
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [dataReprobados, setDataReprobados] = useState(null);
    const [optionsReprobados, setOptionsReprobados] = useState(null);
    const [anio1, setAnio1] = useState(0);
    const [anio2, setAnio2] = useState(0);
    const [carrera, setCarrera] = useState("");
    const [filter, setFilter] = useState(0);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getReprobados = async() => {
        try{
            if(carrera === ""){
                openAlert("Error al obtener los datos", "Selecciona una carrera para obtener los datos", "error", null);
                return;
            }
            if(anio1 >= anio2){
                openAlert("Error al obtener los datos", "El año inicial debe ser menor al año final", "error", null);
                return;
            }
            const response = await axios.get(`${endpoint}/bajas/rango/${anio1}/${anio2}/${carrera}`);
            if(response.data.success){
                setReprobados(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    useEffect(()=>{
        if(anio1 > 0 && anio2 > 0 && carrera !== ""){
            getReprobados();
        }
    }, [anio1, anio2, carrera, filter]);
    useEffect(()=>{
        const graficarReprobados = async() => {
            setOptionsReprobados(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Analisis de bajas en el rango de cohortes ' + anio1 + " - " + anio2 + " de la carrera " + carrera,
                        },
                    },
                }
            );
            setDataReprobados(
                {
                    labels: reprobados.map((reprobado)=>reprobado.cohorte),
                    datasets: [
                        (filter === 0 || filter === 3 ) &&
                        {
                            label: 'Baja definitiva',
                            data: reprobados.map((reprobado)=>reprobado.definitivas),
                            backgroundColor: ['#CD8987'],
                            borderColor: ['#CD8987']
                        },
                        (filter === 1 || filter === 3 ) &&
                        {
                            label: 'Baja temporal',
                            data: reprobados.map((reprobado)=>reprobado.temporal),
                            backgroundColor: ['#533745'],
                            borderColor: ['#533745']
                        },
                        (filter === 2 || filter === 3 ) &&
                        {
                            label: 'Total de bajas',
                            data: reprobados.map((reprobado)=>reprobado.total),
                            backgroundColor: ['#202030'],
                            borderColor: ['#202030']
                        }
                    ]
                  }
                );
        }
        if(reprobados && reprobados.activos !== null && anio1 > 0 && anio2 > 0 && carrera !== ""){
            graficarReprobados();
           
        }
    }, [reprobados, anio1, anio2, carrera, filter]);
    const handleExport = () => { 
        const font = config.font;
        const reprobadosCanvas = reprobadosRef ? (reprobadosRef.current ? reprobadosRef.current.canvas : null ) : null;
        const pdf = new jsPDF({ filters: ["ASCIIHexEncode"] });
        pdf.addFileToVFS("RethinkSans.ttf", font);
        pdf.addFont("RethinkSans.ttf", "Rethink", "normal");
        pdf.setFont("Rethink"); // set font
        pdf.setFontSize(15);
        let filtroPdf = "";
        if(reprobadosCanvas){
            var canvas = reprobadosCanvas;
            var imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
            autoTable(pdf, {
                head: [["Cohorte", "Bajas definitivas", "Bajas temporales", "Total de bajas"]],
                body: reprobados.map((reprobado)=>[reprobado.cohorte, reprobado.definitivas, reprobado.temporal, reprobado.total]),
                margin: { top: 110 },
            });
            filtroPdf = "bajas";
        }
        pdf.save("Graficas_bajasRango_"+anio1+"-"+anio2+"("+carrera+")"+".pdf");
    }

    const handleExportPNG = () => {
        if(reprobadosRef && reprobadosRef.current){
            const canvas = reprobadosRef.current.canvas;
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'reprobados.png';
            link.click();
        }
    }
    const handleExportJPG = () => {
        if(reprobadosRef && reprobadosRef.current){
            const canvas = reprobadosRef.current.canvas;
            const imgData = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'reprobados.jpg';
            link.click();
        }
    }
    return (
    <>
        <h1>Gráficas de bajas en general</h1>
        
        <h2>Selecciona un rango para ver las bajas dentro de ese rango de cohortes</h2>
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
        <h2>Filtro de tipo de bajas</h2>
        <Filter filters={["Bajas definitivas", "Bajas temporales", "Bajas totales", "Todas las bajas"]} setValue={(value)=>setFilter(value)}/>
        {
            dataReprobados && optionsReprobados &&
            <div className="result grafica">
                <Line data={dataReprobados} options={optionsReprobados} ref={reprobadosRef}/>
            </div>
        }
        {dataReprobados && <div className="buttonsExport result">
            {dataReprobados ? <button className='login' onClick={() => (handleExport())}>Exportar gráficas a PDF</button> : null}
            {dataReprobados ? <button className='login' onClick={() => (handleExportPNG())}>Exportar gráficas a PNG</button> : null}
            {dataReprobados ? <button className='login' onClick={() => (handleExportJPG())}>Exportar gráficas a JPG</button> : null}
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

export default GraficasBajas;