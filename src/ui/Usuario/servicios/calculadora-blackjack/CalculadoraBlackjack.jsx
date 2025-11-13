import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlackjackGame, useCardCounter } from './useBlackjackCalculadora'; 

const cartas = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// --- Componente de Carta Visual ---
const Card = ({ rank, hidden = false }) => (
    <div className={`w-20 h-28 sm:w-24 sm:h-36 rounded-lg shadow-lg flex items-center justify-center font-bold text-3xl
        ${hidden ? 'bg-red-800 border-4 border-red-900' : 'bg-white text-gray-900 border-2 border-gray-300'}`}>
        {hidden ? '?' : rank}
    </div>
);

// --- Componente Selector de Cartas (Reutilizable) ---
const SelectorCarta = ({ id, valor, setValor, label, disabled = false }) => (
    <div className="flex-1 min-w-[100px]">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1 text-center">
            {label}
        </label>
        <select
            id={id}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white font-bold text-center appearance-none"
        >
            <option value="" disabled>--</option>
            {cartas.map(carta => <option key={carta} value={carta}>{carta}</option>)}
        </select>
    </div>
);

// --- Componente 1: Mesa de Juego (Izquierda) ---
const MesaDeJuego = ({ game, counter }) => {
    
    // Estado local para los selectores
    const [p1, setP1] = useState('10');
    const [p2, setP2] = useState('6');
    const [d, setD] = useState('9');
    const [newCard, setNewCard] = useState(''); // Para la carta de "Pedir" o del "Dealer"

    const handleStartGame = () => {
        game.startGame(p1, p2, d);
    };

    const handlePlayerHit = () => {
        if (!newCard) return;
        game.playerHit(newCard);
        setNewCard(''); // Resetear selector
    };

    const handleDealerReveal = () => {
        if (!newCard) return;
        game.dealerReveal(newCard);
        setNewCard('');
    };

    const handleDealerHit = () => {
        if (!newCard) return;
        game.dealerHit(newCard);
        setNewCard('');
    };
    
    const handleDealerStands = () => {
        game.dealerStands(); // Llama a la nueva función
    };

    const handleEndHand = () => {
        const cardsFromHand = game.endHand();
        counter.addCardsToCount(cardsFromHand); // Envía las cartas al contador
    };
    
    // El dealer se planta automáticamente si tiene 17 o más
    const dealerShouldStand = game.dealerTotal >= 17 && game.dealerHand.length >= 2;

    return (
        <div className="w-full bg-green-900 p-6 sm:p-8 rounded-3xl shadow-lg border-8 border-yellow-700 min-h-[600px] flex flex-col justify-between">
            
            {/* --- SECCIÓN DEL DEALER --- */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-center text-white mb-4">Mano del Dealer (Total: {game.gamePhase !== 'playerTurn' ? game.dealerTotal : '?'})</h3>
                <div className="flex justify-center items-center gap-4 h-36">
                    {game.gamePhase === 'init' && <p className="text-green-300">Esperando inicio...</p>}
                    
                    {game.gamePhase !== 'init' && game.dealerHand.map((card, i) => (
                        <Card key={i} rank={card} />
                    ))}
                    {/* Carta oculta */}
                    {game.gamePhase === 'playerTurn' && <Card hidden />}
                </div>
            </div>

            {/* --- SECCIÓN DE ACCIONES / RESULTADOS --- */}
            <div className="text-center my-6 flex-grow">
                {game.gamePhase === 'playerTurn' && !game.isBust && (
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-300 mb-1">Jugada Recomendada</p>
                        <p className={`text-4xl font-bold ${game.recommendedMove.color}`}>
                            {game.recommendedMove.jugada}
                        </p>
                        <p className="text-lg text-gray-200 mt-1">{game.recommendedMove.descripcion}</p>
                    </div>
                )}
                {game.isBust && (
                    <div className="bg-red-900 p-4 rounded-lg">
                        <p className="text-5xl font-bold text-white">¡TE PASASTE!</p>
                        <p className="text-lg text-gray-200 mt-1">Total: {game.playerTotal}</p>
                    </div>
                )}
                {game.gamePhase === 'ended' && !game.isBust && (
                    <div className="bg-blue-900 p-4 rounded-lg">
                        <p className="text-4xl font-bold text-white">MANO FINALIZADA</p>
                        <p className="text-lg text-gray-200 mt-1">Tu Total: {game.playerTotal} | Dealer: {game.dealerTotal}</p>
                    </div>
                )}
            </div>

            {/* --- SECCIÓN DEL JUGADOR --- */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-center text-white mb-4">Tu Mano (Total: {game.playerTotal})</h3>
                <div className="flex justify-center items-center gap-4 h-36">
                    {game.gamePhase === 'init' && <p className="text-green-300">Selecciona las cartas iniciales abajo...</p>}
                    {game.gamePhase !== 'init' && game.playerHand.map((card, i) => (
                        <Card key={i} rank={card} />
                    ))}
                </div>
            </div>

            {/* --- PANEL DE CONTROL --- */}
            <div className="mt-8 pt-6 border-t-4 border-yellow-700 border-dashed">
                
                {/* --- FASE DE INICIO --- */}
                {game.gamePhase === 'init' && (
                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-center text-white">Empezar Nueva Mano</p>
                        <div className="flex justify-center gap-4">
                            <SelectorCarta id="start-p1" valor={p1} setValor={setP1} label="Tu Carta 1" />
                            <SelectorCarta id="start-p2" valor={p2} setValor={setP2} label="Tu Carta 2" />
                            <SelectorCarta id="start-d" valor={d} setValor={setD} label="Dealer" />
                        </div>
                        <button onClick={handleStartGame} className="w-full bg-amber-500 text-gray-900 font-bold py-3 text-lg rounded-lg">
                            Empezar Mano
                        </button>
                    </div>
                )}

                {/* --- FASE TURNO JUGADOR --- */}
                {game.gamePhase === 'playerTurn' && !game.isBust && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <SelectorCarta id="new-card" valor={newCard} setValor={setNewCard} label="Siguiente Carta" />
                            <button onClick={handlePlayerHit} disabled={!newCard} className="flex-1 bg-green-600 text-white font-bold py-3 text-lg rounded-lg disabled:opacity-50 mt-auto">
                                Pedir (Hit)
                            </button>
                        </div>
                        <button onClick={game.playerStand} className="w-full bg-red-600 text-white font-bold py-3 text-lg rounded-lg">
                            Plantarse (Stand)
                        </button>
                    </div>
                )}

                {/* --- FASE TURNO DEALER --- */}
                {game.gamePhase === 'dealerTurn' && (
                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-center text-white">Turno del Dealer</p>
                        <div className="flex gap-4">
                            <SelectorCarta id="dealer-card" valor={newCard} setValor={setNewCard} label="Carta del Dealer" disabled={dealerShouldStand} />
                            
                            {game.dealerHand.length === 1 ? (
                                <button onClick={handleDealerReveal} disabled={!newCard} className="flex-1 bg-gray-400 text-black font-bold py-3 rounded-lg disabled:opacity-50 mt-auto">
                                    Revelar Oculta
                                </button>
                            ) : (
                                <button onClick={handleDealerHit} disabled={!newCard || dealerShouldStand} className="flex-1 bg-gray-400 text-black font-bold py-3 rounded-lg disabled:opacity-50 mt-auto">
                                    Dealer Pide (Hit)
                                </button>
                            )}
                        </div>
                         {/* El dealer se planta automáticamente >= 17 */}
                        {dealerShouldStand && (
                            <button onClick={handleDealerStands} className="w-full bg-blue-600 text-white font-bold py-3 text-lg rounded-lg">
                                Dealer se Planta (Total: {game.dealerTotal})
                            </button>
                        )}
                    </div>
                )}

                {/* --- FASE MANO TERMINADA --- */}
                {game.gamePhase === 'ended' && (
                     <button onClick={handleEndHand} className="w-full bg-amber-500 text-gray-900 font-bold py-3 text-lg rounded-lg">
                        Registrar Mano y Empezar Siguiente
                    </button>
                )}

            </div>
        </div>
    );
}

// --- Componente 2: Monitor del Contador (Derecha) ---
const ContadorUI = ({ counter }) => {
    const {
        numDecks, dealtCards, runningCount, trueCount, bettingAdvice, stats,
        undoLastCard, resetShoe, setNumDecks, clearAllData
    } = counter;

    return (
        <div className="w-full bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6">
                Monitor del "Shoe"
            </h2>
            
            {/* Conteo y Consejo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Conteo (RC)</p>
                    <p className={`text-4xl font-bold ${runningCount > 0 ? 'text-green-400' : runningCount < 0 ? 'text-red-400' : 'text-white'}`}>
                        {runningCount}
                    </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-400">Cuenta Real (TC)</p>
                    <p className={`text-4xl font-bold ${trueCount > 1 ? 'text-green-400' : trueCount < 0 ? 'text-red-400' : 'text-white'}`}>
                        {trueCount.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className={`w-full p-4 rounded-lg text-center mb-6 ${bettingAdvice.colorBg}`}>
                <p className="text-lg font-semibold">{bettingAdvice.mensaje}</p>
                <p className="text-sm">{bettingAdvice.descripcion}</p>
            </div>

            {/* Stats del Mazo */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-300">Cartas Restantes: <span className="font-bold text-white">{stats.cardsRemaining}</span> / <span className="font-bold text-white">{stats.totalCards}</span></p>
                <p className="text-gray-300">Mazos Restantes: <span className="font-bold text-white">{stats.decksRemaining.toFixed(2)}</span></p>
            </div>

            {/* Controles del Mazo */}
            <div className="mb-6">
                <p className="text-lg font-semibold text-center text-gray-300 mb-3">Controles del Mazo</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="numDecks" className="block text-sm font-medium text-gray-400 mb-1">Mazos</label>
                        <select id="numDecks" value={numDecks} onChange={(e) => setNumDecks(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                            {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n} Mazos</option>)}
                        </select>
                    </div>
                    <div className="flex-1 flex gap-4 items-end">
                        <button onClick={undoLastCard} className="w-1/2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500">
                            Deshacer
                        </button>
                        <button onClick={() => resetShoe(numDecks)} className="w-1/2 bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-500">
                            Reset Mazo
                        </button>
                    </div>
                </div>
            </div>

             <div className="mb-6">
                 <p className="text-sm text-gray-400 mb-2">Cartas registradas: {dealtCards.length}</p>
                 <div className="w-full bg-gray-950 p-3 rounded-md h-20 overflow-y-auto border border-gray-700">
                    <span className="text-gray-300 break-words">
                        {[...dealtCards].reverse().join(', ')}
                    </span>
                 </div>
            </div>
            
            <div className="mt-8 border-t border-red-800 pt-6">
                <button
                    onClick={clearAllData}
                    className="w-full bg-red-800 text-red-200 font-semibold py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                    Borrar Todos los Datos (Reset Total)
                </button>
            </div>
        </div>
    );
}

// --- Componente Principal (Orquestador) ---
function CalculadoraBlackjack() {
    
    // Instanciar los 2 hooks
    const game = useBlackjackGame();
    const counter = useCardCounter();

    return (
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 text-gray-200">
            
            <div className="w-full max-w-7xl mx-auto mb-8">
                <Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold">
                    &larr; Volver al Home
                </Link>
            </div>

            {/* Layout del Dashboard */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Columna Izquierda: Mesa de Juego (ocupa 2 columnas en desktop) */}
                <div className="lg:col-span-2">
                    <MesaDeJuego game={game} counter={counter} />
                </div>
                
                {/* Columna Derecha: Contador (ocupa 1 columna) */}
                <div className="lg:col-span-1">
                    <ContadorUI counter={counter} />
                </div>
            
            </div>
        </div>
    );
}

export default CalculadoraBlackjack;