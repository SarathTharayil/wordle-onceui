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
  // Initialize state from localStorage or default values
  const initializeState = () => {
    const savedState = window.localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Check if the saved solution matches current daily word
      if (parsedState.solution === SOLUTION) {
        return parsedState;
      }
    }
    return {
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
  };

  const initialState = initializeState();
  const [guesses, setGuesses] = useState<string[]>(initialState.guesses);
  const [solutionFound, setSolutionFound] = useState<boolean>(initialState.solutionFound);
  const [activeLetterIndex, setActiveLetterIndex] = useState<number>(initialState.activeLetterIndex);
  const [notification, setNotification] = useState<string>(initialState.notification);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(initialState.activeRowIndex);
  const [failedGuesses, setFailedGuesses] = useState<string[]>(initialState.failedGuesses);
  const [correctLetters, setCorrectLetters] = useState<string[]>(initialState.correctLetters);
  const [presentLetters, setPresentLetters] = useState<string[]>(initialState.presentLetters);
  const [absentLetters, setAbsentLetters] = useState<string[]>(initialState.absentLetters);
  const [gameOver, setGameOver] = useState<boolean>(initialState.gameOver);

  const wordleRef = useRef<HTMLInputElement>(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const gameState = {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [guesses, solutionFound, activeLetterIndex, notification, activeRowIndex, 
      failedGuesses, correctLetters, presentLetters, absentLetters, gameOver]);

  const isGameFinished = useCallback(() => {
    return solutionFound || gameOver;
  }, [solutionFound, gameOver]);

  const typeLetter = useCallback((letter: string) => {
    if (isGameFinished()) return;
    
    if (activeLetterIndex < 5) {
      setNotification("");
      const newGuesses = [...guesses];
      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex,
        letter
      );
      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index + 1);
    }
  }, [guesses, activeLetterIndex, activeRowIndex, isGameFinished]);

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
        setNotification("that might not be an actual word.");
      } else if (failedGuesses.includes(currentGuess)) {
        setNotification("word already tried.");
      } else if (currentGuess === SOLUTION) {
        setSolutionFound(true);
        setNotification("well done!");
        setCorrectLetters([...SOLUTION]);
        setGameOver(true);
      } else {
        const newCorrectLetters: string[] = [];
        [...currentGuess].forEach((letter, index) => {
          if (SOLUTION[index] === letter) newCorrectLetters.push(letter);
        });
        setCorrectLetters([...new Set(newCorrectLetters)]);
  
        setPresentLetters([
          ...new Set([
            ...presentLetters,
            ...[...currentGuess].filter((letter) => SOLUTION.includes(letter)),
          ]),
        ]);
  
        setAbsentLetters([
          ...new Set([
            ...absentLetters,
            ...[...currentGuess].filter((letter) => !SOLUTION.includes(letter)),
          ]),
        ]);
  
        setFailedGuesses([...failedGuesses, currentGuess]);
  
        // Only set game over if we're at the last row AND it's a valid word
        if (activeRowIndex >= 5) {
          setGameOver(true);
          setNotification(`game over! solution was "${SOLUTION}".`);
        } else {
          setActiveRowIndex((index) => index + 1);
          setActiveLetterIndex(0);
        }
      }
    } else {
      setNotification("five-letter word needed.");
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

    setNotification("");
    if (activeLetterIndex > 0) {
      const newGuesses = [...guesses];
      newGuesses[activeRowIndex] = replaceCharacter(
        newGuesses[activeRowIndex],
        activeLetterIndex - 1,
        " "
      );
      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index - 1);
    }
  }, [guesses, activeRowIndex, activeLetterIndex, isGameFinished]);

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
              <StyleOverlay top="20" right="24" />
            </Row>
            <Row gap="16" show="s" alignItems="center" paddingRight="24">
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