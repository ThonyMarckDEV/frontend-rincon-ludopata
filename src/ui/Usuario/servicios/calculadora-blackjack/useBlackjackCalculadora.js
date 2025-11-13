import { useState, useMemo, useEffect } from 'react';

// --- DEFINICIONES DE ESTRATEGIA, VALORES, ETC. ---
const hardStrategy = {
    8:  ['H','H','H','H','H','H','H','H','H','H'],9:  ['H','D','D','D','D','H','H','H','H','H'],10: ['D','D','D','D','D','D','D','D','H','H'],11: ['D','D','D','D','D','D','D','D','D','H'],12: ['H','H','S','S','S','H','H','H','H','H'],13: ['S','S','S','S','S','H','H','H','H','H'],14: ['S','S','S','S','S','H','H','H','H','H'],15: ['S','S','S','S','S','H','H','H','H','H'],16: ['S','S','S','S','S','H','H','H','H','H'],17: ['S','S','S','S','S','S','S','S','S','S'],18: ['S','S','S','S','S','S','S','S','S','S'],19: ['S','S','S','S','S','S','S','S','S','S'],20: ['S','S','S','S','S','S','S','S','S','S'],21: ['S','S','S','S','S','S','S','S','S','S'],
};
const softStrategy = {
    13: ['H','H','H','D','D','H','H','H','H','H'],14: ['H','H','H','D','D','H','H','H','H','H'],15: ['H','H','D','D','D','H','H','H','H','H'],16: ['H','H','D','D','D','H','H','H','H','H'],17: ['H','D','D','D','D','H','H','H','H','H'],18: ['S','D','D','D','D','S','S','H','H','H'],19: ['S','S','S','S','S','S','S','S','S','S'],20: ['S','S','S','S','S','S','S','S','S','S'],
};
const pairStrategy = {
    4:  ['P','P','P','P','P','P','H','H','H','H'],6:  ['P','P','P','P','P','P','H','H','H','H'],8:  ['H','H','H','P','P','H','H','H','H','H'],10: ['D','D','D','D','D','D','D','D','H','H'],12: ['P','P','P','P','P','H','H','H','H','H'],14: ['P','P','P','P','P','P','H','H','H','H'],16: ['P','P','P','P','P','P','P','P','P','P'],18: ['P','P','P','P','P','S','P','P','S','S'],20: ['S','S','S','S','S','S','S','S','S','S'],22: ['P','P','P','P','P','P','P','P','P','P'],
};
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
};
const dealerIndex = {
    '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8, 'J': 8, 'Q': 8, 'K': 8, 'A': 9
};
const hiLoValues = {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
};

// --- FUNCIÓN DE CÁLCULO DE MANO (Helper) ---
// ** CORREGIDA LA LÓGICA DE 'isSoft' **
const getHandValue = (hand) => {
    let total = hand.reduce((sum, card) => sum + cardValues[card], 0);
    let aces = hand.filter(card => card === 'A').length;
    
    // Manejar Ases
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    
    // Una mano es "soft" si todavía tiene un As contando como 11
    // (es decir, 'aces' es > 0 Y el total no se pasó)
    // 'A,6' -> total=17, aces=1. isSoft = true.
    // 'A,6,10' -> total=27, aces=1 -> loop -> total=17, aces=0. isSoft = false.
    const isSoft = aces > 0;
    return { total, isSoft, aces };
};

// --- HOOK 1: Lógica del Juego (NUEVO) ---
export const useBlackjackGame = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]); // [cartaVisible, cartaOculta]
    const [gamePhase, setGamePhase] = useState('init'); // 'init', 'playerTurn', 'dealerTurn', 'ended'
    
    // --- Valores Derivados ---
    const { total: playerTotal, isSoft } = useMemo(() => getHandValue(playerHand), [playerHand]);
    const { total: dealerTotal } = useMemo(() => getHandValue(dealerHand), [dealerHand]);
    const isBust = playerTotal > 21;

    // --- Helper de Estrategia ---
    // ** MOVIDO AQUÍ, ANTES DE 'recommendedMove' **
    const getMoveDescription = (move) => {
         switch (move) {
            case 'H': return { jugada: 'PEDIR', descripcion: 'Pide otra carta.', color: 'text-green-400' };
            case 'S': return { jugada: 'PLANTARSE', descripcion: 'No pidas más cartas.', color: 'text-red-400' };
            case 'D': return { jugada: 'DOBLAR', descripcion: 'Dobla tu apuesta.', color: 'text-amber-400', canDouble: true };
            case 'P': return { jugada: 'DIVIDIR', descripcion: 'Separa tus cartas.', color: 'text-blue-400' };
            default: return { jugada: '...', descripcion: 'Error.', color: 'text-white' };
        }
    };

    // --- Lógica de Estrategia ---
    const recommendedMove = useMemo(() => {
        if (gamePhase !== 'playerTurn' || playerHand.length < 2) {
            return { jugada: '...', descripcion: 'Esperando jugada.' };
        }

        const dealerCard = dealerHand[0];
        if (!dealerCard) return { jugada: '...', descripcion: 'Error.' };

        const dIdx = dealerIndex[dealerCard];

        // 1. Pares
        if (playerHand.length === 2 && cardValues[playerHand[0]] === cardValues[playerHand[1]]) {
            const move = pairStrategy[playerTotal][dIdx];
            return getMoveDescription(move);
        }
        // 2. Suaves
        if (isSoft) {
            // Asegurarnos de que el total exista en la tabla (ej. A,A = 12, no 2 o 22)
            const softTotal = playerTotal;
            if (softStrategy[softTotal]) {
                 const move = softStrategy[softTotal][dIdx];
                 return getMoveDescription(move);
            }
        }
        // 3. Duras
        if(hardStrategy[playerTotal]) {
            const move = playerTotal <= 8 ? 'H' : hardStrategy[playerTotal][dIdx];
            return getMoveDescription(move);
        }
        
        // Fallback (ej. si el total es > 21 o < 8)
        if (playerTotal <= 8) return getMoveDescription('H');
        if (playerTotal >= 17) return getMoveDescription('S'); // Ya deberías plantarte
        return getMoveDescription('H'); // Default
        
    }, [playerHand, dealerHand, gamePhase, isSoft, playerTotal]);

    // --- Acciones del Juego ---
    const startGame = (p1, p2, d) => {
        if (!p1 || !p2 || !d) return;
        setPlayerHand([p1, p2]);
        setDealerHand([d]); // Solo la carta visible
        setGamePhase('playerTurn');
    };
    
    const playerHit = (card) => {
        if (!card) return;
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        // Comprobar si se pasa
        if (getHandValue(newHand).total > 21) {
            setGamePhase('ended'); // Se pasó, termina el turno
        }
    };
    
    const playerStand = () => {
        setGamePhase('dealerTurn');
    };

    const dealerReveal = (card) => {
        if (!card) return;
        setDealerHand(prev => [prev[0], card]); // [visible, oculta]
    };

    const dealerHit = (card) => {
        if (!card) return;
        setDealerHand(prev => [...prev, card]);
    };
    
    const dealerStands = () => {
        setGamePhase('ended');
    };

    const endHand = () => {
        const allCards = [...playerHand, ...dealerHand];
        setGamePhase('init');
        setPlayerHand([]);
        setDealerHand([]);
        return allCards; // Devuelve las cartas para el contador
    };

    return {
        gamePhase, playerHand, dealerHand,
        playerTotal, dealerTotal, isBust, isSoft,
        recommendedMove,
        startGame, playerHit, playerStand, dealerReveal, dealerHit, dealerStands, endHand
    };
};

// --- HOOK 2: Contador de Cartas (MODIFICADO) ---

export const COUNTER_STORAGE_KEY = 'blackjackCounterState';

const getCounterInitialState = () => {
    const savedState = localStorage.getItem(COUNTER_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : { numDecks: 6, dealtCards: [] };
};

export const useCardCounter = () => {
    const [state, setState] = useState(getCounterInitialState);
    const { numDecks, dealtCards } = state;

    useEffect(() => {
        localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const { runningCount, decksRemaining, trueCount, stats } = useMemo(() => {
        const rc = dealtCards.reduce((count, card) => count + (hiLoValues[card] || 0), 0);
        const totalCards = numDecks * 52;
        const cardsRemaining = totalCards - dealtCards.length;
        const dr = cardsRemaining / 52;
        const tc = dr > 0 ? rc / dr : 0;
        
        const initialHighCards = numDecks * 20;
        const initialLowCards = numDecks * 20;
        let highCardsDealt = 0;
        let lowCardsDealt = 0;
        dealtCards.forEach(card => {
            if (hiLoValues[card] === -1) highCardsDealt++;
            if (hiLoValues[card] === 1) lowCardsDealt++;
        });

        const calculatedStats = {
            totalCards, cardsRemaining, decksRemaining: dr,
            highCardsRemaining: initialHighCards - highCardsDealt,
            lowCardsRemaining: initialLowCards - lowCardsDealt,
        };
        return { runningCount: rc, decksRemaining: dr, trueCount: tc, stats: calculatedStats };
    }, [dealtCards, numDecks]);

    const bettingAdvice = useMemo(() => {
        if (trueCount <= 0) return { mensaje: 'Mesa Fría', descripcion: 'Apuesta la mínima.', colorBg: 'bg-blue-900 text-blue-200' };
        if (trueCount <= 1) return { mensaje: 'Neutral', descripcion: 'Apuesta la mínima.', colorBg: 'bg-gray-700 text-gray-200' };
        if (trueCount <= 2) return { mensaje: 'Mesa Tibia', descripcion: 'Considera duplicar (2x) tu apuesta.', colorBg: 'bg-yellow-800 text-yellow-200' };
        if (trueCount <= 3) return { mensaje: '¡Mesa Caliente!', descripcion: 'Aumenta tu apuesta (ej. 3x - 4x).', colorBg: 'bg-amber-600 text-white' };
        return { mensaje: '¡¡MESA EN FUEGO!!', descripcion: 'Apuesta fuerte (ej. 5x+).', colorBg: 'bg-red-700 text-white' };
    }, [trueCount]);

    // *** NUEVA FUNCIÓN ***
    // Recibe un array de cartas y las añade al contador
    const addCardsToCount = (cardsArray) => {
        setState(prevState => ({
            ...prevState,
            dealtCards: [...prevState.dealtCards, ...cardsArray]
        }));
    };

    const undoLastCard = () => {
        if (dealtCards.length === 0) return;
        setState(prevState => ({
            ...prevState,
            dealtCards: prevState.dealtCards.slice(0, -1)
        }));
    };

    const resetShoe = (newNumDecks) => {
        setState({
            numDecks: newNumDecks,
            dealtCards: []
        });
    };
    
    const setNumDecks = (newNumDecks) => resetShoe(newNumDecks);

    const clearAllData = () => {
        if (window.confirm("¿Estás seguro de que quieres borrar TODOS los datos?")) {
            localStorage.removeItem(COUNTER_STORAGE_KEY);
            window.location.reload();
        }
    };

    return {
        numDecks, dealtCards, runningCount, trueCount, bettingAdvice, stats,
        addCardsToCount, // <-- Exportamos la nueva función
        undoLastCard, resetShoe, setNumDecks, clearAllData
    };
};