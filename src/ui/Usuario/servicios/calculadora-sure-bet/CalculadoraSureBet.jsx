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
        <div className="calculadora-wrapper bg-gray-100 p-4 min-h-screen">
            
            {/* 3. El botón 'Volver' ahora es un <Link> a la ruta "/" */}
             <Link 
                to="/"
                className="mb-4 inline-block text-blue-600 hover:text-blue-800 font-semibold"
            >
                &larr; Volver al Home
            </Link>

            {/* El resto de tu componente no cambia */}
            <div className="container">
                <h2>Calculadora de Ganancia (Surebet)</h2>
                
                {/* ... (todos tus inputs) ... */}
                <div className="input-group">
                    <label htmlFor="cuota1">Cuota 1 (Ej: 2.5)</label>
                    <input type="number" id="cuota1" value={cuota1} onChange={(e) => setCuota1(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="cuota2">Cuota 2 (Ej: 1.8)</label>
                    <input type="number" id="cuota2" value={cuota2} onChange={(e) => setCuota2(e.target.value)} />
                </div>
                <div className="input-group">
                    <label htmlFor="montoTotal">Cantidad Total a Apostar (Ej: 100)</label>
                    <input type="number" id="montoTotal" value={montoTotal} onChange={(e) => setMontoTotal(e.target.value)} />
                </div>
                
                <button onClick={handleCalcular}>Calcular</button>

                <div id="resultado">
                    {error && <p className="error">{error}</p>}
                    {resultado && (
                         <>
                            <p>Para una apuesta total de <b>{parseFloat(montoTotal).toFixed(2)}</b>, debes repartir así:</p>
                            <ul>
                                <li>Apostar <b>{resultado.apuesta1}</b> a la Cuota 1 ({cuota1})</li>
                                <li>Apostar <b>{resultado.apuesta2}</b> a la Cuota 2 ({cuota2})</li>
                            </ul>
                            <hr />
                            <p className="success">Pase lo que pase, tu ganancia (pago) será: <b>{resultado.gananciaTotal}</b></p>
                            <p className="success">Tu beneficio neto (residuo) será: <b>{resultado.beneficioNeto}</b></p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalculadoraSurebet;