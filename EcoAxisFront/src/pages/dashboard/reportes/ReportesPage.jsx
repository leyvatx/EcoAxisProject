import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopBar from '../../../components/dashboard/TopBar';
import { useAuth } from '../../../contexts/AuthContext';
import { dashboardAPI } from '../../../services/api';
import './ReportesPage.css';

const ReportesPage = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('empresas');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, selectedReport]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Error al cargar los datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // Simulación de generación de reporte
    alert(`Generando reporte de ${selectedReport} para el período: ${selectedPeriod}`);
  };

  const exportToPDF = () => {
    alert('Exportando reporte a PDF...');
  };

  const exportToExcel = () => {
    alert('Exportando reporte a Excel...');
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <div className="page-content">
          <div className="reportes-page">
            <div className="page-header">
              <div className="header-content">
                <h1>Reportes y Análisis</h1>
                <p>Genera reportes personalizados del sistema</p>
              </div>
              <div className="header-actions">
                <button className="btn-secondary" onClick={exportToPDF}>
                  📄 PDF
                </button>
                <button className="btn-secondary" onClick={exportToExcel}>
                  📊 Excel
                </button>
                <button className="btn-primary" onClick={generateReport}>
                  📈 Generar Reporte
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="report-filters">
              <div className="filter-group">
                <label>Tipo de Reporte:</label>
                <select 
                  value={selectedReport} 
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="filter-select"
                >
                  <option value="empresas">Empresas</option>
                  <option value="usuarios">Usuarios</option>
                  <option value="tecnicos">Técnicos</option>
                  <option value="sucursales">Sucursales</option>
                  <option value="general">Reporte General</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Período:</label>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="filter-select"
                >
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mes</option>
                  <option value="quarter">Último Trimestre</option>
                  <option value="year">Último Año</option>
                </select>
              </div>
            </div>

            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Empresas</h3>
                <p className="summary-number">{reportData.total_empresas || 0}</p>
                <span className="summary-change">+12% vs mes anterior</span>
              </div>
              <div className="summary-card">
                <h3>Total Usuarios</h3>
                <p className="summary-number">{reportData.total_usuarios || 0}</p>
                <span className="summary-change">+8% vs mes anterior</span>
              </div>
              <div className="summary-card">
                <h3>Total Técnicos</h3>
                <p className="summary-number">{reportData.total_tecnicos || 0}</p>
                <span className="summary-change">+5% vs mes anterior</span>
              </div>
              <div className="summary-card">
                <h3>Total Sucursales</h3>
                <p className="summary-number">{reportData.total_sucursales || 0}</p>
                <span className="summary-change">+15% vs mes anterior</span>
              </div>
            </div>

            <div className="report-content">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando datos del reporte...</p>
                </div>
              ) : (
                <div className="report-charts">
                  <div className="chart-container">
                    <h3>Distribución por Tipo</h3>
                    <div className="chart-placeholder">
                      <p>Gráfico de distribución de {selectedReport}</p>
                      <div className="chart-bars">
                        <div className="bar" style={{height: '60%'}}></div>
                        <div className="bar" style={{height: '80%'}}></div>
                        <div className="bar" style={{height: '40%'}}></div>
                        <div className="bar" style={{height: '90%'}}></div>
                        <div className="bar" style={{height: '70%'}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    <h3>Tendencia Temporal</h3>
                    <div className="chart-placeholder">
                      <p>Evolución de {selectedReport} en el {selectedPeriod}</p>
                      <div className="chart-line">
                        <svg width="100%" height="100" viewBox="0 0 300 100">
                          <polyline 
                            points="0,80 60,60 120,40 180,30 240,20 300,10" 
                            fill="none" 
                            stroke="var(--primary-color)" 
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="report-table">
              <h3>Datos Detallados</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Elemento</th>
                      <th>Cantidad</th>
                      <th>Porcentaje</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Empresas Activas</td>
                      <td>{reportData.total_empresas || 0}</td>
                      <td>85%</td>
                      <td><span className="status-badge active">Activo</span></td>
                    </tr>
                    <tr>
                      <td>Usuarios Registrados</td>
                      <td>{reportData.total_usuarios || 0}</td>
                      <td>92%</td>
                      <td><span className="status-badge active">Activo</span></td>
                    </tr>
                    <tr>
                      <td>Técnicos Disponibles</td>
                      <td>{reportData.total_tecnicos || 0}</td>
                      <td>78%</td>
                      <td><span className="status-badge active">Disponible</span></td>
                    </tr>
                    <tr>
                      <td>Sucursales Operativas</td>
                      <td>{reportData.total_sucursales || 0}</td>
                      <td>90%</td>
                      <td><span className="status-badge active">Operativa</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
