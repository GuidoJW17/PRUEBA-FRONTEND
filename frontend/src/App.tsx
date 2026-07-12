import { useState, useEffect } from "react";
import inventarioIcon from './assets/img/inventario-icon.png';
import eliminarIcon from './assets/img/eliminar-icon.png';
import registrarIcon from './assets/img/registrar.png';
import updateIcon from './assets/img/update.png';
import disponibleIcon from './assets/img/disponible.png';
import bajostockIcon from './assets/img/materiales.png';
import sinStockIcon from './assets/img/sinstock.png';
import totalMatsIcon from './assets/img/total.png';
import nameIcon from './assets/img/min.png';
import incompletoIcon from './assets/img/incompleto.png';

const App = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }, []);

  const [matsName, setMatsName] = useState("")
  const [catMats, setCatMats] = useState("")
  const [stock, setStock] = useState("")
  const [precioUni, setPrecioUni] = useState("")
  const [proveedor, setProveedor] = useState("")
  const [estado, setEstado] = useState("")
  const [find, setFind] = useState("") 
  const [editandoId, setEditandoId] = useState(null);
  const [materialALiminar, setMaterialALiminar] = useState<any>(null);
  const [mensajeExitoReg, setMensajeExitoReg] = useState(false);
  const [mensajeExitoUpd, setMensajeExitoUpd] = useState(false);
  const [minName, setMinName] = useState(false);
  const [incompleto, setIncompleto] = useState(false);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5; 

  const [inventarioList, setInventarioList] = useState(() => {
    const saved = localStorage.getItem("inventarioData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("inventarioData", JSON.stringify(inventarioList));
  }, [inventarioList]);

  // CALCULOS PARA LAS TARJETAS
  const totalMateriales = inventarioList.length;
  const disponibles = inventarioList.filter((item: any) => item.estado === "Disponible").length;
  const sinStock = inventarioList.filter((item: any) => item.estado === "Sin stock").length;
  const bajoStock = inventarioList.filter((item: any) => item.estado === "Bajo en stock").length;

  const listaFiltrada = inventarioList.filter((item: any) =>
    item.nombre.toLowerCase().includes(find.toLowerCase()) ||
    item.proveedor.toLowerCase().includes(find.toLowerCase())
  );

  const indiceFin = paginaActual * itemsPorPagina;
  const indiceInicio = indiceFin - itemsPorPagina;
  const itemsPaginados = listaFiltrada.slice(indiceInicio, indiceFin);
  
  // Valida que el formulario esté completo antes de registrar o actualizar
  const registroSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!matsName || !catMats || !stock || !precioUni || !proveedor || !estado) {
      setIncompleto(true)
      return;
    }
    if (matsName.length < 3){
      setMinName(true)
      return;
    }
    if (editandoId) {
      setInventarioList(inventarioList.map((item: any) => 
        item.id === editandoId ? { ...item, nombre: matsName, categoria: catMats, cantidad: stock, precio: precioUni, proveedor: proveedor, estado: estado } : item
      ));
      setEditandoId(null);
      setMensajeExitoUpd(true);
    } else {
      const nuevoMaterial = { id: Date.now(), nombre: matsName, categoria: catMats, cantidad: stock, precio: precioUni, proveedor: proveedor, estado: estado };
      setInventarioList([...inventarioList, nuevoMaterial]);
      setMensajeExitoReg(true);
    }
    limpiar();
  }

  const editarMaterial = (item: any) => {
    setMatsName(item.nombre);
    setCatMats(item.categoria);
    setStock(item.cantidad);
    setPrecioUni(item.precio);
    setProveedor(item.proveedor);
    setEstado(item.estado);
    setEditandoId(item.id);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    limpiar()
  };

  const confirmarEliminacion = (id: any, nombre: any) => {
    setMaterialALiminar({ id, nombre }); 
  };

  const eliminarMaterial = () => {
    setInventarioList(inventarioList.filter((item: any) => item.id !== materialALiminar.id));
    setMaterialALiminar(null);
  };
  
  const limpiar = () => {
    setMatsName("");
    setCatMats("");
    setStock("");
    setPrecioUni("");
    setProveedor("");
    setEstado("");
  }

  return (
    <>
      <div className="text-center my-4">
        <h1 className="fw-bold text-primary">SISTEMA DE GESTIÓN DE INVENTARIO</h1>
      </div>
      

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  <img src={inventarioIcon} alt="icon" style={{width: '30px', marginRight: '10px'}}/>
                  {editandoId ? "EDITAR MATERIAL" : "REGISTRAR MATERIAL"}
                </h3>
              </div>
              <div className="card-body">
                <form onSubmit={registroSubmit}>
                  <div className="mb-3">
                    {/* NOMBRE DEL MATERIAL*/}
                    <label className="form-label">MATERIAL:</label>
                    <input className="form-control" type="text" value={matsName} onChange={(e) => setMatsName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    {/*CATEGORIA*/}
                    <label className="form-label">CATEGORIA:</label>
                    <select className="form-select" value={catMats} onChange={(e) => setCatMats(e.target.value)}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="Madera">Madera</option>
                      <option value="Albañilería">Albañilería</option>
                      <option value="Aislante">Aislante</option>
                      <option value="Fijaciones">Fijaciones</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    {/*CANTIDAD*/}
                    <label className="form-label">CANTIDAD:</label>
                    <input className="form-control" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>
                  {/*PRECIO*/}
                  <div className="mb-3">
                    <label className="form-label">PRECIO:</label>
                    <input className="form-control" type="number" value={precioUni} onChange={(e) => setPrecioUni(e.target.value)} />
                  </div>
                  {/*PROOVEEDOR */}
                  <div className="mb-3">
                    <label className="form-label">PROVEEDOR:</label>
                    <input className="form-control" type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
                  </div>
                  {/*ESTADO */}
                  <div className="mb-3">
                    <label className="form-label">ESTADO:</label>
                    <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                      <option value="" disabled>Seleccione...</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Bajo en stock">Bajo stock</option>
                      <option value="Sin stock">Sin stock</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className={`btn ${editandoId ? "btn-warning" : "btn-primary"} w-100`}>
                      {editandoId ? "ACTUALIZAR" : "REGISTRAR"}
                    </button>
                    <button type="button" className={`btn ${editandoId ? "btn-danger" : "btn-secondary"} w-100`} onClick={() => { editandoId ? cancelarEdicion() : limpiar() }}>
                      {editandoId ? "CANCELAR" : "LIMPIAR FORMULARIO"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="container mt-4 mb-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card text-center shadow-sm">
                    <img src={totalMatsIcon} className="rounded mx-auto d-block" alt="materialIcon" style={{width: '40px'}}/>
                    <div className="card-body">
                      <h5>Total Materiales</h5>
                      <h3>{totalMateriales}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center shadow-sm">
                    <img src={disponibleIcon} className="rounded mx-auto d-block" alt="disponibleIcon" style={{width: '40px'}}/>
                    <div className="card-body"><h5>Disponibles</h5><h3 className="text-success">{disponibles}</h3></div>
                  </div>
                </div>
                <div className="col-md-3"> 
                  <div className="card text-center shadow-sm">
                    <img src={bajostockIcon} className="rounded mx-auto d-block" alt="bajostockIcon" style={{width: '40px'}}/>
                    <div className="card-body"><h5>Bajo Stock</h5><h3 className="text-warning">{bajoStock}</h3></div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center shadow-sm">
                    <img src={sinStockIcon} className="rounded mx-auto d-block" alt="sinStockIcon" style={{width: '40px'}}/>
                    <div className="card-body"><h5>Sin Stock </h5><h3 className="text-danger">{sinStock}</h3></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card shadow p-3">
              <h3>Materiales Registrados</h3>
              <input className="form-control mb-3" placeholder="Buscar material o por proveedor" value={find} onChange={(e) => { setFind(e.target.value); setPaginaActual(1); }} />
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Categ</th>
                      <th>Canti</th>
                      <th>Precio</th>
                      <th>Provee</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsPaginados.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>{item.categoria}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precio}</td>
                        <td>{item.proveedor}</td>
                        <td>{item.estado}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-warning me-2" onClick={() => editarMaterial(item)}>Actualizar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarEliminacion(item.id, item.nombre)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {listaFiltrada.length > itemsPorPagina && (
                <div className="d-flex justify-content-center mt-3">
                  {Array.from({ length: Math.ceil(listaFiltrada.length / itemsPorPagina) }).map((_, i) => (
                    <button
                      key={i}
                      className={`btn ${paginaActual === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                      onClick={() => setPaginaActual(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {materialALiminar && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title">ADVERTENCIA</h5>
                      </div>
                      <div className="modal-body text-center">
                        <img src={eliminarIcon} className="card-img-top" alt="deleteIcon" style={{width: '100px', height: '100px'}}/>
                        <h3>¿Seguro que quieres borrar "{materialALiminar.nombre}"?</h3>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={eliminarMaterial}>Sí, eliminar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setMaterialALiminar(null)}>Cancelar</button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          )}
          {mensajeExitoReg && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">NUEVO MATERIAL</h5>
                      </div>
                      <div className="modal-body text-center">
                        <img src={updateIcon} className="card-img-top" alt="regisIcon" style={{width: '100px', height: '100px'}}/>
                        <h3>¡MATERIAL REGISTRADO CORRECTAMENTE!</h3>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={() => setMensajeExitoReg(false)}>ACEPTAR</button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          )}
          {mensajeExitoUpd && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-warning text-white">
                        <h5 className="modal-title">ACTUALIZACION DE MATERIAL</h5>
                      </div>
                      <div className="modal-body text-center">
                        <img src={registrarIcon} className="card-img-top" alt="updIcon" style={{width: '100px', height: '100px'}}/>
                        <h3>¡MATERIAL ACTUALIZADO CORRECTAMENTE!</h3>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-warning" onClick={() => setMensajeExitoUpd(false)}>ACEPTAR</button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          )}
          {minName && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-warning text-white">
                        <h5 className="modal-title">ACTUALIZACION DE MATERIAL</h5>
                      </div>
                      <div className="modal-body text-center">
                        <img src={nameIcon} className="card-img-top" alt="nameIcon" style={{width: '100px', height: '70px'}}/>
                        <h3>¡EL NOMBRE DEL MATERIAL DEBE TENER MINIMO 3 CARACTERES!</h3>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-warning" onClick={() => setMinName(false)}>ACEPTAR</button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          )}
          {incompleto && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title">ACTUALIZACION DE MATERIAL</h5>
                      </div>
                      <div className="modal-body text-center">
                        <img src={incompletoIcon} className="card-img-top" alt="updIcon" style={{width: '100px', height: '100px'}}/>
                        <h3>POR FAVOR RELLENE TODOS LOS CAMPOS</h3>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={() => setIncompleto(false)}>ACEPTAR</button>
                      </div>
                    </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App                  