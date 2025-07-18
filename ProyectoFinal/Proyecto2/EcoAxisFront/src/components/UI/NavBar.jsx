import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Determinar si estamos en la landing page
    const isLandingPage = location.pathname === '/';
    
    // Lista de rutas donde no mostrar el navbar
    const hideNavRoutes = ['/login', '/registro', '/cerrar-sesion'];
    
    // No mostrar navbar solo en rutas del dashboard (que tienen su propio layout)
    const isDashboardRoute = location.pathname.startsWith('/dashboard');
    
    if (hideNavRoutes.includes(location.pathname) || isDashboardRoute) {
        return null;
    }

    const navItems = [
        { name: 'Inicio', path: '/', show: true },
        { name: 'Dashboard', path: '/dashboard', show: !isLandingPage },
        { name: 'Admin', path: '/admin', show: !isLandingPage },
        { name: 'Técnico', path: '/tecnico-sup', show: !isLandingPage },
    ];

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/registro');
    };

    return (
        <nav className={`navbar ${isLandingPage ? 'navbar-transparent' : 'navbar-solid'}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img src="/verdealejandro.png" alt="EcoAxis" className="logo-icon" />
                    <span className="logo-text">EcoAxis</span>
                </Link>

                {/* Navigation Links - Desktop */}
                <div className="navbar-menu">
                    {navItems.map((item) => (
                        item.show && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    {isLandingPage ? (
                        <>
                            <button 
                                onClick={handleRegister}
                                className="btn btn-secondary navbar-btn"
                            >
                                Registrarse
                            </button>
                            <button 
                                onClick={handleLogin}
                                className="btn btn-primary navbar-btn"
                            >
                                Iniciar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/cerrar-sesion" className="btn btn-ghost navbar-btn">
                            Cerrar Sesión
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <button 
                    className="navbar-mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="navbar-mobile-content">
                    {navItems.map((item) => (
                        item.show && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`navbar-mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                    <div className="navbar-mobile-actions">
                        {isLandingPage ? (
                            <>
                                <button 
                                    onClick={() => { handleRegister(); setIsMenuOpen(false); }}
                                    className="btn btn-secondary btn-full"
                                >
                                    Registrarse
                                </button>
                                <button 
                                    onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                                    className="btn btn-primary btn-full"
                                >
                                    Iniciar Sesión
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/cerrar-sesion" 
                                className="btn btn-ghost btn-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Cerrar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;