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
            id: 'ruleta',
            emoji: '🎰',
            titulo: 'Calculadora de Ruleta',
            descripcion: 'Registra giros y calcula probabilidades (rojo/azul/amarillo).',
            enlace: '/calculadora-ruleta', // Nueva ruta
        },
        {
            id: 'blackjack',
            emoji: '🃏',
            titulo: 'Calculadora de Blackjack',
            descripcion: 'Calcula probabilidades y estrategias para Blackjack.',
            enlace: '/caluladora-blackjack', // Nueva ruta
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
        // Fondo principal oscuro (como en la calculadora)
        <div className="bg-gray-950 text-gray-200 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Título en color ámbar/dorado */}
                <h1 className="text-4xl font-bold text-center mb-4 text-amber-400">
                    Rincón del Ludopata
                </h1>
                
                <p className="text-lg text-gray-400 text-center mb-12">
                    Tus herramientas para tomar mejores decisiones.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 4. Mapeamos los servicios */}
                    {servicios.map((servicio) => (
                        // 5. Tarjeta con estilo oscuro y hover dorado
                        <Link 
                            to={servicio.enlace} 
                            key={servicio.id}
                            className="block bg-gray-900 p-6 rounded-lg shadow-lg 
                                       transform transition-transform hover:scale-105 
                                       border border-gray-700 hover:border-amber-500" // Hover en ámbar
                        >
                            <div className="text-4xl mb-4">{servicio.emoji}</div>
                            {/* Título de la tarjeta en blanco para más contraste */}
                            <h3 className="text-xl font-semibold mb-2 text-white">{servicio.titulo}</h3>
                            <p className="text-gray-400">{servicio.descripcion}</p>
                        </Link>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}

export default Home;