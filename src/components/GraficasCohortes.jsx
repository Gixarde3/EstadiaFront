import {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import config from "./config.json";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import React, { useRef } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import Filter from './Filter';
import autoTable from 'jspdf-autotable';

function GraficasCohortes() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement, 
        Title,
        Tooltip,
        Legend
    );
    const {id}= useParams();
    const reprobadosRef = useRef(null);
    const materiasRef = useRef(null);
    const periodosRef = useRef(null);
    const [materias, setMaterias] = useState([]);
    const [reprobados, setReprobados] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [cohorte, setCohorte] = useState(null);
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [dataReprobados, setDataReprobados] = useState(null);
    const [dataPeriodos, setDataPeriodos] = useState(null);
    const [dataMaterias, setDataMaterias] = useState(null);
    const [optionsReprobados, setOptionsReprobados] = useState(null);
    const [optionsPeriodos, setOptionsPeriodos] = useState(null);
    const [optionsMaterias, setOptionsMaterias] = useState(null);
    const [filtro, setFiltro] = useState(0);
    const filtros = [
        "Reporte de bajas por cohorte",
        "Calculo de matrícula por cohorte",
        "Materias con mayor cantidad de alumnos reprobados"
    ]
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getMaterias = async() => {
        try{
            const response = await axios.get(`${endpoint}/cohorte/calificaciones/${id}`);
            if(response.data.success){
                setMaterias(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const getReprobados = async() => {
        try{
            const response = await axios.get(`${endpoint}/cohorte/bajas/${id}`);
            if(response.data.success){
                setReprobados(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const getPeriodos = async() => {
        try{
            const response = await axios.get(`${endpoint}/cohorte/bajas/periodos/${id}`);
            if(response.data.success){
                setPeriodos(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const getCohorte = async() => {
        try{
            const response = await axios.get(`${endpoint}/cohorte/${id}`);
            if(response.data.success){
                setCohorte(response.data.cohorte);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    
    }
    useEffect(()=>{
        getCohorte();
        getMaterias();
        getReprobados();
        getPeriodos();
    }, [id]);
    useEffect(()=>{
        console.log(cohorte);
    }, [cohorte])
    useEffect(()=>{
        const graficarMaterias = async() => {
            setOptionsMaterias(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Distribución de reprobadas del cohorte:' + cohorte.periodo + cohorte.anio,
                        },
                    },
                }
            );
            setDataMaterias(
            {
                labels: materias.map((reprobado) => reprobado['materia']),
                datasets: [
                  {
                    label: ['Cantidades'],
                    data: materias.map((reprobado) => reprobado['reprobados']),
                    backgroundColor: [
                        '#CD8987',
                            '#533745',
                            '#202030',
                            '#626267',
                            '#86836D',
                            '#8F3985',
                            '#25283D',
                            '#0D1B2A',
                            '#1B263B',
                            '#415A77'
                        ]
                  },
                ]
              }
            );
        }
        
        if(materias && materias.length !== 0 && cohorte){
            graficarMaterias();
            console.log(materias);
        }
    }, [materias, cohorte]);
    useEffect(()=>{
        const graficarPeriodos = async() => {
            setOptionsPeriodos(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Periodos en los que más alumnos han salido del cohorte: ' + cohorte.periodo + cohorte.anio,
                        },
                    },
                }
            );
            setDataPeriodos(
                {
                    labels: periodos.map((periodo) => periodo['periodo']),
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: periodos.map((periodo) => periodo['total']),
                        backgroundColor: [
                            '#CD8987',
                            '#533745',
                            '#202030',
                            '#626267',
                            '#86836D',
                            '#8F3985',
                            '#25283D',
                            '#0D1B2A',
                            '#1B263B',
                            '#415A77'
                        ]
                      },
                    ]
                  }
                );
        }
        if(periodos && periodos.length !== 0 && cohorte){
            graficarPeriodos();
            console.log("Periodos: ");
            console.log(periodos);
        }
    }, [periodos, cohorte])

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
                            text: 'Distribución de actividad de los alumnos del cohorte: ' + cohorte.periodo + cohorte.anio,
                        },
                    },
                }
            );
            setDataReprobados(
                {
                    labels: ['Activos', 'Baja Temporal', 'Baja Definitiva'],
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: [reprobados.activos, reprobados.temporal, reprobados.definitiva],
                        backgroundColor: [
                            '#CD8987',
                            '#533745',
                            '#202030',
                            '#626267',
                            '#86836D',
                            '#8F3985',
                            '#25283D',
                            '#0D1B2A',
                            '#1B263B',
                            '#415A77'
                        ]
                      },
                    ]
                  }
                );
        }
        if(reprobados && reprobados.activos !== null && cohorte){
            graficarReprobados();
           
        }
        console.log(reprobados);
    }, [reprobados, cohorte])
    const handleExport = () => { 
        const font = config.font;
        const reprobadosCanvas = reprobadosRef ? (reprobadosRef.current ? reprobadosRef.current.canvas : null ) : null;
        const materiasCanvas = materiasRef ? (materiasRef.current ? materiasRef.current.canvas : null ) : null;
        const periodosCanvas = periodosRef ? (periodosRef.current ? periodosRef.current.canvas : null ) : null;
        const pdf = new jsPDF({ filters: ["ASCIIHexEncode"] });
        pdf.addFileToVFS("RethinkSans.ttf", font);
        pdf.addFont("RethinkSans.ttf", "Rethink", "normal");
        pdf.setFont("Rethink"); // set font
        pdf.setFontSize(15);
        let filtroPdf = "";
        if(reprobadosCanvas){
            var canvas = reprobadosCanvas;
            var imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 190);
            autoTable(pdf, {
                head: [['Estado', 'Cantidad de alumnos']],
                body: [['Activos', reprobados.activos], ['Baja temporal', reprobados.temporal], ['Baja definitiva', reprobados.definitiva]],
                margin: { top: 205 },
            });
            filtroPdf = "bajas";
        }
        if(materiasCanvas){
            var canvas = materiasCanvas;
            var imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 190);
            autoTable(pdf, {
                head: [['Materia', 'Cantidad de reprobados']],
                body: materias.map((materia) => [materia.materia, materia.reprobados]),
                margin: { top: 205 },
            });
            filtroPdf = "materias";
        }
        if(periodosCanvas){
            var canvas = periodosCanvas;
            var imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 190);
            autoTable(pdf, {
                head: [['Periodo', 'Cantidad de bajas']],
                body: periodos.map((periodo) => [periodo.periodo, periodo.bajas]),
                margin: { top: 205 },
            });
            filtroPdf = "periodos";
        }
        pdf.save("Graficas_cohorte_"+id+"_"+filtroPdf+".pdf");
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
        if(materiasRef && materiasRef.current){
            const canvas = materiasRef.current.canvas;
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'materias.png';
            link.click();
        }
        if(periodosRef && periodosRef.current){
            const canvas = periodosRef.current.canvas;
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'periodos.png';
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
        if(materiasRef && materiasRef.current){
            const canvas = materiasRef.current.canvas;
            const imgData = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'materias.jpg';
            link.click();
        }
        if(periodosRef && periodosRef.current){
            const canvas = periodosRef.current.canvas;
            const imgData = canvas.toDataURL('image/jpg');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'periodos.jpg';
            link.click();
        }
    }
    return (
    <>
        <h1>Gráficas del cohorte: {cohorte ? (cohorte.periodo + cohorte.anio) : ""}</h1>
        <h2>Selecciona un filtro para ver las gráficas</h2>
        <Filter setValue={(value) => setFiltro(value)} filters={filtros}/>
        {
            filtro === 2 ? 
                dataMaterias && optionsMaterias ?
                <div className="grafica result">
                    <Pie options={optionsMaterias} data={dataMaterias} ref={materiasRef}/> 
                </div>
                :
                <h2>No hay información de las materias más reprobadas de este cohorte</h2>
            :
            null
        }
        {
            filtro === 1 ? 
                dataPeriodos && optionsPeriodos ?
                <div className="grafica result">
                    <Pie options={optionsPeriodos} data={dataPeriodos} ref={periodosRef}/> 
                </div>
                :
                <h2>No hay información de los periodos con más bajas de los alumnos en este cohorte</h2>
            :
                null
        }
        {
            filtro === 0 ? 
                dataReprobados && optionsReprobados && reprobados.activos != null ? 
                <div className="grafica result">
                    <Pie options={optionsReprobados} data={dataReprobados} ref={reprobadosRef}/> 
                    
                </div>
                : 
                <h2>No hay información de la actividad de los alumnos en este cohorte</h2>
            :
            null
        }
        <div className="buttonsExport result">
            {cohorte ? <button className='login' onClick={() => (handleExport())}>Exportar gráficas a PDF</button> : null}
            {cohorte ? <button className='login' onClick={() => (handleExportPNG())}>Exportar gráficas a PNG</button> : null}
            {cohorte ? <button className='login' onClick={() => (handleExportJPG())}>Exportar gráficas a JPG</button> : null}
        </div>
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

export default GraficasCohortes;