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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';

function GraficasCohortes() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const {id}= useParams();
    const aprobadosRef = useRef(null);
    const [aprobados, setAprobados] = useState([]);
    const [reprobados, setReprobados] = useState([]);
    const [cohorte, setCohorte] = useState(null);
    const endpoint = config.endpoint;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [dataAprobados, setDataAprobados] = useState(null);
    const [optionsReprobados, setoptionsReprobados] = useState(null);
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
        getAprobadosReprobados();
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
                            text: 'Reprobados vs Aprobados del cohorte: ' + cohorte.plan,
                        },
                    },
                }
            );
            setDataAprobados(
            {
                labels: ['alumnos totales '],
                datasets: [
                  {
                    label: 'Aprobados',
                    data: [aprobados],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Reprobados',
                    data: [reprobados],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                ]
              }
            );
        }
        
        if(aprobados && reprobados && cohorte){
            graficarReprobados();
        }
    }, [aprobados, reprobados, cohorte]);

    const handleExport = () => { 
        const input = aprobadosRef.current.canvas;
        console.log(input);
        const canvas = input;
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
        pdf.save("download.pdf");
    }
    return (
    <>
        {dataAprobados && optionsReprobados ? <Bar options={optionsReprobados} data={dataAprobados} ref={aprobadosRef}/> : null}
        {cohorte ? <button className='login' onClick={() => (handleExport())}>Exportar gráficas</button> : null}
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