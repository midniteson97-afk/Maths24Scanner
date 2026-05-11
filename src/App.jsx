import { useState } from "react"
import "./App.css"
import NumberPad from "./components/NumberPad"
import Results from "./components/Results"

export default function App() {
  const [screen, setScreen] = useState("pad")
  const [numbers, setNumbers] = useState([])

  function handleNumbers(nums) {
    setNumbers(nums)
    setScreen("results")
  }

  return (
    <div className="app">
      {screen === "pad" && (
        <NumberPad onSolve={handleNumbers} />
      )}
      {screen === "results" && (
        <Results numbers={numbers} onBack={() => setScreen("pad")} />
      )}
    </div>
  )
}