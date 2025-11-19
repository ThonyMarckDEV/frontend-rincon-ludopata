import React from 'react';

import useCalculadora from './useCalculadora'; // Default import

const CalculadoraSurebet = () => {
    // La lógica del hook permanece idéntica, ahora destructurando todos los estados
    const {
        cuota1, setCuota1,
        cuota2, setCuota2,
        cuota3, setCuota3,
        isThreeWayBet, setIsThreeWayBet,
        montoTotal, setMontoTotal,
        resultado, error,
        handleCalcular
    } = useCalculadora();

    const labelCuota2 = isThreeWayBet ? 'Empate' : 'Visitante';

    return (
        // Wrapper principal: fondo negro/gris muy oscuro
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center text-gray-200 font-sans">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
                /* Custom styles for the 3-way toggle button */
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #f59e0b; /* amber-500 */
                }
                .toggle-checkbox:checked ~ .dot {
                    transform: translateX(1.5rem);
                }
                `}
            </style>
            
            {/* Contenedor para el enlace "Volver" (ahora en color ámbar) */}
            <div className="w-full max-w-lg mb-4">
                {/* Simulación del Link a Home */}
                <button
                    onClick={() => { /* Esto solo simula volver al Home en la app de archivo único */ }}
                    className="text-amber-500 hover:text-amber-400 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                     Volver al Home
                </button>
            </div>

            {/* La Tarjeta principal (ahora oscura) */}
            <div className="w-full max-w-4xl bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
                
                {/* Título (en color ámbar) */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6">
                    Calculadora Surebet
                </h2>

                {/* --- Selector de 3 vias (Fútbol/Empate) --- */}
                <div className="flex items-center justify-between mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <span className="text-base font-medium text-gray-300">
                        Habilitar 3 Cuotas (Ej: Fútbol - Local / Empate / Visitante)
                    </span>
                    <label htmlFor="three-way-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                id="three-way-toggle" 
                                checked={isThreeWayBet}
                                onChange={() => setIsThreeWayBet(!isThreeWayBet)}
                                className="sr-only toggle-checkbox"
                            />
                            <div className="block bg-gray-600 w-12 h-6 rounded-full toggle-label transition-colors duration-300"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"></div>
                        </div>
                    </label>
                </div>
                
                {/* --- Formulario --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Input 1 */}
                    <div>
                        <label htmlFor="cuota1" className="block text-sm font-medium text-gray-400 mb-1">
                            Cuota 1 (Local)
                        </label>
                        <input 
                            type="number" 
                            id="cuota1" 
                            value={cuota1} 
                            onChange={(e) => setCuota1(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg transition duration-150"
                        />
                    </div>
                    
                    {/* Input 2 */}
                    <div>
                        <label htmlFor="cuota2" className="block text-sm font-medium text-gray-400 mb-1">
                            Cuota 2 ({labelCuota2})
                        </label>
                        <input 
                            type="number" 
                            id="cuota2" 
                            value={cuota2} 
                            onChange={(e) => setCuota2(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg transition duration-150"
                        />
                    </div>

                    {/* NUEVO: Input 3 (Solo si isThreeWayBet es true) */}
                    {isThreeWayBet && (
                        <div>
                            <label htmlFor="cuota3" className="block text-sm font-medium text-gray-400 mb-1">
                                Cuota 3 (Visitante)
                            </label>
                            <input 
                                type="number" 
                                id="cuota3" 
                                value={cuota3} 
                                onChange={(e) => setCuota3(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg transition duration-150"
                            />
                        </div>
                    )}
                    
                    {/* Input Monto Total - Siempre en la última columna, full width en mobile */}
                    <div className="md:col-span-1 lg:col-span-1">
                        <label htmlFor="montoTotal" className="block text-sm font-medium text-gray-400 mb-1">
                            Cantidad Total a Apostar
                        </label>
                        <input 
                            type="number" 
                            id="montoTotal" 
                            value={montoTotal} 
                            onChange={(e) => setMontoTotal(e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg transition duration-150"
                        />
                    </div>
                </div>

                {/* Botón de Calcular (dorado/ámbar) */}
                <button 
                    onClick={handleCalcular}
                    className="w-full bg-amber-500 text-black font-extrabold py-3 px-4 rounded-lg text-xl hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-200 mt-6 shadow-md hover:shadow-lg"
                >
                    Calcular Surebet
                </button>

                {/* --- Sección de Resultados --- */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                    
                    {/* Mensaje de Error (adaptado a oscuro) */}
                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl font-medium mb-4 shadow-inner">
                            <p className="font-bold mb-1">Error de Cálculo:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {/* Mensaje de Éxito */}
                    {resultado && (
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <p className="text-md text-gray-300 flex justify-between items-center">
                                    Total APOSTADO (Real): 
                                    <b className="font-bold text-white text-xl">{resultado.totalApostado}</b>
                                </p>
                            </div>
                            
                            <ul className="space-y-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                <li className="text-gray-300 flex justify-between">
                                    Apostar en Local a {cuota1}: <b className="text-amber-400 font-bold">{resultado.apuesta1}</b>
                                </li>
                                <li className="text-gray-300 flex justify-between">
                                    Apostar en {labelCuota2} a {cuota2}: <b className="text-amber-400 font-bold">{resultado.apuesta2}</b>
                                </li>
                                {resultado.apuesta3 && (
                                    <li className="text-gray-300 flex justify-between">
                                        Apostar en Visitante a {cuota3}: <b className="text-amber-400 font-bold">{resultado.apuesta3}</b>
                                    </li>
                                )}
                            </ul>
                            
                            <hr className="my-4 border-gray-700"/>

                            {/* Informar de los posibles pagos */}
                            <div className="text-sm text-gray-400 space-y-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <p className="flex justify-between items-center">Pago si gana Local: <span className="font-bold text-white text-base">{resultado.gananciaPayout1}</span></p>
                                <p className="flex justify-between items-center">Pago si gana {labelCuota2}: <span className="font-bold text-white text-base">{resultado.gananciaPayout2}</span></p>
                                {resultado.gananciaPayout3 && (
                                    <p className="flex justify-between items-center">Pago si gana Visitante: <span className="font-bold text-white text-base">{resultado.gananciaPayout3}</span></p>
                                )}
                            </div>
                            
                            {/* Resultado Ganancia Mínima (destacado) */}
                            <div className="bg-gray-800 border-2 border-green-600 p-5 rounded-xl text-center shadow-lg">
                                <p className="text-base font-medium text-green-400">GANANCIA MÍNIMA TOTAL GARANTIZADA</p>
                                <p className="text-3xl font-extrabold text-green-300 mt-1">
                                    {resultado.gananciaMinima}
                                </p>
                            </div>

                            {/* Beneficio Neto */}
                            <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                                <p className="text-sm font-medium text-gray-400">Beneficio Neto (Ganancia - Inversión)</p>
                                <div className="flex items-baseline justify-center space-x-2 mt-1">
                                    <p className="text-2xl font-bold text-white">
                                        {resultado.beneficioNeto}
                                    </p>
                                    <span className={`text-xl font-bold ${parseFloat(resultado.beneficioNeto) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        ({resultado.beneficioPorcentaje}%)
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