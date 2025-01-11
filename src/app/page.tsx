"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Rowmain from "./Row";
import Keyboard from "./Keyboard";
import { LETTERS, potentialWords } from "./lettersAndWords";
import {
  Text,
  Row,
  Logo,
  Button,
  StyleOverlay,
  IconButton,
  Column,
} from "@/once-ui/components";

interface GameState {
  guesses: string[];
  solutionFound: boolean;
  activeLetterIndex: number;
  notification: string;
  activeRowIndex: number;
  failedGuesses: string[];
  correctLetters: string[];
  presentLetters: string[];
  absentLetters: string[];
  gameOver: boolean;
  solution: string;
}

const getDailyWord = (): string => {
  const today: Date = new Date();
  const start: Date = new Date(1970, 0, 1);
  const diff: number = today.getTime() - start.getTime();
  const daysSinceEpoch: number = Math.floor(diff / (1000 * 60 * 60 * 24));
  const wordIndex: number = daysSinceEpoch % potentialWords.length;
  return potentialWords[wordIndex];
};

const SOLUTION = getDailyWord();
const STORAGE_KEY = 'wordleGameState';

export default function Home() {
  // Initialize state with default values first
  const defaultState = {
    guesses: Array(6).fill("     "),
    solutionFound: false,
    activeLetterIndex: 0,
    notification: "",
    activeRowIndex: 0,
    failedGuesses: [],
    correctLetters: [],
    presentLetters: [],
    absentLetters: [],
    gameOver: false,
    solution: SOLUTION
  };

  // Move localStorage logic into a useEffect
  const [gameState, setGameState] = useState<GameState>(defaultState);
  const {
    guesses,
    solutionFound,
    activeLetterIndex,
    notification,
    activeRowIndex,
    failedGuesses,
    correctLetters,
    presentLetters,
    absentLetters,
    gameOver
  } = gameState;

  // Load saved state on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Check if the saved solution matches current daily word
        if (parsedState.solution === SOLUTION) {
          setGameState(parsedState);
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const gameStateToSave = {
        guesses,
        solutionFound,
        activeLetterIndex,
        notification,
        activeRowIndex,
        failedGuesses,
        correctLetters,
        presentLetters,
        absentLetters,
        gameOver,
        solution: SOLUTION
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameStateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [guesses, solutionFound, activeLetterIndex, notification, activeRowIndex, 
      failedGuesses, correctLetters, presentLetters, absentLetters, gameOver]);

  const wordleRef = useRef<HTMLInputElement>(null);

  const isGameFinished = useCallback(() => {
    return solutionFound || gameOver;
  }, [solutionFound, gameOver]);

  const typeLetter = useCallback((letter: string) => {
    if (isGameFinished()) return;
    
    if (activeLetterIndex < 5) {
      setGameState(prevState => ({
        ...prevState,
        notification: "",
        guesses: prevState.guesses.map((guess, idx) => 
          idx === activeRowIndex 
            ? replaceCharacter(guess, activeLetterIndex, letter)
            : guess
        ),
        activeLetterIndex: prevState.activeLetterIndex + 1
      }));
    }
  }, [activeLetterIndex, activeRowIndex, isGameFinished]);

  const replaceCharacter = (string: string, index: number, replacement: string): string => {
    return (
      string.slice(0, index) +
      replacement +
      string.slice(index + replacement.length)
    );
  };

  const hitEnter = useCallback(() => {
    if (isGameFinished()) return;

    if (activeLetterIndex === 5) {
      const currentGuess = guesses[activeRowIndex];
      if (!potentialWords.includes(currentGuess)) {
        setGameState(prevState => ({
          ...prevState,
          notification: "that might not be an actual word.",
        }));
      } else if (failedGuesses.includes(currentGuess)) {
        setGameState(prevState => ({
          ...prevState,
          notification: "word already tried.",
        }));
      } else if (currentGuess === SOLUTION) {
        setGameState(prevState => ({
          ...prevState,
          solutionFound: true,
          notification: "well done!",
          correctLetters: [...SOLUTION],
          gameOver: true,
        }));
      } else {
        const newCorrectLetters: string[] = [];
        [...currentGuess].forEach((letter, index) => {
          if (SOLUTION[index] === letter) newCorrectLetters.push(letter);
        });
        setGameState(prevState => ({
          ...prevState,
          correctLetters: [...new Set(newCorrectLetters)],
          presentLetters: [
            ...new Set([
              ...prevState.presentLetters,
              ...[...currentGuess].filter((letter) => SOLUTION.includes(letter)),
            ]),
          ],
          absentLetters: [
            ...new Set([
              ...prevState.absentLetters,
              ...[...currentGuess].filter((letter) => !SOLUTION.includes(letter)),
            ]),
          ],
          failedGuesses: [...prevState.failedGuesses, currentGuess],
          notification: "",
        }));
  
        // Only set game over if we're at the last row AND it's a valid word
        if (activeRowIndex >= 5) {
          setGameState(prevState => ({
            ...prevState,
            gameOver: true,
            notification: `game over! reset the game and try again".`,
          }));
        } else {
          setGameState(prevState => ({
            ...prevState,
            activeRowIndex: prevState.activeRowIndex + 1,
            activeLetterIndex: 0,
          }));
        }
      }
    } else {
      setGameState(prevState => ({
        ...prevState,
        notification: "try a five-letter word",
      }));
    }
  }, [
    activeLetterIndex,
    activeRowIndex,
    guesses,
    failedGuesses,
    presentLetters,
    absentLetters,
    SOLUTION,
    isGameFinished
  ]);

  const hitBackspace = useCallback(() => {
    if (isGameFinished()) return;

    if (activeLetterIndex > 0) {
      setGameState(prevState => ({
        ...prevState,
        notification: "",
        guesses: prevState.guesses.map((guess, idx) => 
          idx === activeRowIndex 
            ? replaceCharacter(guess, activeLetterIndex - 1, " ")
            : guess
        ),
        activeLetterIndex: prevState.activeLetterIndex - 1
      }));
    }
  }, [activeLetterIndex, activeRowIndex, isGameFinished]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isGameFinished()) return;
  
    if (LETTERS.includes(event.key)) {
      typeLetter(event.key);
      return;
    }
  
    if (event.key === "Enter") {
      hitEnter();
      return;
    }
  
    if (event.key === "Backspace") {
      hitBackspace();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (isGameFinished()) return;

      const key = event.key.toUpperCase();
      if (LETTERS.includes(key)) {
        typeLetter(key);
      } else if (event.key === "Enter") {
        hitEnter();
      } else if (event.key === "Backspace") {
        hitBackspace();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [typeLetter, hitEnter, hitBackspace, isGameFinished]);

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(defaultState);
  };

  return (
    <Column
      fillWidth
      paddingY="20"
      paddingX="s"
      alignItems="center"
      flex={1}
      justifyContent="center"
    >
      <Column fillWidth alignItems="center" gap="8" padding="32" position="relative">
        <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
          <Row
            data-border="rounded"
            justifyContent="space-between"
            maxWidth="l"
            paddingRight="64"
            paddingLeft="32"
            paddingY="20"
          >
            <Logo size="m" icon={true} wordmark={false} href="https://saraththarayil.com" />
            <Row gap="12" hide="s">
              <Button
                onClick={resetGame}
                variant="tertiary"
                size="s"
                prefixIcon = "refresh"
              >
                Reset
              </Button>
              <StyleOverlay top="20" right="24" />
            </Row>
            <Row gap="16" show="s" alignItems="center" paddingRight="24">
              <IconButton
                onClick={resetGame}
                variant="tertiary"
                size="s"
                icon="refresh"
              />

              <StyleOverlay top="20" right="24" />
            </Row>
          </Row>
        </Row>
        <Text variant="display-strong-s">
          wordle
        </Text>
        <Column fillWidth alignItems="center" gap="8" padding="32" position="relative">
          <div className={`notification ${solutionFound && "notification--green"}`}>
            {notification}
          </div>

          {guesses.map((guess, index) => {
            return (
              <Rowmain
                key={index}
                word={guess}
                applyRotation={
                  activeRowIndex > index ||
                  (solutionFound && activeRowIndex === index)
                }
                solution={SOLUTION}
                bounceOnError={
                  notification !== "well done!" &&
                  notification !== "" &&
                  activeRowIndex === index
                }
              />
            );
          })}
        </Column>
      </Column>
      <div
        ref={wordleRef}
        tabIndex={0}
        onBlur={(e) => {
          e.target.focus();
        }}
        onKeyDown={handleKeyDown}
        style={{
          outline: "none",
        }}
      >
        <Keyboard
          presentLetters={presentLetters}
          correctLetters={correctLetters}
          absentLetters={absentLetters}
          typeLetter={typeLetter}
          hitEnter={hitEnter}
          hitBackspace={hitBackspace}
        />
      </div>
    </Column>
  );
}