import React, { useState } from 'react';
import TablaAsignaciones from './TablaAsignaciones';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const handleBusqueda = (e) => setBusqueda(e.target.value);

  const handleGuardarAsignacion = (asignacion, indexEditando) => {
    if (indexEditando !== null) {
      const nuevasAsignaciones = [...asignaciones];
      nuevasAsignaciones[indexEditando] = asignacion;
      setAsignaciones(nuevasAsignaciones);
    } else {
      setAsignaciones([...asignaciones, asignacion]);
    }
  };

  const handleEliminar = (index) => {
    const nuevas = [...asignaciones];
    nuevas.splice(index, 1);
    setAsignaciones(nuevas);
  };

  const handleLogout = () => navigate('/');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {/* <button className="logout-button" onClick={handleLogout}>🚪 Cerrar sesión</button> */}
        <h2 className="titulo">¡Bienvenido, Administrador!</h2>
        <div className="busqueda-area">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>
      </div>

      <TablaAsignaciones
        datos={asignaciones}
        onEditar={() => {}} // Se maneja internamente en TablaAsignaciones
        onEliminar={handleEliminar}
        onGuardarAsignacion={handleGuardarAsignacion}
        busqueda={busqueda}
      />
    </div>
  );
};

export default Dashboard;