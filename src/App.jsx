import 'normalize.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Recuperacion from './components/Recuperacion';
import Recuperar from './components/Recuperar';
import DashboardLayout from './components/DashboardLayaout';
import GestionUsuarios from './components/GestionUsuarios';
import EditarUsuario from './components/EditarUsuario';
import GestionCohortes from './components/GestionCohortes';
import EditarCohorte from './components/EditarCohorte';
import GestionCalificaciones from './components/GestionCalificaciones';
import GestionBajas from './components/GestionBajas';
import GraficasCohortes from './components/GraficasCohortes';
import GestionGrupos from './components/GestionGrupos';
import EditarGrupos from './components/EditarGrupos';
import GestionBD from './components/GestionBD';
/**
 * 
 * Rutas de la aplicación, cada página se encuentra organizada por sus posibles rutas para mantener un orden
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login/>}/>
          <Route path="recuperacion" element={<Recuperacion/>}/>
          <Route path="restaurar/:hash" element={<Recuperar/>}/>

          <Route path="dashboard">

            <Route index element={<Navigate to="/dashboard/usuarios" />} />
            <Route path="usuarios">
              <Route index element={<DashboardLayout Page={GestionUsuarios}/>}/>
              <Route path="editar/:id" element={<DashboardLayout Page={EditarUsuario}/>}/>
            </Route>

            <Route path="cohortes">
              <Route index element={<DashboardLayout Page={GestionCohortes}/>}/>
              <Route path="editar/:id" element={<DashboardLayout Page={EditarCohorte}/>}/>
              <Route path="graficas/:id" element={<DashboardLayout Page={GraficasCohortes}/>}/>
            </Route>

            <Route path="calificaciones">
              <Route index element={<DashboardLayout Page={GestionCalificaciones}/>}/>
            </Route>
            <Route path="bajas">
              <Route index element={<DashboardLayout Page={GestionBajas}/>}/>
            </Route>
            <Route path="grupos">
              <Route index element={<DashboardLayout Page={GestionGrupos}/>}/>
              <Route path="editar/:id" element={<DashboardLayout Page={EditarGrupos}/>}/>
            </Route>
            <Route path="BD">
              <Route index element={<DashboardLayout Page={GestionBD}/>}/>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
