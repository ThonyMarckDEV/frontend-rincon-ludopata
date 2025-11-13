import React from 'react';
// 1. Importa Link para la navegación
import { Link } from 'react-router-dom';

// 2. Ya no recibe { setVista }
function Home() {
    
    // 3. Añadimos la propiedad 'enlace' (la ruta) a cada servicio
    const servicios = [
        {
            id: 'calculadora',
            emoji: '🧮',
            titulo: 'Calculadora Surebet',
            descripcion: 'Calcula ganancias seguras (arbitraje) entre dos cuotas.',
            enlace: '/caluladora-sure-bet', // Esta es la ruta a la que navegará
        },
        {
            id: 'cuotas',
            emoji: '📊',
            titulo: 'Calculadora de Cuotas',
            descripcion: 'Convierte probabilidades a cuotas (Decimal, USA, Fracción).',
            enlace: '/cuotas', // Ruta (aún no creada)
        },
        {
            id: 'bankroll',
            emoji: '💰',
            titulo: 'Gestor de Bankroll',
            descripcion: 'Administra tu capital y sigue la estrategia Kelly.',
            enlace: '/bankroll', // Ruta (aún no creada)
        },
    ];

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4">
                    Rincón del Estratega
                </h1>
                <p className="text-lg text-gray-400 text-center mb-12">
                    Tus herramientas para tomar mejores decisiones.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 4. Mapeamos los servicios */}
                    {servicios.map((servicio) => (
                        // 5. Cada tarjeta AHORA es un componente <Link>
                        // que dirige a la ruta definida en 'servicio.enlace'
                        <Link 
                            to={servicio.enlace} 
                            key={servicio.id}
                            className="block bg-gray-800 p-6 rounded-lg shadow-lg 
                                       transform transition-transform hover:scale-105 
                                       border border-gray-700 hover:border-blue-500"
                        >
                            {/* Quitamos el onClick y el cursor-pointer (Link ya lo maneja) */}
                            <div className="text-4xl mb-4">{servicio.emoji}</div>
                            <h3 className="text-xl font-semibold mb-2">{servicio.titulo}</h3>
                            <p className="text-gray-400">{servicio.descripcion}</p>
                        </Link>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}

export default Home;