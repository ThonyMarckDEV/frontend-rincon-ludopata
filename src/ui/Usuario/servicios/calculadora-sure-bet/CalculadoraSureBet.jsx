import React from 'react';
import { Link } from 'react-router-dom';
import { useCalculadora } from './useCalculadora'; 

function CalculadoraSurebet() {
    
    const {
        cuota1, setCuota1,
        cuota2, setCuota2,
        montoTotal, setMontoTotal,
        resultado, error,
        handleCalcular
    } = useCalculadora();

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
            
            <div className="w-full max-w-lg mb-4">
                <Link 
                    to="/"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                    &larr; Volver al Home
                </Link>
            </div>

            <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                    Calculadora Surebet
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="cuota1" className="block text-sm font-medium text-gray-700 mb-1">
                            Cuota 1 (Ej: 2.5)
                        </label>
                        <input 
                            type="number" 
                            id="cuota1" 
                            value={cuota1} 
                            onChange={(e) => setCuota1(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="cuota2" className="block text-sm font-medium text-gray-700 mb-1">
                            Cuota 2 (Ej: 1.8)
                        </label>
                        <input 
                            type="number" 
                            id="cuota2" 
                            value={cuota2} 
                            onChange={(e) => setCuota2(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="montoTotal" className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad Total a Apostar (Ej: 100)
                        </label>
                        <input 
                            type="number" 
                            id="montoTotal" 
                            value={montoTotal} 
                            onChange={(e) => setMontoTotal(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleCalcular}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-6"
                >
                    Calcular
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    
                    {error && (
                        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md font-medium">
                            {error}
                        </p>
                    )}
                    
                    {resultado && (
                        <div className="space-y-3">
                            <p className="text-md text-gray-800">
                                Para una apuesta total de <b className="font-bold">{parseFloat(montoTotal).toFixed(2)}</b>, debes repartir así:
                            </p>
                            
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>
                                    Apostar <b className="text-blue-700 font-bold">{resultado.apuesta1}</b> a la Cuota 1 ({cuota1})
                                </li>
                                <li>
                                    Apostar <b className="text-blue-700 font-bold">{resultado.apuesta2}</b> a la Cuota 2 ({cuota2})
                                </li>
                            </ul>
                            
                            <hr className="my-4"/>
                            
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                                <p className="text-sm font-medium text-green-800">Ganancia Total (Pago)</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {resultado.gananciaTotal}
                                </p>
                            </div>

                             {/* --- BLOQUE MODIFICADO --- */}
                             <div className="bg-gray-50 p-3 rounded-lg text-center mt-2">
                                <p className="text-sm font-medium text-gray-600">Beneficio Neto (Residuo)</p>
                                <div className="flex items-baseline justify-center space-x-2">
                                    <p className="text-xl font-bold text-gray-800">
                                        {resultado.beneficioNeto}
                                    </p>
                                    {/* --- LÍNEA NUEVA --- */}
                                    <span className="text-lg font-bold text-green-600">
                                        (+{resultado.beneficioPorcentaje}%)
                                    </span>
                                </div>
                            </div>
                            {/* --- FIN DEL BLOQUE MODIFICADO --- */}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalculadoraSurebet;