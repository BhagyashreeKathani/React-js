import React, { useState } from 'react';
import './App.css';

function App() {
  const emptyGrid = Array(9).fill().map(() => Array(9).fill(""));

  const [grid, setGrid] = useState(emptyGrid);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? value : cell
        )
      );
      setGrid(newGrid);
      setError("");
    }
  };

  // Validate Sudoku grid
  const isValid = (grid) => {
    const isUnique = (array) => {
      const filtered = array.filter(val => val !== "");
      return new Set(filtered).size === filtered.length;
    };

    for (let i = 0; i < 9; i++) {
      if (!isUnique(grid[i])) return false; // Check rows
      if (!isUnique(grid.map(row => row[i]))) return false; // Check columns
      const box = [];
      const startRow = Math.floor(i / 3) * 3;
      const startCol = (i % 3) * 3;
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          box.push(grid[r][c]);
        }
      }
      if (!isUnique(box)) return false; // Check 3x3 boxes
    }
    return true;
  };

  // Solve Sudoku using backtracking
  const solveSudoku = () => {
    const solve = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === "") {
            for (let num = 1; num <= 9; num++) {
              const strNum = num.toString();
              grid[row][col] = strNum;
              if (isValid(grid) && solve(grid)) {
                return true;
              }
              grid[row][col] = ""; // Reset cell
            }
            return false;
          }
        }
      }
      return true;
    };

    const newGrid = grid.map(row => row.slice());
    if (isValid(newGrid)) {
      if (solve(newGrid)) {
        setGrid(newGrid);
        setError("");
      } else {
        setError("No solution found.");
      }
    } else {
      setError("Initial entries are invalid.");
    }
  };

  // Validate button
  const handleValidate = () => {
    if (isValid(grid)) {
      setError("The grid is valid.");
    } else {
      setError("The grid has errors.");
    }
  };

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
                className="cell"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={handleValidate}>Validate</button>
        <button onClick={solveSudoku}>Solve</button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
