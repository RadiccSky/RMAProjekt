import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {supabase} from '../../SupabaseClient';
import {useAuth} from '../../AuthContext';
import { useNavigation } from '@react-navigation/native'; // Add this line for navigation

const BOARD_SIZE = 4;

const GameLogic = () => {
    const navigation = useNavigation(); // Initialize navigation
    const [score, setScore] = useState(0);  
    const { user, loading } = useAuth(); // Pristup korisničkim podacima iz AuthContext-a
    const [board, setBoard] = useState(Array.from({ length: BOARD_SIZE },
        () => Array(BOARD_SIZE).fill(0)));

    

    useEffect(() => {
        if (loading) return; // Čekaj da se autentifikacijsko stanje učita
        if (!user) {
            Alert.alert('Log In', 'You must be logged in to play the game.', [
                { text: 'Log In', onPress: () => navigation.navigate('Login') },
            ]);
        } else {
            initializeGame(); // Pokreni igru ako je korisnik prijavljen
        }
    }, [user, loading]);

    const initializeGame = () => {
        resetScore(); // Reset score
        const newBoard = Array.from({ length: BOARD_SIZE },
            () => Array(BOARD_SIZE).fill(0));
        addNewTile(newBoard);
        addNewTile(newBoard);
        setBoard(newBoard);
    };
    const resetScore = () =>  setScore(0);

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
            newBoard[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% for 2, 10% for 4
        }
    };

    const saveScore = async (score) => {
        if (!user) return;
        try {
            const { user: currentUser, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!currentUser || !currentUser.id) return;
    
            // Pretvori score u string (text)
            const scoreAsString = String(score);
    
            const { data, error } = await supabase
                .from('game_scores')
                .select('score_2048')
                .eq('user_id', currentUser.id)
                .single();
    
            if (error) throw error;
    
            const highestScore = data?.score_2048 || "0"; // Ako je trenutno najviši rezultat 0, postavi ga kao string
    
            // Ako je trenutni score veći od najvišeg, spremi novi rezultat
            if (parseInt(scoreAsString) > parseInt(highestScore)) {
                const { error: updateError } = await supabase
                    .from('game_scores')
                    .update({ score_2048: scoreAsString }) // Spremi kao string
                    .eq('user_id', currentUser.id);
    
                if (updateError) throw updateError;
    
                console.log("New highest score saved.");
            } else {
                console.log("Score saved.");
            }
        } catch (error) {
            console.error("Error saving score: ", error.message);
        }
    };
    const handleSwipe = (direction) => {
        const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy of the board
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
            addNewTile(newBoard); // Add a new tile only if the move is valid
            setBoard(newBoard);
        }

        if (isGameOver(newBoard)) {
            Alert.alert('Game Over', 'No more moves left!', [{ text: 'Restart', onPress: initializeGame }]);
            saveScore(score);  // Save the score when the game ends
        }
    };

    const moveUp = (newBoard) => {
        let moved = false;

        for (let col = 0; col < BOARD_SIZE; col++) {
            let compressedCol = [];
            for (let row = 0; row < BOARD_SIZE; row++) {
                if (newBoard[row][col] !== 0) {
                    compressedCol.push(newBoard[row][col]); // Remove zeros
                }
            }
            let mergedCol = [];

            for (let i = 0; i < compressedCol.length; i++) {
                if (compressedCol[i] === compressedCol[i + 1]) {
                    const newValue = compressedCol[i] * 2; // Merge same values
                    mergedCol.push(newValue); // Add to the end
                    setScore((prevScore) => prevScore + newValue); // Add score
                    i++; // Skip the next tile
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
                    compressedCol.push(newBoard[row][col]); // Remove zeros
                }
            }
            let mergedCol = [];

            for (let i = compressedCol.length - 1; i >= 0; i--) {
                if (compressedCol[i] === compressedCol[i - 1]) {
                    const newValue = compressedCol[i] * 2; // Merge same values
                    mergedCol.unshift(newValue); // Add to the beginning
                    setScore((prevScore) => prevScore + newValue); // Add score
                    i--; // Skip the next tile
                    moved = true;
                } else {
                    mergedCol.unshift(compressedCol[i]);
                }
            }

            // Add zeros to the beginning
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
            let compressedRow = newBoard[row].filter((val) => val !== 0); // Remove zeros
            let mergedRow = [];

            for (let i = 0; i < compressedRow.length; i++) {
                if (compressedRow[i] === compressedRow[i + 1]) {
                    const newValue = compressedRow[i] * 2; // Merge same values
                    mergedRow.push(newValue);
                    setScore((prevScore) => prevScore + newValue); // Add score
                    i++; // Skip the next tile
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
            let compressedRow = newBoard[row].filter((val) => val !== 0); // Remove zeros
            let mergedRow = [];

            for (let i = compressedRow.length - 1; i >= 0; i--) {
                if (compressedRow[i] === compressedRow[i - 1]) {
                    const newValue = compressedRow[i] * 2; // Merge same values
                    mergedRow.unshift(newValue); // Add to the beginning
                    setScore((prevScore) => prevScore + newValue); // Add score
                    i--; // Skip the next tile
                    moved = true;
                } else {
                    mergedRow.unshift(compressedRow[i]);
                }
            }

            // Add zeros to the beginning
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
        // Check if all moves are blocked or there are no empty tiles
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
        if (supabase.auth.getUser()) {
            initializeGame(); // Initialize the game if the user is logged in
        } else {
            console.log("User is not logged in.");
            Alert.alert("Log In", "You must be logged in to play the game.", [
                { text: "Log In", onPress: () => navigation.navigate('Login') } // Redirect to login screen
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