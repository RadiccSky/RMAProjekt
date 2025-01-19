import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, auth } from '../../firebaseConfig'; 
import { useNavigation } from '@react-navigation/native'; 

const BOARD_SIZE = 4;

const GameLogic = () => {
    const navigation = useNavigation(); 
    const [score, setScore] = useState(0);  
    const [board, setBoard] = useState(Array.from({ length: BOARD_SIZE },
        () => Array(BOARD_SIZE).fill(0)));

    const resetScore = () => {
        setScore(0);
    };

    const initializeGame = () => {
        resetScore(); 
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
            newBoard[row][col] = Math.random() < 0.9 ? 2 : 4; 
        }
    };

    const saveScore = async (score) => {
        try {
            const userId = auth.currentUser.uid; 
            const docRef = doc(firestore, "users", userId); 
            const docSnap = await getDoc(docRef); 

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const highestScore = userData.highestScore || 0;

                
                if (score > highestScore) {
                    await setDoc(docRef, { highestScore: score }, { merge: true });
                    console.log("New highest score saved to Firestore.");
                } else {
                    console.log("Score saved to Firestore.");
                }
            } else {
                console.log("User profile not found.");
            }
        } catch (error) {
            console.error("Error saving score: ", error);
        }
    };

    const handleSwipe = (direction) => {
        const newBoard = JSON.parse(JSON.stringify(board)); 

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
            addNewTile(newBoard); 
            setBoard(newBoard);
        }

        if (isGameOver(newBoard)) {
            Alert.alert('Game Over', 'No more moves left!', [{ text: 'Restart', onPress: initializeGame }]);
            saveScore(score);  
        }
    };

    const moveUp = (newBoard) => {
        let moved = false;

        for (let col = 0; col < BOARD_SIZE; col++) {
            let compressedCol = [];
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== 0) {
                    compressedCol.push(newBoard[row][col]); 
                }
            }
            let mergedCol = [];

            for (let i = 0; i < compressedCol.length; i++) {
                if (compressedCol[i] === compressedCol[i + 1]) {
                    const newValue = compressedCol[i] * 2; 
                    mergedCol.push(newValue); 
                    setScore((prevScore) => prevScore + newValue); 
                    i++; 
                    moved = true;
                } else {
                    mergedCol.push(compressedCol[i]);
                }
            }

            // Add zeros to the end
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
                    compressedCol.push(newBoard[row][col]); 
                }
            }
            let mergedCol = [];

            for (let i = compressedCol.length - 1; i >= 0; i--) {
                if (compressedCol[i] === compressedCol[i - 1]) {
                    const newValue = compressedCol[i] * 2; 
                    mergedCol.unshift(newValue); 
                    setScore((prevScore) => prevScore + newValue); 
                    i--; 
                    moved = true;
                } else {
                    mergedCol.unshift(compressedCol[i]);
                }
            }

          
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
            let compressedRow = newBoard[row].filter((val) => val !== 0); 
            let mergedRow = [];

            for (let i = 0; i < compressedRow.length; i++) {
                if (compressedRow[i] === compressedRow[i + 1]) {
                    const newValue = compressedRow[i] * 2; 
                    mergedRow.push(newValue);
                    setScore((prevScore) => prevScore + newValue); 
                    i++; 
                    moved = true;
                } else {
                    mergedRow.push(compressedRow[i]);
                }
            }

            // Add zeros to the end
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
            let compressedRow = newBoard[row].filter((val) => val !== 0); 
            let mergedRow = [];

            for (let i = compressedRow.length - 1; i >= 0; i--) {
                if (compressedRow[i] === compressedRow[i - 1]) {
                    const newValue = compressedRow[i] * 2; 
                    mergedRow.unshift(newValue); 
                    setScore((prevScore) => prevScore + newValue);
                    i--; 
                    moved = true;
                } else {
                    mergedRow.unshift(compressedRow[i]);
                }
            }

            
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
        if (auth.currentUser) {
            initializeGame(); 
        } else {
            console.log("User is not logged in.");
            Alert.alert("Log In", "You must be logged in to play the game.", [
                { text: "Log In", onPress: () => navigation.navigate('Login') } 
            ]);
        }
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