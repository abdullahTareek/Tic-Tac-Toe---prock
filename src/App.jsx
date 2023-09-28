import { useState,  useEffect, useRef } from "react";
import "./app.css";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// sounds 
import winSound from '/assets/winning-sound.mp3';
import drawSound from '/assets/draw-sound.mp3';
import clickSound from '/assets/clicking-sound.mp3';

const winAudio = new Audio(winSound);
const drawAudio = new Audio(drawSound);
const clickAudio = new Audio(clickSound);

function App() {
  const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
  const [go, setGo] = useState("cross");
  const cellsRef = useRef([]);
  const [theWinner, setTheWinner] = useState('');
  const [theme, setTheme] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [xWons, setXWins] = useState(0);
  const [oWons, setOWins] = useState(0);
  const winningPosbilities = [
    // number 1  rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Number 2 columns 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    
    // number 3 diogonals
    [0, 4, 8],
    [2, 4, 6],
  ]

  const handleCellChange = function (id, pram) {
    let copyCells = [...cells];
    copyCells[id] = pram;
    setCells(copyCells);
  };

  const handleClick = (evt) => {
    const id = evt.target.id;
    const innerHTML = evt.target.innerHTML;
    if (theWinner == ''){
      if (innerHTML === "") {
          clickAudio.play();  
        if (go === "circle") {
          evt.target.innerHTML = "O";
          setGo("cross");
          handleCellChange(id, 1); // Pass the id as a number
        } else if (go === "cross") {
          evt.target.innerHTML = "X";
          setGo("circle");
          handleCellChange(id, 2); // Pass the id as a number
        }
      } else {
        console.log("Square already filled");
      }
    }
  }
  
  // Define a separate function to check for a win
  const checkWin = () => {
    let hasWinner = false;
  
    winningPosbilities.forEach((ele) => {
      const oWins = ele.every((ele2) => cells[ele2] === 1);
      const xWins = ele.every((ele2) => cells[ele2] === 2);
      if (oWins) {
        console.log("O wins!");
        setTheWinner('Circle has won!');
        setOWins(oWons + 1)
        hasWinner = true;
        winAudio.play();
      }
      if (xWins) {
        console.log("X wins!");
        setTheWinner( 'Cross has won!');
        setXWins(xWons + 1)
        hasWinner = true;
        winAudio.play();
      }
    });
  
    if (!hasWinner && cells.every((cell) => cell !== "")) {
      setTheWinner('It\'s a draw!');
      console.log("It's a draw!");
      drawAudio.play();
    }
  };
  
  
  

  useEffect(() => {
    // Call the checkWin function whenever cells change
    checkWin();
  }, [cells]);

  const clearGame = function () {
    setTheWinner('')
    const cellsIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    cellsIndex.forEach((i) => {
      cellsRef.current[i].innerHTML = ''
    });
    setCells(["", "", "", "", "", "", "", "", ""]);
  };
  

// console.log(cellsRef.current[1].innerHTML)
  console.log(cells)

  const handleTheme = function (){
    setTheme(!theme);
    if (theme === false) {
      document.body.style.backgroundColor = "#000";
    } else if (theme === true) {
      document.body.style.backgroundColor = "#eee";
    }
  }


  const handleReset = function (){
    setXWins(0);
    setOWins(0);
  }

  const toggleScores = () => {
    setShowScores(!showScores);
  };
  return (
    <>
    <div className={theme ? "ticTacToe" : "ticTacToe lightTheme"}>
        {cells.map(function (cell, index) {
          return (
            <div
              id={index}
              key={index}
              className="sqaure"
              onClick={handleClick}
              ref={(el) => (cellsRef.current[index] = el)}
            ></div>
          );
        })}
      </div>
      {theWinner === '' ? (
      <>
        <h3 className={theme ? "playMessage" : "playMessage lightTheme"}>{`now it's ${go} time to play`} </h3>
      </>
      ) : null}




      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><span className="close-button" id="closePopup" onClick={clearGame} >Restart</span></div>
      <div className={theme ? "theWinner" : "theWinner lightTheme"} >{theWinner}</div>
      


      <button className={theme ? "scores" : "scores lightTheme"} onClick={toggleScores}>score</button>
      {showScores && (
        <div className="popup-container" onClick={toggleScores}>
          <div className={theme ? "popup-content" : "popup-content lightTheme"}>
            <HighlightOffIcon className={theme ? "closing-button" : "closing-button lightTheme"} onClick={toggleScores}/>
            <h2>{` your latest scores!`}</h2>
            <div className={theme ? "xAndO" : "xAndO lightTheme"}>
              <div className="xWon" >cross : {xWons}</div>
              <div className="oWon" >circle : {oWons}</div>
            </div>
            <button className={theme ? "resetBtn" : "resetBtn lightTheme"} onClick={handleReset}>Reset scores</button>
          </div>
        </div>
      )}


      <Brightness4Icon onClick={handleTheme} fontSize="large" className={theme ? "modeIcon" : "modeIcon lightTheme"}/>
    </>
  );
}

export default App;
