
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

const BOARD_SIZE = 4;


const GameLogic = () => {
    const [score, setScore] = useState(0);  // Premjestiti unutra funkciju
    const [board, setBoard] = useState(Array.from({ length: BOARD_SIZE },
        () => Array(BOARD_SIZE).fill(0)));

    const resetScore = () => {
        setScore(0);
    };
        const initializeGame = () => {
            resetScore(); // Resetuj bodove
            const newBoard = Array.from({ length: BOARD_SIZE },
                () => Array(BOARD_SIZE).fill(0));
            addNewTile(newBoard);
            addNewTile(newBoard);
            setBoard(newBoard);
        };
        

    const addNewTile = (newBoard) => {
        const emptyTiles = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (newBoard[i][j] === 0) {
                    emptyTiles.push({ row: i, col: j });
                }
            }
        }
    
        if (emptyTiles.length > 0) {
            const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            newBoard[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% za 2, 10% za 4
        }
    };
    

    const handleSwipe = (direction) => {
        const newBoard = JSON.parse(JSON.stringify(board)); // Duboka kopija ploče
        let moved = false;
    
        switch (direction) {
            case 'UP':
                moved = moveUp(newBoard);
                break;
            case 'DOWN':
                moved = moveDown(newBoard);
                break;
            case 'LEFT':
                moved = moveLeft(newBoard);
                break;
            case 'RIGHT':
                moved = moveRight(newBoard);
                break;
            default:
                break;
        }
    
        if (moved) {
            addNewTile(newBoard); // Dodaj novu pločicu samo ako je potez validan
            setBoard(newBoard);
        }
    
        if (isGameOver(newBoard)) {
            Alert.alert('Game Over', 'No more moves left!', [{ text: 'Restart', onPress: initializeGame }]);
        }
    };
    

    const moveUp = (newBoard) => {
        let moved = false;
    
        for (let col = 0; col < BOARD_SIZE; col++) {
            let compressedCol = [];
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== 0) {
                    compressedCol.push(newBoard[row][col]); // Ukloni nule
                }
            }
            let mergedCol = [];
    
            for (let i = 0; i < compressedCol.length; i++) {
                if (compressedCol[i] === compressedCol[i + 1]) {
                    const newValue = compressedCol[i] * 2; // Spoji iste vrijednosti
                    mergedCol.push(newValue); // Dodaj na kraj
                    setScore((prevScore) => prevScore + newValue); // Dodaj bodove
                    i++; // Preskoči sljedeću pločicu
                    moved = true;
                } else {
                    mergedCol.push(compressedCol[i]);
                }
            }
    
            // Dodaj nule na kraj
            while (mergedCol.length < BOARD_SIZE) {
                mergedCol.push(0);
            }
    
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== mergedCol[row]) {
                    newBoard[row][col] = mergedCol[row];
                    moved = true;
                }
            }
        }
    
        return moved;
    };
    
    

    const moveDown = (newBoard) => {
        let moved = false;
    
        for (let col = 0; col < BOARD_SIZE; col++) {
            let compressedCol = [];
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== 0) {
                    compressedCol.push(newBoard[row][col]); // Ukloni nule
                }
            }
            let mergedCol = [];
    
            for (let i = compressedCol.length - 1; i >= 0; i--) {
                if (compressedCol[i] === compressedCol[i - 1]) {
                    const newValue = compressedCol[i] * 2; // Spoji iste vrijednosti
                    mergedCol.unshift(newValue); // Dodaj na početak
                    setScore((prevScore) => prevScore + newValue); // Dodaj bodove
                    i--; // Preskoči sljedeću pločicu
                    moved = true;
                } else {
                    mergedCol.unshift(compressedCol[i]);
                }
            }
    
            // Dodaj nule na početak
            while (mergedCol.length < BOARD_SIZE) {
                mergedCol.unshift(0);
            }
    
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== mergedCol[row]) {
                    newBoard[row][col] = mergedCol[row];
                    moved = true;
                }
            }
        }
    
        return moved;
    };
    
    
    const moveLeft = (newBoard) => {
        let moved = false;
    
        for (let row = 0; row < BOARD_SIZE; row++) {
            let compressedRow = newBoard[row].filter((val) => val !== 0); // Ukloni nule
            let mergedRow = [];
    
            for (let i = 0; i < compressedRow.length; i++) {
                if (compressedRow[i] === compressedRow[i + 1]) {
                    const newValue = compressedRow[i] * 2; // Spoji iste vrijednosti
                    mergedRow.push(newValue);
                    setScore((prevScore) => prevScore + newValue); // Dodaj bodove
                    i++; // Preskoči sljedeću pločicu
                    moved = true;
                } else {
                    mergedRow.push(compressedRow[i]);
                }
            }
    
            // Dodaj nule na kraj
            while (mergedRow.length < BOARD_SIZE) {
                mergedRow.push(0);
            }
    
            if (!arraysEqual(newBoard[row], mergedRow)) {
                newBoard[row] = mergedRow;
                moved = true;
            }
        }
    
        return moved;
    };
    
    
    const moveRight = (newBoard) => {
        let moved = false;
    
        for (let row = 0; row < BOARD_SIZE; row++) {
            let compressedRow = newBoard[row].filter((val) => val !== 0); // Ukloni nule
            let mergedRow = [];
    
            for (let i = compressedRow.length - 1; i >= 0; i--) {
                if (compressedRow[i] === compressedRow[i - 1]) {
                    const newValue = compressedRow[i] * 2; // Spoji iste vrijednosti
                    mergedRow.unshift(newValue); // Dodaj na početak
                    setScore((prevScore) => prevScore + newValue); // Dodaj bodove
                    i--; // Preskoči sljedeću pločicu
                    moved = true;
                } else {
                    mergedRow.unshift(compressedRow[i]);
                }
            }
    
            // Dodaj nule na početak
            while (mergedRow.length < BOARD_SIZE) {
                mergedRow.unshift(0);
            }
    
            if (!arraysEqual(newBoard[row], mergedRow)) {
                newBoard[row] = mergedRow;
                moved = true;
            }
        }
    
        return moved;
    };
    
    

    const isGameOver = (newBoard) => {
        // Check if there are any empty tiles or valid moves left
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (newBoard[row][col] === 0) {
                    return false;
                }
                if (col < BOARD_SIZE - 1 && newBoard[row][col] === newBoard[row][col + 1]) {
                    return false;
                }
                if (row < BOARD_SIZE - 1 && newBoard[row][col] === newBoard[row + 1][col]) {
                    return false;
                }
            }
        }
        return true;
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return {
        board,
        score,
        initializeGame,
        handleSwipe,
    };
};
const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default GameLogic;
