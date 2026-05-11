function solve24(nums) {
  const ops = ['+', '-', '*', '/']
  const results = []

  function applyOp(a, b, op) {
    if (op === '+') return a + b
    if (op === '-') return a - b
    if (op === '*') return a * b
    if (op === '/') return b === 0 ? null : a / b
  }

  function sym(op) {
    return op === '*' ? '×' : op === '/' ? '÷' : op
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

  function evaluate(expr) {
    if (typeof expr === 'number') {
      return { val: expr, steps: [], label: String(expr) }
    }
    const [a, op, b] = expr
    const left = evaluate(a)
    const right = evaluate(b)
    if (left.val === null || right.val === null) return { val: null, steps: [], label: '' }
    const val = applyOp(left.val, right.val, op)
    if (val === null) return { val: null, steps: [], label: '' }

    // Normalize commutative operations to filter duplicates
    let stepKey
    if (op === '+' || op === '*') {
      const pair = [left.label, right.label].sort().join(op)
      stepKey = pair
    } else {
      stepKey = `${left.label}${op}${right.label}`
    }

    if (val < 0 || !Number.isInteger(val)) return { val: null, steps: [], label: '' }
const stepDisplay = `${left.label} ${sym(op)} ${right.label} = ${val}`
    return {
      val,
      steps: [...left.steps, ...right.steps, { display: stepDisplay, key: stepKey }],
      label: String(val)
    }
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

  const seen = new Set()

  for (const perm of permutations(nums)) {
    for (const tree of buildTrees(perm)) {
      const { val, steps } = evaluate(tree)
      if (val !== null && Math.abs(val - 24) < 1e-9) {
        const key = steps.map(s => s.key).join('|')
        if (!seen.has(key)) {
          seen.add(key)
          results.push({
            steps: steps.map(s => s.display),
            complexity: steps.length
          })
        }
      }
    }
  }

  return results
    .sort((a, b) => a.complexity - b.complexity)
    .slice(0, 10)
}

export default function Results({ numbers, onBack }) {
  const solutions = solve24(numbers)

  return (
    <div className="screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1>Results</h1>
      <div className="card-display">
        {numbers.map((n, i) => (
          <div key={i} className="number-badge">{n}</div>
        ))}
      </div>
      {solutions.length === 0 ? (
        <div className="no-solution">
          <p>😔 No solution exists for these numbers.</p>
        </div>
      ) : (
        <>
          <p className="solution-count">
            {solutions.length} solution{solutions.length > 1 ? 's' : ''} found
          </p>
          <div className="solutions-list">
            {solutions.map((sol, i) => (
              <div key={i} className="solution-item">
                <div className="solution-flow">
                  {sol.steps.map((step, j) => (
                    <span key={j} className="solution-flow-step">
                      <span className="step-expr">{step}</span>
                      {j < sol.steps.length - 1 && (
                        <span className="step-arrow"> → </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}