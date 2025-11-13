import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBankRollManager } from './useBankrollManager'; // Importa la lógica

// --- COMPONENTES INTERNOS ---
// Componente para formatear la fecha (Sin cambios)
const FormatoFecha = ({ isoString }) => {
    const fecha = new Date(isoString);
    return fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Componente del Formulario de Capital Inicial (Sin cambios)
const FormularioCapital = ({ handleSetCapital, monto, setMonto, error }) => (
    <form onSubmit={handleSetCapital} className="w-full max-w-lg bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-amber-400 mb-6">
            Configurar Bankroll Inicial
        </h2>
        <p className="text-center text-gray-400 mb-6">
            Ingresa tu capital inicial para comenzar a registrar tus movimientos.
        </p>
        <div className="space-y-4">
            <div>
                <label htmlFor="capital" className="block text-sm font-medium text-gray-400 mb-1">
                    Capital Inicial
                </label>
                <input 
                    type="number" 
                    id="capital" 
                    value={monto}
                    placeholder="Ej: 1000"
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg text-white placeholder-gray-500"
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-md text-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            >
                Guardar Capital
            </button>
        </div>
        {error && (
            <p className="mt-4 text-center bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md font-medium">
                {error}
            </p>
        )}
    </form>
);

// Componente del Gestor Principal (MODIFICADO)
const GestorPrincipal = ({
    monto, setMonto,
    descripcion, setDescripcion,
    error,
    stats,
    historial,
    agregarTransaccion, // <-- Esta es la nueva función
    limpiarRegistros
}) => {
    const [pestañaActiva, setPestañaActiva] = useState('stats');
    return (
        <div className="w-full max-w-4xl space-y-6">
            
            {/* --- SECCIÓN DE REGISTRO --- */}
            <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-amber-400 mb-6">
                    Registrar Nuevo Saldo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Monto (Ahora es Nuevo Saldo) */}
                    <div className="md:col-span-1">
                        <label htmlFor="monto" className="block text-sm font-medium text-gray-400 mb-1">
                            Nuevo Saldo Total
                        </label>
                        <input 
                            type="number" 
                            id="monto" 
                            value={monto}
                            placeholder="Ej: 1007" // <-- Placeholder cambiado
                            onChange={(e) => setMonto(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg text-white placeholder-gray-500"
                        />
                    </div>
                    {/* Descripción */}
                    <div className="md:col-span-2">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-400 mb-1">
                            Descripción (Opcional)
                        </label>
                        <input 
                            type="text" 
                            id="descripcion" 
                            value={descripcion}
                            placeholder="Ej: Resultado Surebet #1"
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg text-white placeholder-gray-500"
                        />
                    </div>
                </div>
                {/* Botones (AHORA SOLO UNO) */}
                <div className="flex gap-4 mt-4">
                    <button 
                        onClick={agregarTransaccion} // <-- Llama a la nueva función
                        className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 rounded-md text-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                    >
                        Registrar Saldo
                    </button>
                </div>
                {error && (
                    <p className="mt-4 text-center bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md font-medium">
                        {error}
                    </p>
                )}
            </div>
            {/* --- SECCIÓN DE ESTADÍSTICAS E HISTORIAL --- */}
            {/* (Esta sección no necesita cambios, ya que 'stats' e 'historial'
                 siguen funcionando igual) */}
            <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
                {/* Pestañas */}
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        onClick={() => setPestañaActiva('stats')}
                        className={`py-2 px-4 font-semibold ${pestañaActiva === 'stats' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Estadísticas
                    </button>
                    <button
                        onClick={() => setPestañaActiva('historial')}
                        className={`py-2 px-4 font-semibold ${pestañaActiva === 'historial' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Historial de Movimientos ({stats.totalMovimientos})
                    </button>
                </div>
                {/* Contenido de Pestañas (Sin cambios) */}
                {pestañaActiva === 'stats' ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="col-span-2 lg:col-span-4 bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-amber-400">CAPITAL ACTUAL</p>
                            <p className="text-4xl font-bold text-white">{stats.capitalActual}</p>
                        </div>
                        <div className={`col-span-2 p-4 rounded-lg text-center ${parseFloat(stats.beneficioNeto) >= 0 ? 'bg-green-900' : 'bg-red-900'}`}>
                            <p className="text-sm font-medium text-gray-300">Beneficio Neto</p>
                            <p className="text-3xl font-bold text-white">{stats.beneficioNeto}</p>
                        </div>
                        <div className={`col-span-2 p-4 rounded-lg text-center ${parseFloat(stats.roi) >= 0 ? 'bg-green-900' : 'bg-red-900'}`}>
                            <p className="text-sm font-medium text-gray-300">ROI (Retorno)</p>
                            <p className="text-3xl font-bold text-white">{stats.roi} %</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-400">Capital Inicial</p>
                            <p className="text-2xl font-bold text-white">{stats.capitalInicial}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-400">Total Ganado</p>
                            <p className="text-2xl font-bold text-green-400">+{stats.totalGanado}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-400">Total Perdido</p>
                            <p className="text-2xl font-bold text-red-400">-{stats.totalPerdido}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-gray-400">Movimientos</p>
                            <p className="text-2xl font-bold text-white">{stats.totalMovimientos}</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                        {historial.length === 0 ? (
                            <p className="text-gray-400 text-center">No hay movimientos registrados.</p>
                        ) : (
                            historial.map(t => (
                                <div key={t.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className={`font-semibold ${t.tipo === 'ganancia' ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.tipo === 'ganancia' ? 'GANANCIA' : 'PÉRDIDA'}
                                        </p>
                                        <p className="text-sm text-gray-300">{t.descripcion}</p>
                                        <p className="text-xs text-gray-500"><FormatoFecha isoString={t.fecha} /></p>
                                    </div>
                                    <p className={`text-xl font-bold ${t.tipo === 'ganancia' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.monto > 0 ? `+${t.monto.toFixed(2)}` : t.monto.toFixed(2)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            
            {/* Botón de Limpiar (Sin cambios) */}
            <div className="text-center">
                <button
                    onClick={limpiarRegistros}
                    className="text-gray-500 hover:text-red-500 font-semibold transition-colors duration-200"
                >
                    Borrar todo el registro y reiniciar
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
// (Sin cambios aquí, solo pasa los props)
function GestorBankroll() {
    
    const {
        monto,
        setMonto,
        descripcion,
        setDescripcion,
        error,
        stats,
        historial,
        handleSetCapital,
        agregarTransaccion, // <-- Pasa la nueva función
        limpiarRegistros,
        tieneCapitalInicial,
    } = useBankRollManager();
    return (
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center text-gray-200">
            <div className="w-full max-w-4xl mb-4">
                <Link 
                    to="/"
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                    ← Volver al Home
                </Link>
            </div>
            {!tieneCapitalInicial ? (
                <FormularioCapital 
                    handleSetCapital={handleSetCapital}
                    monto={monto}
                    setMonto={setMonto}
                    error={error}
                />
            ) : (
                <GestorPrincipal 
                    monto={monto}
                    setMonto={setMonto}
                    descripcion={descripcion}
                    setDescripcion={setDescripcion}
                    agregarTransaccion={agregarTransaccion}
                    error={error}
                    stats={stats}
                    historial={historial}
                    limpiarRegistros={limpiarRegistros}
                />
            )}
        </div>
    );
}

export default GestorBankroll;