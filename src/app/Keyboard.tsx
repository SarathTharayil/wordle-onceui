import React from "react";
import "./Keyboard.scss";
import { LETTERS } from "./lettersAndWords";
import Key from "./Key";

interface KeyboardProps {
  absentLetters: string[]; // Array of letters marked as absent
  presentLetters: string[]; // Array of letters marked as present
  correctLetters: string[]; // Array of letters marked as correct
  typeLetter: (letter: string) => void; // Function to type a letter
  hitEnter: () => void; // Function to handle Enter key press
  hitBackspace: () => void; // Function to handle Backspace key press
}

const Keyboard: React.FC<KeyboardProps> = ({
  absentLetters,
  presentLetters,
  correctLetters,
  typeLetter,
  hitEnter,
  hitBackspace,
}) => {
  return (
    <div className="keyboard">
      <div className="keyRow">
        {LETTERS.slice(0, 10).map((letter) => (
          <Key
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}
      </div>
      <div className="keyRow">
        {LETTERS.slice(10, 19).map((letter) => (
          <Key
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}
      </div>
      <div className="keyRow">
        <div className="key enter" onClick={hitEnter}>
          ENTER
        </div>
        {LETTERS.slice(19, 26).map((letter) => (
          <Key
            key={letter}
            letter={letter}
            typeLetter={typeLetter}
            isAbsent={absentLetters.includes(letter)}
            isPresent={presentLetters.includes(letter)}
            isCorrect={correctLetters.includes(letter)}
          />
        ))}
        <div className="key backspace" onClick={hitBackspace}>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
          >
            <path
              fill="#f8f8f8"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
