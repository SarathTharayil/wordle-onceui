import React from "react";

interface KeyProps {
  isAbsent: boolean; // Indicates if the letter is absent
  isPresent: boolean; // Indicates if the letter is present
  isCorrect: boolean; // Indicates if the letter is correct
  letter: string; // The letter displayed on the key
  typeLetter: (letter: string) => void; // Function to handle the letter click
}

const Key: React.FC<KeyProps> = ({ isAbsent, isPresent, isCorrect, letter, typeLetter }) => {
  return (
    <div
      className={`key ${isAbsent ? "key--absent" : ""} ${
        isPresent ? "key--present" : ""
      } ${isCorrect ? "key--correct" : ""}`}
      onClick={() => typeLetter(letter)}
    >
      {letter}
    </div>
  );
};

export default Key;
