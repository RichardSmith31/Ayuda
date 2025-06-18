import React, { useEffect, useState } from 'react';
import FormEquipo from './FormEquipo';
import '../styles/TablaAsignaciones.css';

const TablaAsignaciones = ({ busqueda }) => {
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
          setDatos(json.data);
        } else if (json && typeof json === 'object') {
          setDatos([json]);
        } else {
          throw new Error('El formato del JSON no es válido');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
        setDatos([]);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); 

  // Función para generar un nuevo ID automáticamente
  const generarNuevoId = () => {
    if (datos.length === 0) return 1;
    const maxId = Math.max(...datos.map(item => item.id || 0));
    return maxId + 1;
  };

  // Función para guardar o actualizar una asignación
  const handleGuardarAsignacion = (asignacion, indexEditar = null) => {
    if (indexEditar !== null) {
      // Actualizar registro existente
      const datosActualizados = [...datos];
      datosActualizados[indexEditar] = {
        ...asignacion,
        id: datos[indexEditar].id // Mantener el ID original
      };
      setDatos(datosActualizados);
    } else {
      // Crear nuevo registro
      const nuevaAsignacion = {
        ...asignacion,
        id: generarNuevoId()
      };
      setDatos([...datos, nuevaAsignacion]);
    }
    
    setMostrarFormulario(false);
    setIndexEditando(null);
  };

  // Función para eliminar una asignación
  const handleEliminar = (index) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar esta asignación?");
    if (confirmacion) {
      const datosActualizados = datos.filter((_, i) => i !== index);
      setDatos(datosActualizados);
    }
  };

  const toggleDetalles = () => setMostrarDetalles(!mostrarDetalles);

  const handleFiltroSede = (e) => setFiltroSede(e.target.value);
  const handleFiltroCargo = (e) => setFiltroCargo(e.target.value);

  const handleEditar = (index) => {
    setIndexEditando(index);
    setMostrarFormulario(true);
  };

  // Filtrar datos localmente
  const datosFiltrados = datos.filter((item) => {
    const matchBusqueda = busqueda ? Object.values(item).some((val) =>
      String(val).toLowerCase().includes(busqueda.toLowerCase())
    ) : true;
    const matchSede = filtroSede ? item.sede === filtroSede : true;
    const matchCargo = filtroCargo ? String(item.cargo).toLowerCase().includes(filtroCargo.toLowerCase()) : true;

    return matchBusqueda && matchSede && matchCargo;
  });

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

        <input
          type="text"
          placeholder="🔍 Filtrar por cargo..."
          value={filtroCargo}
          onChange={handleFiltroCargo}
          className="filtro-cargo"
        />

        <div className='tabla-actions'>
          <button onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setIndexEditando(null);
          }}>
            {mostrarFormulario ? '🔽 Ocultar Formulario' : '➕ Registrar Equipo'}
          </button>

          <button onClick={toggleDetalles}>
            {mostrarDetalles ? '👁️‍🗨️ Ocultar detalles' : '👀 Mostrar todos los campos'}
          </button>
        </div>
      </div>

      {/* Formulario de registro/edición */}
      {mostrarFormulario && (
        <FormEquipo
          onGuardar={handleGuardarAsignacion}
          datosEditar={indexEditando !== null ? datos[indexEditando] : null}
          indexEditando={indexEditando}
        />
      )}

      {/* Mostrar estadísticas */}
      <div className="estadisticas">
        <p>📊 Total de registros: <strong>{datos.length}</strong></p>
        <p>🔍 Registros filtrados: <strong>{datosFiltrados.length}</strong></p>
      </div>

      {/* Mostrar mensaje si no hay datos */}
      {datosFiltrados.length === 0 ? (
        <div className="no-datos">
          {datos.length === 0 ? 
            "No hay datos para mostrar" : 
            "No se encontraron registros con los filtros aplicados"
          }
        </div>
      ) : (
        /* Tabla de asignaciones */
        <table className="tabla-asignaciones">
          <thead>
            <tr className='tabla-asignaciones-head'>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
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
                  <th>Laptop</th>
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
            {datosFiltrados.map((dato, index) => {
              // Encontrar el índice real en el array original
              const indexReal = datos.findIndex(item => item.id === dato.id);
              
              return (
                <tr key={dato.id || index} className='tabla-asignacion-body'>
                  <td><strong>{dato.id || 'N/A'}</strong></td>
                  <td>{dato.usuario || 'N/A'}</td>
                  <td>{dato.nombre || 'N/A'}</td>
                  <td>{dato.cargo || 'N/A'}</td>
                  <td>{dato.sede || 'N/A'}</td>
                  <td>{dato.tipoEquipo || 'N/A'}</td>
                  <td>{dato.marca || 'N/A'}</td>
                  <td>{dato.serial || 'N/A'}</td>
                  <td>
                    <span className={`estado-badge ${dato.estado?.toLowerCase() || ''}`}>
                      {dato.estado || 'N/A'}
                    </span>
                  </td>
                  {mostrarDetalles && (
                    <>
                      <td>{dato.direccion || 'N/A'}</td>
                      <td>{dato.gerencia || 'N/A'}</td>
                      <td>{dato.modelo || 'N/A'}</td>
                      <td>{dato.tipoContrato || 'N/A'}</td>
                      <td>{dato.estadoActa || 'N/A'}</td>
                      <td>{dato.fechaEntrega || 'N/A'}</td>
                      <td>{dato.laptop || 'N/A'}</td>
                      <td>{dato.cargadorLaptop || 'N/A'}</td>
                      <td>{dato.dockingStation || dato.docking || 'N/A'}</td>
                      <td>{dato.cargadorDocking || 'N/A'}</td>
                      <td>{dato.monitor || 'N/A'}</td>
                      <td>{dato.maleta || 'N/A'}</td>
                      <td>{dato.guaya || 'N/A'}</td>
                      <td>{dato.adaptador || 'N/A'}</td>
                    </>
                  )}
                  <td className='tabla-asignacion-actions'>
                    <button 
                      onClick={() => handleEditar(indexReal)}
                      title="Editar registro"
                      className="btn-editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleEliminar(indexReal)}
                      title="Eliminar registro"
                      className="btn-eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaAsignaciones;