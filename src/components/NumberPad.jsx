import { useState, useRef } from "react"

export default function NumberPad({ onSolve }) {
  const [selected, setSelected] = useState([])
  const holdTimer = useRef(null)

  function handleTap(num) {
    if (selected.length >= 4) return
    setSelected(prev => [...prev, num])
  }

  function handleBackspaceTap() {
    setSelected(prev => prev.slice(0, -1))
  }

  function handleBackspaceHoldStart() {
    holdTimer.current = setTimeout(() => {
      setSelected([])
    }, 600)
  }

  function handleBackspaceHoldEnd() {
    clearTimeout(holdTimer.current)
  }

  function handleRandom() {
    const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
    setSelected(nums)
  }

  const positions = [
    { style: { top: "6%", left: "50%", transform: "translateX(-50%)" } },
    { style: { left: "6%", top: "50%", transform: "translateY(-50%)" } },
    { style: { right: "6%", top: "50%", transform: "translateY(-50%)" } },
    { style: { bottom: "6%", left: "50%", transform: "translateX(-50%)" } },
  ]
function getDifficulty(nums) {
  if (nums.length < 4) return null

  const ops = ['+', '-', '*', '/']

  function applyOp(a, b, op) {
    if (op === '+') return a + b
    if (op === '-') return a - b
    if (op === '*') return a * b
    if (op === '/') return b === 0 ? null : a / b
  }

  function permutations(arr) {
    if (arr.length <= 1) return [arr]
    const result = []
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
      for (const p of permutations(rest)) result.push([arr[i], ...p])
    }
    return result
  }

  function buildTrees(arr) {
    if (arr.length === 1) return [arr[0]]
    const trees = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i === j) continue
        const rest = arr.filter((_, k) => k !== i && k !== j)
        for (const op of ops) {
          const node = [arr[i], op, arr[j]]
          for (const subtree of buildTrees([...rest, node])) {
            trees.push(subtree)
          }
        }
      }
    }
    return trees
  }

  function evaluate(expr) {
    if (typeof expr === 'number') return { val: expr, depth: 0 }
    const [a, op, b] = expr
    const left = evaluate(a)
    const right = evaluate(b)
    if (left.val === null || right.val === null) return { val: null, depth: 0 }
    const val = applyOp(left.val, right.val, op)
    if (val === null || !Number.isInteger(val) || val < 0) return { val: null, depth: 0 }
    return { val, depth: left.depth + right.depth + 1 }
  }

  const seen = new Set()
  let count = 0
  let totalDepth = 0

  for (const perm of permutations(nums)) {
    for (const tree of buildTrees(perm)) {
      const { val, depth } = evaluate(tree)
      if (val !== null && Math.abs(val - 24) < 1e-9) {
        const key = JSON.stringify(tree)
        if (!seen.has(key)) {
          seen.add(key)
          count++
          totalDepth += depth
        }
      }
    }
  }

  if (count === 0) return null
  const avgDepth = totalDepth / count

  if (count >= 5 && avgDepth <= 3) return 'easy'
  if (count >= 2 || avgDepth <= 4) return 'medium'
  return 'hard'
}
  return (
    <div className="pad-screen">
      <div className="title">
  <span className="title-name">Hugo Rust</span>
  <span className="title-math">MATH24</span>
</div>

      <div className="card">
  {selected.length === 4 && (
    <div className="difficulty-dots">
      {getDifficulty(selected) === 'easy' && (
        <>
          <span className="dot dot-white" />
          <span className="dot dot-empty" />
          <span className="dot dot-empty" />
        </>
      )}
      {getDifficulty(selected) === 'medium' && (
        <>
          <span className="dot dot-orange" />
          <span className="dot dot-orange" />
          <span className="dot dot-empty" />
        </>
      )}
      {getDifficulty(selected) === 'hard' && (
        <>
          <span className="dot dot-red" />
          <span className="dot dot-red" />
          <span className="dot dot-red" />
        </>
      )}
    </div>
  )}
        <div className="card-circle">
          <div className="starburst" />
          {positions.map((pos, i) => (
            <div key={i} className="card-number" style={pos.style}>
              {selected[i] !== undefined ? selected[i] : ""}
            </div>
          ))}
          <div className="card-center">
            {selected.length === 4 ? (
              <button className="solve-btn" onClick={() => onSolve(selected)}>
                SOLVE
              </button>
            ) : (
              <span className="center-hint">{selected.length}/4</span>
            )}
          </div>
        </div>
      </div>

      <div className="numpad">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            className="num-btn"
            onClick={() => handleTap(n)}
            disabled={selected.length >= 4}
          >
            {n}
          </button>
        ))}
        <button
          className="num-btn clear-btn"
          onClick={handleBackspaceTap}
          onMouseDown={handleBackspaceHoldStart}
          onMouseUp={handleBackspaceHoldEnd}
          onTouchStart={handleBackspaceHoldStart}
          onTouchEnd={handleBackspaceHoldEnd}
        >
          ⌫
        </button>
        <button
          className="num-btn random-btn"
          onClick={handleRandom}
        >
          🎲 Random
        </button>
      </div>
    </div>
  )
}