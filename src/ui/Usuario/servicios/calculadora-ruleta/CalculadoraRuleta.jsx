import React from 'react';
import { Link } from 'react-router-dom';
import { useRuletaCalculadora } from './useRuletaCalculadora'; // Importa la lógica

function CalculadoraRuleta() {
    
    // Llama al hook para obtener estado y funciones
    const { stats, historial, error, agregarGiro, limpiarHistorial } = useRuletaCalculadora();

    // Calcula probabilidades (evita dividir por cero)
    const probRojo = stats.total > 0 ? (stats.rojo / stats.total) * 100 : 0;
    const probAzul = stats.total > 0 ? (stats.azul / stats.total) * 100 : 0;
    const probAmarillo = stats.total > 0 ? (stats.amarillo / stats.total) * 100 : 0;

    // Helper para dar color al historial
    const getColorClass = (color) => {
        if (color === 'rojo') return 'text-red-500';
        if (color === 'azul') return 'text-blue-500';
        if (color === 'amarillo') return 'text-amber-400';
        return 'text-gray-400';
    };

    return (
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center text-gray-200">
            
            <div className="w-full max-w-lg mb-4">
                <Link 
                    to="/"
                    className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                    &larr; Volver al Home
                </Link>
            </div>

            <div className="w-full max-w-lg bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
                
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6">
                    Calculadora de Ruleta
                </h2>
                
                {/* --- Botones de Giro --- */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    <button 
                        onClick={() => agregarGiro('rojo')}
                        className="bg-red-600 text-white font-bold py-3 px-2 rounded-md text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                    >
                        ROJO
                    </button>
                    <button 
                        onClick={() => agregarGiro('azul')}
                        className="bg-blue-600 text-white font-bold py-3 px-2 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                    >
                        AZUL
                    </button>
                    <button 
                        onClick={() => agregarGiro('amarillo')}
                        className="bg-amber-500 text-black font-bold py-3 px-2 rounded-md text-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                    >
                        AMARILLO
                    </button>
                </div>

                {/* --- Sección de Estadísticas --- */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center">Estadísticas</h3>
                    
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        {/* ROJO */}
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm font-medium text-red-500">Rojo</p>
                            <p className="text-2xl font-bold text-white">{stats.rojo}</p>
                            <p className="text-sm text-gray-400">{probRojo.toFixed(1)}%</p>
                        </div>
                        {/* AZUL */}
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-500">Azul</p>
                            <p className="text-2xl font-bold text-white">{stats.azul}</p>
                            <p className="text-sm text-gray-400">{probAzul.toFixed(1)}%</p>
                        </div>
                        {/* AMARILLO */}
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm font-medium text-amber-400">Amarillo</p>
                            <p className="text-2xl font-bold text-white">{stats.amarillo}</p>
                            <p className="text-sm text-gray-400">{probAmarillo.toFixed(1)}%</p>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <p className="text-sm font-medium text-gray-300">Total de Giros Registrados</p>
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                    </div>

                    {/* Mensaje de Error */}
                    {error && (
                        <p className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md font-medium mt-4">
                            {error}
                        </p>
                    )}
                </div>

                {/* --- Historial --- */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Historial Reciente</h3>
                    <div className="bg-gray-800 p-3 rounded-lg h-48 overflow-y-auto">
                        {historial.length === 0 ? (
                            <p className="text-gray-500 text-center italic">No hay giros registrados.</p>
                        ) : (
                            <div className="flex flex-wrap-reverse gap-2">
                                {historial.map((giro, index) => (
                                    <span 
                                        key={index}
                                        className={`font-bold text-lg ${getColorClass(giro)}`}
                                    >
                                        {giro.charAt(0).toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Botón Limpiar --- */}
                <button 
                    onClick={limpiarHistorial}
                    className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 mt-6"
                >
                    Limpiar Registros
                </button>
            </div>
        </div>
    );
}

export default CalculadoraRuleta;