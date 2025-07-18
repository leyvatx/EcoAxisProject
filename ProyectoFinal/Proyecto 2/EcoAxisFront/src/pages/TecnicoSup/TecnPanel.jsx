import { Link } from "react-router-dom";
import './TecnPanel.css';

const TecnicianPanel = () => {
  return (
    <div className="tecn-panel">
      <h1>Panel de Técnico Superior</h1>
      <div className="crud-options">
        <Link to="/tecnico-sup/tecnicos" className="crud-link">Ver Técnicos</Link>
        <Link to="/sup/mantenimiento" className="crud-link">CRUD Mantenimiento</Link>
      </div>
    </div>
  );
}

export default TecnicianPanel;