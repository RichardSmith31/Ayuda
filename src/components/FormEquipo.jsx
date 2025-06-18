import React, { useState, useEffect } from 'react';
import '../styles/FormEquipo.css';

const FormEquipo = ({ onGuardar, datosEditar, indexEditando }) => {
  const [form, setForm] = useState({
    usuario: '',
    nombre: '',
    cargo: '',
    sede: '',
    direccion: '',
    gerencia: '',
    tipoEquipo: '',
    marca: '',
    modelo: '',
    serial: '',
    estado: '',
    tipoContrato: '',
    estadoActa: '',
    fechaEntrega: '',
    laptop: '',
    cargadorLaptop: '',
    dockingStation: '',
    cargadorDocking: '',
    monitor: '',
    maleta: '',
    guaya: '',
    adaptador: ''
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (datosEditar) {
      setForm({
        usuario: datosEditar.usuario || '',
        nombre: datosEditar.nombre || '',
        cargo: datosEditar.cargo || '',
        sede: datosEditar.sede || '',
        direccion: datosEditar.direccion || '',
        gerencia: datosEditar.gerencia || '',
        tipoEquipo: datosEditar.tipoEquipo || '',
        marca: datosEditar.marca || '',
        modelo: datosEditar.modelo || '',
        serial: datosEditar.serial || '',
        estado: datosEditar.estado || '',
        tipoContrato: datosEditar.tipoContrato || '',
        estadoActa: datosEditar.estadoActa || '',
        fechaEntrega: datosEditar.fechaEntrega || '',
        laptop: datosEditar.laptop || '',
        cargadorLaptop: datosEditar.cargadorLaptop || '',
        dockingStation: datosEditar.dockingStation || datosEditar.docking || '',
        cargadorDocking: datosEditar.cargadorDocking || '',
        monitor: datosEditar.monitor || '',
        maleta: datosEditar.maleta || '',
        guaya: datosEditar.guaya || '',
        adaptador: datosEditar.adaptador || ''
      });
    } else {
      // Limpiar formulario para nuevo registro
      setForm({
        usuario: '',
        nombre: '',
        cargo: '',
        sede: '',
        direccion: '',
        gerencia: '',
        tipoEquipo: '',
        marca: '',
        modelo: '',
        serial: '',
        estado: '',
        tipoContrato: '',
        estadoActa: '',
        fechaEntrega: '',
        laptop: '',
        cargadorLaptop: '',
        dockingStation: '',
        cargadorDocking: '',
        monitor: '',
        maleta: '',
        guaya: '',
        adaptador: ''
      });
    }
    setErrores({});
  }, [datosEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Campos requeridos básicos
    if (!form.usuario.trim()) nuevosErrores.usuario = 'El usuario es requerido';
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!form.cargo.trim()) nuevosErrores.cargo = 'El cargo es requerido';
    if (!form.sede.trim()) nuevosErrores.sede = 'La sede es requerida';
    if (!form.tipoEquipo.trim()) nuevosErrores.tipoEquipo = 'El tipo de equipo es requerido';
    if (!form.marca.trim()) nuevosErrores.marca = 'La marca es requerida';
    if (!form.serial.trim()) nuevosErrores.serial = 'El serial es requerido';
    if (!form.estado.trim()) nuevosErrores.estado = 'El estado es requerido';
    
    // Validar formato de fecha si se proporciona
    if (form.fechaEntrega && !form.fechaEntrega.match(/^\d{4}-\d{2}-\d{2}$/)) {
      nuevosErrores.fechaEntrega = 'La fecha debe tener formato válido';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    // Preparar datos para enviar
    const datosLimpios = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim() || 'N/A'])
    );
    
    onGuardar(datosLimpios, indexEditando);
    
    // Limpiar formulario solo si es un nuevo registro
    if (indexEditando === null) {
      setForm({
        usuario: '',
        nombre: '',
        cargo: '',
        sede: '',
        direccion: '',
        gerencia: '',
        tipoEquipo: '',
        marca: '',
        modelo: '',
        serial: '',
        estado: '',
        tipoContrato: '',
        estadoActa: '',
        fechaEntrega: '',
        laptop: '',
        cargadorLaptop: '',
        dockingStation: '',
        cargadorDocking: '',
        monitor: '',
        maleta: '',
        guaya: '',
        adaptador: ''
      });
    }
  };

  return (
    <div className="form-equipo-container">
      <h3>
        {datosEditar ? '✏️ Editar Asignación' : '➕ Registrar Nueva Asignación de Equipo'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Información del Usuario */}
          <div className="seccion-form">
            <h4>👤 Información del Usuario</h4>
            
            <div className="form-group">
              <label>Usuario *</label>
              <input 
                name="usuario" 
                value={form.usuario} 
                onChange={handleChange} 
                placeholder="Ej: ricsanc"
                className={errores.usuario ? 'error' : ''}
              />
              {errores.usuario && <span className="error-message">{errores.usuario}</span>}
            </div>

            <div className="form-group">
              <label>Nombre Completo *</label>
              <input 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                placeholder="Ej: Richard Sanchez"
                className={errores.nombre ? 'error' : ''}
              />
              {errores.nombre && <span className="error-message">{errores.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Cargo *</label>
              <input 
                name="cargo" 
                value={form.cargo} 
                onChange={handleChange} 
                placeholder="Ej: Aprendiz SENA"
                className={errores.cargo ? 'error' : ''}
              />
              {errores.cargo && <span className="error-message">{errores.cargo}</span>}
            </div>

            <div className="form-group">
              <label>Sede *</label>
              <select 
                name="sede" 
                value={form.sede} 
                onChange={handleChange} 
                className={errores.sede ? 'error' : ''}
              >
                <option value="">Seleccionar sede</option>
                <option value="Connecta 80">Connecta 80</option>
                <option value="Cota">Cota</option>
                <option value="Medellin">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Bucaramanga">Bucaramanga</option>
                <option value="235">235</option>
                <option value="Zona Franca">Zona Franca</option>
                <option value="Duitama">Duitama</option>
              </select>
              {errores.sede && <span className="error-message">{errores.sede}</span>}
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input 
                name="direccion" 
                value={form.direccion} 
                onChange={handleChange} 
                placeholder="Dirección del usuario"
              />
            </div>

            <div className="form-group">
              <label>Gerencia</label>
              <input 
                name="gerencia" 
                value={form.gerencia} 
                onChange={handleChange} 
                placeholder="Gerencia a la que pertenece"
              />
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="seccion-form">
            <h4>💻 Información del Equipo</h4>
            
            <div className="form-group">
              <label>Tipo de Equipo *</label>
              <select 
                name="tipoEquipo" 
                value={form.tipoEquipo} 
                onChange={handleChange}
                className={errores.tipoEquipo ? 'error' : ''}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Tablet">Tablet</option>
                <option value="Otro">Otro</option>
              </select>
              {errores.tipoEquipo && <span className="error-message">{errores.tipoEquipo}</span>}
            </div>

            <div className="form-group">
              <label>Marca *</label>
              <input 
                name="marca" 
                value={form.marca} 
                onChange={handleChange} 
                placeholder="Ej: Lenovo"
                className={errores.marca ? 'error' : ''}
              />
              {errores.marca && <span className="error-message">{errores.marca}</span>}
            </div>

            <div className="form-group">
              <label>Modelo</label>
              <input 
                name="modelo" 
                value={form.modelo} 
                onChange={handleChange} 
                placeholder="Modelo del equipo"
              />
            </div>

            <div className="form-group">
              <label>Serial *</label>
              <input 
                name="serial" 
                value={form.serial} 
                onChange={handleChange} 
                placeholder="Ej: D12345678"
                className={errores.serial ? 'error' : ''}
              />
              {errores.serial && <span className="error-message">{errores.serial}</span>}
            </div>

            <div className="form-group">
              <label>Estado *</label>
              <select 
                name="estado" 
                value={form.estado} 
                onChange={handleChange}
                className={errores.estado ? 'error' : ''}
              >
                <option value="">Seleccionar estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="Dañado">Dañado</option>
              </select>
              {errores.estado && <span className="error-message">{errores.estado}</span>}
            </div>

            <div className="form-group">
              <label>Código Laptop</label>
              <input 
                name="laptop" 
                value={form.laptop} 
                onChange={handleChange} 
                placeholder="Ej: LAT-9982"
              />
            </div>
          </div>

          {/* Información Contractual */}
          <div className="seccion-form">
            <h4>📋 Información Contractual</h4>
            
            <div className="form-group">
              <label>Tipo de Contrato</label>
              <select name="tipoContrato" value={form.tipoContrato} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Directo">Directo</option>
                <option value="Temporal">Temporal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estado del Acta</label>
              <select name="estadoActa" value={form.estadoActa} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Ok">Ok</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha de Entrega</label>
              <input 
                type="date" 
                name="fechaEntrega" 
                value={form.fechaEntrega} 
                onChange={handleChange}
                className={errores.fechaEntrega ? 'error' : ''}
              />
              {errores.fechaEntrega && <span className="error-message">{errores.fechaEntrega}</span>}
            </div>
          </div>

          {/* Accesorios */}
          <div className="seccion-form">
            <h4>🔌 Accesorios</h4>
            
            <div className="form-group">
              <label>Cargador Laptop</label>
              <input 
                name="cargadorLaptop" 
                value={form.cargadorLaptop} 
                onChange={handleChange} 
                placeholder="Ej: CHG-4432"
              />
            </div>

            <div className="form-group">
              <label>Docking Station</label>
              <input 
                name="dockingStation" 
                value={form.dockingStation} 
                onChange={handleChange} 
                placeholder="Ej: DK-2190"
              />
            </div>

            <div className="form-group">
              <label>Cargador Docking</label>
              <input 
                name="cargadorDocking" 
                value={form.cargadorDocking} 
                onChange={handleChange} 
                placeholder="Ej: CDK-7782"
              />
            </div>

            <div className="form-group">
              <label>Monitor</label>
              <input 
                name="monitor" 
                value={form.monitor} 
                onChange={handleChange} 
                placeholder="Ej: MON-6621"
              />
            </div>

            <div className="form-group">
              <label>Maleta</label>
              <select name="maleta" value={form.maleta} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            <div className="form-group">
              <label>Guaya</label>
              <select name="guaya" value={form.guaya} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            <div className="form-group">
              <label>Adaptador</label>
              <select name="adaptador" value={form.adaptador} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Sí">Sí</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="boton-guardar">
            {datosEditar ? '💾 Guardar Cambios' : '📥 Crear Asignación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEquipo;