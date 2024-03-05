import {useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import config from "./config.json";
import Alert from "./Alert";
import "./css/dashboard.css";
import axios from "axios";
import React, { useRef } from 'react';
import autoTable from 'jspdf-autotable';
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

function GraficasCalificaciones() {
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
    const aprobadosRef = useRef(null);
    const aniosRef = useRef(null);
    const matriculasRef = useRef(null); 
    const [aprobados, setAprobados] = useState([]);
    const [reprobados, setReprobados] = useState([]);
    const [anios, setAnios] = useState([]);
    const [calificacion, setCalificacion] = useState(null);
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [dataAprobados, setDataAprobados] = useState(null);
    const [dataAnios, setDataAnios] = useState(null);
    const [optionsReprobados, setoptionsReprobados] = useState(null);
    const [optionsAnios, setOptionsAnios] = useState(null);
    const [matriculaCuatrimestre, setMatriculaCuatrimestre] = useState([]);
    const [optionsMatriculas, setOptionsMatriculas] = useState(null);
    const [dataMatriculas, setDataMatriculas] = useState(null);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getAprobadosReprobados = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificacion/aprobados/${id}`);
            if(response.data.success){
                setAprobados(response.data.aprobados);
                setReprobados(response.data.reprobados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    }
    const getCalificacion = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificacion/${id}`);
            if(response.data.success){
                setCalificacion(response.data.calificacion);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    
    }
    const getAniosByMatricula = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificacion/matriculas/${id}`);
            if(response.data.success){
                setAnios(response.data.anios);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    };
    const getMatriculasCuatrimestre = async() => {
        try{
            const response = await axios.get(`${endpoint}/calificacion/matriculasPorCuatrimestre/${id}`);
            if(response.data.success){
                setMatriculaCuatrimestre(response.data.resultados);
            }else{
                openAlert("Error al obtener los datos", "No se han podido obtener los datos por error: " + response.data.message, "error", null);
            }
        }catch(error){
            openAlert("Error de conexión", `La petición ha fallado por ${error}`, "error", null);
        }
    };
    useEffect(()=>{
        getCalificacion();
        getAprobadosReprobados();
        getAniosByMatricula();
        getMatriculasCuatrimestre();
    }, [id]);
    useEffect(()=>{
        const graficarReprobados = async() => {
            setoptionsReprobados(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Reprobados vs Aprobados del calificacion: ' + calificacion.periodo + calificacion.anio,
                        },
                    },
                }
            );
            setDataAprobados(
            {
                labels: ['Aprobados', 'Reprobados'],
                datasets: [
                  {
                    label: ['Cantidades'],
                    data: [aprobados, reprobados],
                    backgroundColor: ['#CD8987','#533745']
                  },
                ]
              }
            );
        }
        
        if(aprobados && reprobados && calificacion){
            graficarReprobados();
        }
    }, [aprobados, reprobados, calificacion]);
    useEffect(()=>{
        const graficarAniosByMatricula = async() => {
            setOptionsAnios(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Distribución de años en las matriculas del calificacion ' + calificacion.periodo + calificacion.anio,
                        },
                    },
                }
            );
            setDataAnios(
                {
                    labels: anios.map((anio) => "20"+anio['anio']),
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: anios.map((anio) => anio['cantidad']),
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
        if(anios && calificacion){
            graficarAniosByMatricula();
        }
    }, [anios, calificacion])

    useEffect(()=>{
        const graficarMatriculas = async() => {
            setOptionsMatriculas(
                {
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Distribución de matriculas por cuatrimestre en el periodo: ' + calificacion.periodo + calificacion.anio,
                        },
                    },
                }
            );
            const labels = []
            for(const grado in matriculaCuatrimestre){
                labels.push(grado);
            }
            const colores = [
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
            const dataCohortes = [];
            Object.keys(matriculaCuatrimestre).forEach((key)=>{
                matriculaCuatrimestre[key].forEach((datos)=>{
                    if(dataCohortes[datos.cohorte]){
                        dataCohortes[datos.cohorte].push({
                            grado: key,
                            cantidad: datos.cantidad
                        })
                    }else{
                        dataCohortes[datos.cohorte] = [{
                            grado: key,
                            cantidad: datos.cantidad
                        }];
                    }
                })
            })
            const datasets = [];
            Object.keys(dataCohortes).forEach((key, index)=>{
                const data = [];
                labels.forEach((label)=>{
                    const dato = dataCohortes[key].find((dato)=>dato.grado === label);
                    if(dato){
                        data.push(dato.cantidad);
                    }else{
                        data.push(0);
                    }
                })
                datasets.push({
                    label: key,
                    data: data,
                    backgroundColor: colores[index]
                })
            })
            setDataMatriculas({
                    labels,
                    datasets
            });
        }
        if(matriculaCuatrimestre.length !== 0 && calificacion){
            graficarMatriculas();
        }
        
    }, [matriculaCuatrimestre, calificacion]);
    const handleExport = () => {
        const font = config.font;
        const input = aprobadosRef.current.canvas;
        const canvas = input;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ filters: ["ASCIIHexEncode"] });
        pdf.addFileToVFS("RethinkSans.ttf", font);
        pdf.addFont("RethinkSans.ttf", "Rethink", "normal");
        pdf.setFont("Rethink"); // set font
        pdf.setFontSize(15);
        const inputMatriculas = aniosRef.current.canvas;
        const canvasMatriculas = inputMatriculas;
        const imgDataMatriculas = canvasMatriculas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
        pdf.text("Aprobados: " + aprobados + "\nReprobados: " + reprobados, 10, 115);
        pdf.addPage();
        pdf.addImage(imgDataMatriculas, 'PNG', 10, 10, 190, 190);
        pdf.text("Cantidad de matriculas por año: ", 10, 205)
        pdf.text(anios.map((anio) => "20"+anio['anio'] + ": " + anio['cantidad']).join(", "), 10, 210);
        pdf.addPage();
        const inputMatriculasByCuatri = matriculasRef.current.canvas;
        const canvasMatriculasByCuatri = inputMatriculasByCuatri;
        const imgDataMatriculasByCuatri = canvasMatriculasByCuatri.toDataURL('image/png');
        pdf.addImage(imgDataMatriculasByCuatri, 'PNG', 10, 10, 190, 100);
        const dataCohortes = [];
        Object.keys(matriculaCuatrimestre).forEach((key)=>{
            matriculaCuatrimestre[key].forEach((datos)=>{
                if(dataCohortes[datos.cohorte]){
                    dataCohortes[datos.cohorte].push({
                        grado: key,
                        cantidad: datos.cantidad
                    })
                }else{
                    dataCohortes[datos.cohorte] = [{
                        grado: key,
                        cantidad: datos.cantidad
                    }];
                }
            })
        })
        
        const grados = [];
        Object.keys(matriculaCuatrimestre).forEach((key)=>{
            grados.push(key);
        })
        console.log(grados);
        console.log(dataCohortes);
        const cohortes = [];
        Object.keys(dataCohortes).forEach((key, index)=>{
            cohortes.push(key);
        });
        const gradosCohortes = [];
        grados.forEach((grado)=>{
            gradosCohortes[grado] = [];
            cohortes.forEach((cohorte)=>{
                gradosCohortes[grado].push(0);
            });
        });
        console.log(gradosCohortes);
        Object.keys(dataCohortes).forEach((key, index)=>{
            dataCohortes[key].forEach((dato)=>{
                gradosCohortes[dato.grado][index] = dato.cantidad;
            })
        });
        const headTable = [];
        const bodyTable = [];
        headTable.push("Grado");
        cohortes.forEach((cohorte)=>{
            headTable.push(cohorte);
        });
        grados.forEach((grado)=>{
            const row = [];
            row.push(grado);
            gradosCohortes[grado].forEach((cantidad)=>{
                row.push(cantidad);
            });
            bodyTable.push(row);
        });
        console.log(headTable);
        console.log(bodyTable);
        autoTable(pdf, {
            head: [
                headTable
            ],
            body: bodyTable,
            margin: { top: 110 }
        })
        pdf.save("Graficas_calificaciones_"+id+".pdf");
    }
    return (
    <>
        {dataAprobados && optionsReprobados ? 
        <div className="result grafica">
            <Bar options={optionsReprobados} data={dataAprobados} ref={aprobadosRef}/> 
        </div>
        : null}
        {dataAnios && optionsAnios ? 
        <div className="result grafica">
            <Pie options={optionsAnios} data={dataAnios} ref={aniosRef}/> 
        </div>
        : null}
        {
            calificacion && optionsMatriculas && dataMatriculas ?
            <div className="result grafica">
                <Bar options={optionsMatriculas} data={dataMatriculas} ref={matriculasRef}/>
            </div> :
            <h2>No hay ni calificacion ni opciones ni matriculas</h2>
        }
        {calificacion ? <button className='login' onClick={() => (handleExport())}>Exportar gráficas</button> : null}
        
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

export default GraficasCalificaciones;