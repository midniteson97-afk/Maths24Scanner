import { useState } from "react"
import "./App.css"
import Camera from "./components/Camera"
import Results from "./components/Results"
import Manual from "./components/Manual"

export default function App() {
  const [screen, setScreen] = useState("camera")
  const [numbers, setNumbers] = useState([])

  function handleNumbers(nums) {
    setNumbers(nums)
    setScreen("results")
  }

  return (
    <div className="app">
      {screen === "camera" && (
        <Camera onNumbers={handleNumbers} onManual={() => setScreen("manual")} />
      )}
      {screen === "manual" && (
        <Manual onNumbers={handleNumbers} onBack={() => setScreen("camera")} />
      )}
      {screen === "results" && (
        <Results numbers={numbers} onBack={() => setScreen("camera")} />
      )}
    </div>
  )
}