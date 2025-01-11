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

const getDailyWord = () => {
  // Calculate days since epoch (January 1, 1970)
  const today = new Date();
  const start = new Date(1970, 0, 1);
  const diff = today - start;
  const daysSinceEpoch = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Use the day number to select a word from the array
  const wordIndex = daysSinceEpoch % potentialWords.length;
  return potentialWords[wordIndex];
};

const SOLUTION = getDailyWord();

export default function Home() {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill("     "));
  const [solutionFound, setSolutionFound] = useState<boolean>(false);
  const [activeLetterIndex, setActiveLetterIndex] = useState<number>(0);
  const [notification, setNotification] = useState<string>("");
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [failedGuesses, setFailedGuesses] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [presentLetters, setPresentLetters] = useState<string[]>([]);
  const [absentLetters, setAbsentLetters] = useState<string[]>([]);

  const wordleRef = useRef<HTMLInputElement>(null);

  const typeLetter = useCallback((letter: string) => {
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
  }, [guesses, activeLetterIndex, activeRowIndex]);

  const replaceCharacter = (string: string, index: number, replacement: string): string => {
    return (
      string.slice(0, index) +
      replacement +
      string.slice(index + replacement.length)
    );
  };

  const hitEnter = useCallback(() => {
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
  
        if (activeRowIndex === 5) {
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
  ]);
  

  const hitBackspace = useCallback(() => {
    setNotification("");
    if (guesses[activeRowIndex][0] !== " ") {
      const newGuesses = [...guesses];
      newGuesses[activeRowIndex] = replaceCharacter(newGuesses[activeRowIndex], activeLetterIndex - 1, " ");
      setGuesses(newGuesses);
      setActiveLetterIndex((index) => index - 1);
    }
  }, [guesses, activeRowIndex, activeLetterIndex]);

  const handleKeyDown = (event) => {
    if (solutionFound) return;

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

  // useEffect for handling keydown events
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
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
  }, [typeLetter, hitEnter, hitBackspace]);

  return (
    
    <Column
      fillWidth
      paddingY="20"
      paddingX="s"
      alignItems="center"
      flex={1}
      justifyContent="center"  // Center all content vertically
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
