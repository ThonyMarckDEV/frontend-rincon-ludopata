import React from 'react';
// 1. Importa Link
import { Link } from 'react-router-dom';
import { useCalculadora } from './useCalculadora'; // Tu hook de lógica

// 2. Ya no recibe { setVista }
function CalculadoraSurebet() {
    
    // La lógica del hook permanece idéntica
    const {
        cuota1, setCuota1,
        cuota2, setCuota2,
        montoTotal, setMontoTotal,
        resultado, error,
        handleCalcular
    } = useCalculadora();

    return (
        // Wrapper principal: fondo negro/gris muy oscuro
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center text-gray-200">
            
            {/* Contenedor para el enlace "Volver" (ahora en color ámbar) */}
            <div className="w-full max-w-lg mb-4">
                <Link 
                    to="/"
                    className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                    &larr; Volver al Home
                </Link>
            </div>

            {/* La Tarjeta principal (ahora oscura) */}
            <div className="w-full max-w-lg bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
                
                {/* Título (en color ámbar) */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6">
                    Calculadora Surebet
                </h2>
                
                {/* --- Formulario --- */}
                <div className="space-y-4">
                    {/* Input 1 */}
                    <div>
                        <label htmlFor="cuota1" className="block text-sm font-medium text-gray-400 mb-1">
                            Cuota 1 (Ej: 2.5)
                        </label>
                        <input 
                            type="number" 
                            id="cuota1" 
                            value={cuota1} 
                            onChange={(e) => setCuota1(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg"
                        />
                    </div>
                    
                    {/* Input 2 */}
                    <div>
                        <label htmlFor="cuota2" className="block text-sm font-medium text-gray-400 mb-1">
                            Cuota 2 (Ej: 1.8)
                        </label>
                        <input 
                            type="number" 
                            id="cuota2" 
                            value={cuota2} 
                            onChange={(e) => setCuota2(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg"
                        />
                    </div>
                    
                    {/* Input 3 */}
                    <div>
                        <label htmlFor="montoTotal" className="block text-sm font-medium text-gray-400 mb-1">
                            Cantidad Total a Apostar
                        </label>
                        <input 
                            type="number" 
                            id="montoTotal" 
                            value={montoTotal} 
                            onChange={(e) => setMontoTotal(e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg"
                        />
                    </div>
                </div>

                {/* Botón de Calcular (dorado/ámbar) */}
                <button 
                    onClick={handleCalcular}
                    className="w-full bg-amber-500 text-black font-bold py-3 px-4 rounded-md text-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 mt-6"
                >
                    Calcular
                </button>

                {/* --- Sección de Resultados --- */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    
                    {/* Mensaje de Error (adaptado a oscuro) */}
                    {error && (
                        <p className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md font-medium">
                            {error}
                        </p>
                    )}
                    
                    {/* Mensaje de Éxito */}
                    {resultado && (
                        <div className="space-y-3">
                            <p className="text-md text-gray-300">
                                Total apostado (real, redondeado): <b className="font-bold text-white">{resultado.totalApostado}</b>
                            </p>
                            
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                <li>
                                    Apostar <b className="text-amber-400 font-bold">{resultado.apuesta1}</b> a la Cuota 1 ({cuota1})
                                </li>
                                <li>
                                    Apostar <b className="text-amber-400 font-bold">{resultado.apuesta2}</b> a la Cuota 2 ({cuota2})
                                </li>
                            </ul>
                            
                            <hr className="my-4 border-gray-700"/>

                            {/* Informar de los dos posibles pagos */}
                            <div className="text-sm text-gray-400 space-y-1 bg-gray-800 p-3 rounded-md">
                                <p>Pago si gana Cuota 1: <span className="font-bold text-white float-right">{resultado.gananciaPayout1}</span></p>
                                <p>Pago si gana Cuota 2: <span className="font-bold text-white float-right">{resultado.gananciaPayout2}</span></p>
                            </div>
                            
                            {/* Resultado Ganancia (fondo oscuro, texto verde) */}
                            <div className="bg-gray-800 border border-green-800 p-4 rounded-lg text-center">
                                <p className="text-sm font-medium text-green-400">Ganancia Mínima Garantizada</p>
                                <p className="text-2xl font-bold text-green-300">
                                    {resultado.gananciaMinima}
                                </p>
                            </div>

                             {/* Beneficio Neto (fondo oscuro, texto verde) */}
                             <div className="bg-gray-800 p-3 rounded-lg text-center mt-2">
                                <p className="text-sm font-medium text-gray-400">Beneficio Neto (Residuo)</p>
                                <div className="flex items-baseline justify-center space-x-2">
                                    <p className="text-xl font-bold text-white">
                                        {resultado.beneficioNeto}
                                    </p>
                                    <span className="text-lg font-bold text-green-400">
                                        (+{resultado.beneficioPorcentaje}%)
                                    </span>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalculadoraSurebet;