import React, { useEffect, useState } from 'react';
import FormEquipo from './FormEquipo';
import '../styles/TablaAsignaciones.css';

const TablaAsignaciones = ({ onEditar, onEliminar, onGuardarAsignacion, busqueda }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroSede, setFiltroSede] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('');
  const [indexEditando, setIndexEditando] = useState(null);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await fetch('/data.json');

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const json = await response.json();
        
        // Verificar que el JSON sea un array o tenga una propiedad que sea array
        if (Array.isArray(json)) {
          setDatos(json);
        } else if (json && Array.isArray(json.data)) {
          // Si el JSON tiene estructura { data: [...] }
          setDatos(json.data);
        } else if (json && typeof json === 'object') {
          // Si el JSON es un objeto, convertir a array con un elemento
          setDatos([json]);
        } else {
          throw new Error('El formato del JSON no es válido');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
        setDatos([]); // Asegurar que datos sea siempre un array
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); 

  const toggleDetalles = () => setMostrarDetalles(!mostrarDetalles);

  const handleFiltroSede = (e) => setFiltroSede(e.target.value);
  const handleFiltroCargo = (e) => setFiltroCargo(e.target.value);

  const handleGuardarAsignacion = (asignacion) => {
    onGuardarAsignacion(asignacion, indexEditando);
    setMostrarFormulario(false);
    setIndexEditando(null);
  };

  const handleEditar = (index) => {
    setIndexEditando(index);
    setMostrarFormulario(true);
  };

  const handleEliminar = (index) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar esta asignación?");
    if (confirmacion) {
      onEliminar(index);
    }
  };

  // Filtrar datos localmente
  // const datosFiltrados = datos.filter((item) => {
  //   const matchBusqueda = busqueda ? Object.values(item).some((val) =>
  //     val.toLowerCase().includes(busqueda.toLowerCase())
  //   ) : true;
  //   const matchSede = filtroSede ? item.sede === filtroSede : true;
  //   const matchCargo = filtroCargo ? item.cargo.toLowerCase().includes(filtroCargo.toLowerCase()) : true;

  //   return matchBusqueda && matchSede && matchCargo;
  // });

  // Mostrar estados de carga y error
  if (cargando) {
    return <div className="tabla-wrapper">Cargando datos...</div>;
  }

  if (error) {
    return (
      <div className="tabla-wrapper">
        <div className="error-message">
          Error al cargar los datos: {error}
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  // Verificación adicional antes del render
  if (!Array.isArray(datos)) {
    console.error('datos no es un array:', datos);
    return <div className="tabla-wrapper">Error: Los datos no tienen el formato correcto</div>;
  }

  return (
    <div className="tabla-wrapper">
      {/* Filtros adicionales */}
      <div className="filtros-extra">
        <select value={filtroSede} onChange={handleFiltroSede}>
          <option value="" className='option'>📍 Filtrar por Sede</option>
          <option value="Connecta 80" className='option'>Connecta 80</option>
          <option value="Cota" className='option'>Cota</option>
          <option value="Medellin" className='option'>Medellín</option>
          <option value="Cali" className='option'>Cali</option>
          <option value="Bucaramanga" className='option'>Bucaramanga</option>
          <option value="235" className='option'>235</option>
          <option value="zona franca" className='option'>Zona Franca</option>
          <option value="duitama" className='option'>Duitama</option>
        </select>

        <div className='tabla-actions'>
          <button onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setIndexEditando(null);
          }}
          >
            {mostrarFormulario ? '🔽 Ocultar Formulario' : 'Registrar Equipo'}
          </button>

          <button onClick={toggleDetalles}>
            {mostrarDetalles ? 'Ocultar detalles' : 'Mostrar todos los campos'}
          </button>
        </div>
      </div>

      {/* Formulario de registro/edición */}
      {mostrarFormulario && (
        <FormEquipo
          onGuardar={handleGuardarAsignacion}
          datosEditar={indexEditando !== null ? datos[indexEditando] : null}
        />
      )}

      {/* Mostrar mensaje si no hay datos */}
      {datos.length === 0 ? (
        <div className="no-datos">
          No hay datos para mostrar
        </div>
      ) : (
        /* Tabla de asignaciones */
        <table className="tabla-asignaciones">
          <thead>
            <tr className='tabla-asignaciones-head'>
              <th>ID Usuario</th>
              <th>Usuario</th>
              <th>Cargo</th>
              <th>Sede</th>
              <th>Tipo Equipo</th>
              <th>Marca</th>
              <th>Serial</th>
              <th>Estado</th>
              {mostrarDetalles && (
                <>
                  <th>Dirección</th>
                  <th>Gerencia</th>
                  <th>Modelo</th>
                  <th>Tipo Contrato</th>
                  <th>Estado Acta</th>
                  <th>Fecha Entrega</th>
                  <th>Cargador Laptop</th>
                  <th>Docking Station</th>
                  <th>Cargador Docking</th>
                  <th>Monitor</th>
                  <th>Maleta</th>
                  <th>Guaya</th>
                  <th>Adaptador</th>
                </>
              )}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato, index) => (
              <tr key={dato.id || index} className='tabla-asignacion-body'>
                <td>{dato.id || 'N/A'}</td>
                <td>{dato.usuario || 'N/A'}</td>
                <td>{dato.cargo || 'N/A'}</td>
                <td>{dato.sede || 'N/A'}</td>
                <td>{dato.tipoEquipo || 'N/A'}</td>
                <td>{dato.marca || 'N/A'}</td>
                <td>{dato.serial || 'N/A'}</td>
                <td>{dato.estado || 'N/A'}</td>
                {mostrarDetalles && (
                  <>
                    <td>{dato.direccion || 'N/A'}</td>
                    <td>{dato.gerencia || 'N/A'}</td>
                    <td>{dato.modelo || 'N/A'}</td>
                    <td>{dato.tipoContrato || 'N/A'}</td>
                    <td>{dato.estadoActa || 'N/A'}</td>
                    <td>{dato.fechaEntrega || 'N/A'}</td>
                    <td>{dato.cargadorLaptop || 'N/A'}</td>
                    <td>{dato.dockingStation || 'N/A'}</td>
                    <td>{dato.cargadorDocking || 'N/A'}</td>
                    <td>{dato.monitor || 'N/A'}</td>
                    <td>{dato.maleta || 'N/A'}</td>
                    <td>{dato.guaya || 'N/A'}</td>
                    <td>{dato.adaptador || 'N/A'}</td>
                  </>
                )}
                <td className='tabla-asignacion-actions'>
                  <button onClick={() => handleEditar(index)}>🖊️</button>
                  <button onClick={() => handleEliminar(index)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaAsignaciones;