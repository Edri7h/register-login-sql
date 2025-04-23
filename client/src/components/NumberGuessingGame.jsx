import { useState } from "react";
import { USER_API_END_POINT } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NumberGuessingGame() {
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(100);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState("setup");
  const [history, setHistory] = useState([]);
  const [remainingGuesses, setRemainingGuesses] = useState(10);

  const generateRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const startGame = () => {
    const randomNum = generateRandomNumber(minRange, maxRange);
    setTargetNumber(randomNum);
    setAttempts(0);
    setGuess("");
    setMessage(`I'm thinking of a number between ${minRange} and ${maxRange}. Can you guess it?`);
    setGameState("playing");
    setHistory([]);
    setRemainingGuesses(10);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    
    const userGuess = parseInt(guess, 10);
    
    if (isNaN(userGuess)) {
      setMessage("Please enter a valid number.");
      return;
    }
    
    if (userGuess < minRange || userGuess > maxRange) {
      setMessage(`Please enter a number between ${minRange} and ${maxRange}.`);
      return;
    }
    
    const newAttempts = attempts + 1;
    const newRemainingGuesses = remainingGuesses - 1;
    setAttempts(newAttempts);
    setRemainingGuesses(newRemainingGuesses);
    
    const newHistory = [...history, 
      {
        guess: userGuess, 
        result: userGuess === targetNumber ? "Correct!" : 
                userGuess < targetNumber ? "Too low" : "Too high"
      }
    ];
    setHistory(newHistory);
    
    if (userGuess === targetNumber) {
      setMessage(`Congratulations! You guessed the number in ${newAttempts} attempts!`);
      setGameState("won");
    } else if (newRemainingGuesses <= 0) {
      setMessage(`Game Over! You've used all your guesses. The number was ${targetNumber}.`);
      setGameState("won");
    } else if (userGuess < targetNumber) {
      setMessage(`Too low! Try a higher number. ${newRemainingGuesses} guesses remaining.`);
    } else {
      setMessage(`Too high! Try a lower number. ${newRemainingGuesses} guesses remaining.`);
    }
    
    setGuess("");
  };

  const resetGame = () => {
    setGameState("setup");
    setMessage("");
  }; 
  const navigate =useNavigate()
  const handleLogout= async ()=>{
    try {
        const res = await axios.get(`${USER_API_END_POINT}/logout`,{withCredentials:true})
         if(res.data.success)
        { toast.success("log out success")
            navigate("/")
        }
        
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    {/* Logout Button */}
    <div className="mb-4 flex justify-start">
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
      >
        Logout
      </button>
    </div>
  
    {/* Game Container */}
    <div className="w-full max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Number Guessing Game</h1>
  
      {gameState === "setup" ? (
        <div className="space-y-6">
          <p className="text-gray-700 text-center">Select the range for your guessing game:</p>
  
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Number</label>
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Number</label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(Math.max(minRange + 1, parseInt(e.target.value) || minRange + 1))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
  
          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-700 text-center">{message}</p>
  
          {gameState === "playing" && (
            <form onSubmit={handleGuess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Guess</label>
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter a number between ${minRange} and ${maxRange}`}
                  autoFocus
                />
              </div>
  
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              >
                Submit Guess
              </button>
            </form>
          )}
  
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Previous Guesses</h3>
              <div className="bg-white p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="pb-2 text-left">#</th>
                      <th className="pb-2 text-left">Guess</th>
                      <th className="pb-2 text-left">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-1 pr-4">{index + 1}</td>
                        <td className="py-1 pr-4">{item.guess}</td>
                        <td
                          className={`py-1 ${
                            item.result === "Correct!"
                              ? "text-green-600"
                              : item.result === "Too low"
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
  
          {gameState === "won" && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={startGame}
                className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Play Again
              </button>
              <button
                onClick={resetGame}
                className="w-1/2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              >
                Change Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </>
  
  );
}