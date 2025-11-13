import { useState, useMemo } from 'react';

// --- DEFINICIÓN DE ESTRATEGIA BÁSICA ---
// H = Hit (Pedir), S = Stand (Plantarse), D = Double (Doblar), P = Split (Dividir)

// Estrategia para manos "Duras" (Hard) - Sin As o As vale 1
// Filas: Tu mano (5-21), Columnas: Carta del Dealer (2-10, A)
const hardStrategy = {
    // 2  3  4  5  6  7  8  9  10 A
    8:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    9:  ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
    10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
    11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
    12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    18: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    21: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
};

// Estrategia para manos "Suaves" (Soft) - Con un As que vale 11
// Filas: Tu mano (A,2 - A,9), Columnas: Carta del Dealer (2-10, A)
const softStrategy = {
    //   2  3  4  5  6  7  8  9  10 A
    13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,2
    14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,3
    15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,4
    16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,5
    17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'], // A,6
    18: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'], // A,7
    19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,8
    20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,9
};

// Estrategia para Pares
// Filas: Tu Par (2,2 - A,A), Columnas: Carta del Dealer (2-10, A)
const pairStrategy = {
    //   2  3  4  5  6  7  8  9  10 A
    4:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // 2,2
    6:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // 3,3
    8:  ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // 4,4
    10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'], // 5,5 (Nunca dividir)
    12: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // 6,6
    14: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // 7,7
    16: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 8,8
    18: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'], // 9,9
    20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 10,10 (Nunca dividir)
    22: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // A,A
};

// Mapeo de valores de cartas
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

// Mapeo de índice de columna para las tablas
const dealerIndex = {
    '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8, 'J': 8, 'Q': 8, 'K': 8, 'A': 9
};

export const useBlackjackCalculadora = () => {
    const [cartaJugador1, setCartaJugador1] = useState('10');
    const [cartaJugador2, setCartaJugador2] = useState('6');
    const [cartaDealer, setCartaDealer] = useState('9');
    
    // Calcula la mejor jugada
    const jugadaRecomendada = useMemo(() => {
        if (!cartaJugador1 || !cartaJugador2 || !cartaDealer) {
            return { jugada: '...', descripcion: 'Selecciona las 3 cartas' };
        }

        const v1 = cardValues[cartaJugador1];
        const v2 = cardValues[cartaJugador2];
        const dIdx = dealerIndex[cartaDealer];
        const total = v1 + v2;

        let estrategia = '';

        // 1. Revisar Pares
        if (v1 === v2) {
            estrategia = pairStrategy[total][dIdx];
        } 
        // 2. Revisar Manos Suaves (uno es As)
        else if (v1 === 11 || v2 === 11) {
            // El total suave es (1 + X) o (11 + X). 
            // La tabla softStrategy usa el total con As=11.
            estrategia = softStrategy[total][dIdx];
        }
        // 3. Revisar Manos Duras
        else {
            // Si el total es menor a 8, siempre es 'H'
            estrategia = total <= 8 ? 'H' : hardStrategy[total][dIdx];
        }

        // Mapear la estrategia a una descripción
        switch (estrategia) {
            case 'H': return { jugada: 'PEDIR', descripcion: 'Pide otra carta.', color: 'text-green-400' };
            case 'S': return { jugada: 'PLANTARSE', descripcion: 'No pidas más cartas.', color: 'text-red-400' };
            case 'D': return { jugada: 'DOBLAR', descripcion: 'Dobla tu apuesta. (Si no puedes, pide)', color: 'text-amber-400' };
            case 'P': return { jugada: 'DIVIDIR', descripcion: 'Separa tus cartas en dos manos.', color: 'text-blue-400' };
            default: return { jugada: '...', descripcion: 'Error de cálculo.' };
        }

    }, [cartaJugador1, cartaJugador2, cartaDealer]);

    return {
        cartaJugador1,
        setCartaJugador1,
        cartaJugador2,
        setCartaJugador2,
        cartaDealer,
        setCartaDealer,
        jugadaRecomendada
    };
};