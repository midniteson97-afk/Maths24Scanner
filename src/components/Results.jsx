function solve24(nums) {
  const ops = ['+', '-', '*', '/']
  const results = new Set()

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
    if (typeof expr === 'number') return { val: expr, str: String(expr) }
    const [a, op, b] = expr
    const left = evaluate(a)
    const right = evaluate(b)
    if (left.val === null || right.val === null) return { val: null, str: '' }
    const val = applyOp(left.val, right.val, op)
    const str = `(${left.str} ${sym(op)} ${right.str})`
    return { val, str }
  }

  function buildTrees(nums) {
    if (nums.length === 1) return nums.map(n => n)
    const trees = []
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue
        const rest = nums.filter((_, k) => k !== i && k !== j)
        for (const op of ops) {
          for (const subtree of buildTrees([...rest, [nums[i], op, nums[j]]])) {
            trees.push(subtree)
          }
        }
      }
    }
    return trees
  }

  for (const perm of permutations(nums)) {
    for (const tree of buildTrees(perm)) {
      const { val, str } = evaluate(tree)
      if (val !== null && Math.abs(val - 24) < 1e-9) {
        results.add(str)
      }
    }
  }

  return [...results]
}

export default function Results({ numbers, onBack }) {
  const solutions = solve24(numbers)

  return (
    <div className="screen">
      <button onClick={onBack}>← Back</button>
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
          <p className="solution-count">{solutions.length} solution{solutions.length > 1 ? 's' : ''} found</p>
          <div className="solutions-list">
            {solutions.map((s, i) => (
              <div key={i} className="solution-item">
                <span>{s}</span>
                <span className="equals">= 24</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}