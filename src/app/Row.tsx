import React from "react";
import "./Row.scss";

interface RowProps {
  word: string; // The word to display
  applyRotation: boolean; // Whether to apply rotation classes
  solution: string; // The solution to compare against
  bounceOnError?: boolean; // Optional: Whether to apply bounce effect on error
}

const Row: React.FC<RowProps> = ({ word, applyRotation, solution, bounceOnError }) => {
  return (
    <div className={`row ${bounceOnError && "row--bounce"}`}>
      {word.split("").map((letter, index) => {
        const bgClass =
          solution[index] === letter
            ? "correct"
            : solution.includes(letter)
            ? "present"
            : "absent";

        return (
          <div
            className={`letter ${bgClass} ${
              applyRotation ? `rotate--${index + 1}00` : ""
            } ${letter !== " " ? "letter--active" : ""}`}
            key={index}
          >
            <div className="front">{letter}</div> 
            <div className="back">{letter}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Row;
