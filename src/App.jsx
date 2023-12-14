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
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
