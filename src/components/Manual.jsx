import { useState } from "react"

export default function Manual({ onNumbers, onBack }) {
  const [nums, setNums] = useState(["", "", "", ""])

  function handleChange(i, val) {
    const updated = [...nums]
    updated[i] = val
    setNums(updated)
  }

  function handleSolve() {
    const parsed = nums.map(Number)
    if (parsed.some(n => isNaN(n) || n < 1 || n > 13)) {
      alert("Please enter 4 numbers between 1 and 13")
      return
    }
    onNumbers(parsed)
  }

  return (
    <div className="screen">
      <button onClick={onBack}>← Back</button>
      <h1>Enter Numbers</h1>
      <p>Type the 4 numbers from your card</p>
      <div className="number-inputs">
        {nums.map((n, i) => (
          <input
            key={i}
            type="number"
            min="1"
            max="13"
            value={n}
            onChange={e => handleChange(i, e.target.value)}
            placeholder="?"
          />
        ))}
      </div>
      <button onClick={handleSolve}>Solve →</button>
    </div>
  )
}