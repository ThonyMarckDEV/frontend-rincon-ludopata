//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
// import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';

//UIS SERVICIOS
import CalculadoraSureBet from 'ui/Usuario/servicios/calculadora-sure-bet/CalculadoraSureBet';


// UIS ADMIN
// import ListarRoles from 'ui/Administrador/roles/listarRoles/ListarRoles';


// UIS USUARIO


// Utilities
// import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
// import ProtectedRouteUsuario from 'utilities/ProtectedRoutes/ProtectedRouteUsuario';
// import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';


function AppContent() {
  return (
    <Routes>

      {/* Rutas públicas */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/caluladora-sure-bet"
        element={<CalculadoraSureBet />}
      />

      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;