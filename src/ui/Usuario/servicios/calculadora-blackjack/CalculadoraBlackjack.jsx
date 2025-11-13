import React from 'react';
import { Link } from 'react-router-dom';
import { useBlackjackCalculadora } from './useBlackjackCalculadora'; // Importa la lógica

// Opciones de cartas
const cartas = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Componente reutilizable para el selector de cartas
const SelectorCarta = ({ id, valor, setValor, label }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2 text-center">
            {label}
        </label>
        <select
            id={id}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-lg text-white appearance-none text-center font-bold"
        >
            <option value="" disabled>--</option>
            {cartas.map(carta => (
                <option key={carta} value={carta}>{carta}</option>
            ))}
        </select>
    </div>
);

// Componente de resultado
const Resultado = ({ jugada, descripcion, color }) => (
    <div className="w-full bg-gray-950 p-6 rounded-lg border-2 border-amber-400 text-center">
        <p className="text-sm font-medium text-gray-400 mb-1">Jugada Recomendada</p>
        <p className={`text-5xl font-bold ${color || 'text-white'}`}>
            {jugada}
        </p>
        <p className="text-lg text-gray-300 mt-2">{descripcion}</p>
    </div>
);


function CalculadoraBlackjack() {
    
    const {
        cartaJugador1,
        setCartaJugador1,
        cartaJugador2,
        setCartaJugador2,
        cartaDealer,
        setCartaDealer,
        jugadaRecomendada
    } = useBlackjackCalculadora();

    return (
        <div className="bg-gray-950 min-h-screen p-4 sm:p-8 flex flex-col items-center text-gray-200">
            
            <div className="w-full max-w-lg mb-4">
                <Link 
                    to="/"
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                    &larr; Volver al Home
                </Link>
            </div>

            {/* Tarjeta Principal */}
            <div className="w-full max-w-lg bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700">
                
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-400 mb-6">
                    Estrategia de Blackjack
                </h2>
                
                <div className="space-y-6">
                    
                    {/* Sección del Jugador */}
                    <div>
                        <p className="text-xl font-semibold text-center text-gray-300 mb-4">Tus Cartas</p>
                        <div className="flex justify-center gap-4">
                            <SelectorCarta
                                id="carta-jugador-1"
                                valor={cartaJugador1}
                                setValor={setCartaJugador1}
                                label="Carta 1"
                            />
                            <SelectorCarta
                                id="carta-jugador-2"
                                valor={cartaJugador2}
                                setValor={setCartaJugador2}
                                label="Carta 2"
                            />
                        </div>
                    </div>

                    {/* Separador */}
                    <hr className="border-gray-700" />

                    {/* Sección del Dealer */}
                    <div>
                        <p className="text-xl font-semibold text-center text-gray-300 mb-4">Carta del Dealer</p>
                        <div className="flex justify-center max-w-xs mx-auto">
                            <SelectorCarta
                                id="carta-dealer"
                                valor={cartaDealer}
                                setValor={setCartaDealer}
                                label="Carta Visible"
                            />
                        </div>
                    </div>

                    {/* Separador */}
                    <hr className="border-gray-700" />

                    {/* Sección de Resultado */}
                    <Resultado 
                        jugada={jugadaRecomendada.jugada}
                        descripcion={jugadaRecomendada.descripcion}
                        color={jugadaRecomendada.color}
                    />

                </div>

            </div>
        </div>
    );
}

export default CalculadoraBlackjack;