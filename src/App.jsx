import 'normalize.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Recuperacion from './components/Recuperacion';
import Recuperar from './components/Recuperar';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/recuperacion" element={<Recuperacion/>}/>
        <Route path="/restaurar/:hash" element={<Recuperar/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
