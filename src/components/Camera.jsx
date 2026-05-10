import Webcam from "react-webcam"
import { useRef, useState } from "react"

export default function Camera({ onNumbers, onManual }) {
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState("environment")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  function toggleCamera() {
    setFacingMode(prev => prev === "environment" ? "user" : "environment")
  }

  async function handleScan() {
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) {
      setStatus("Could not capture image. Try again.")
      return
    }

    setLoading(true)
    setStatus("Scanning card...")

    try {
      const base64 = imageSrc.split(",")[1]
      const apiKey = import.meta.env.VITE_GEMINI_KEY

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "This is a Math 24 game card. It has exactly 4 numbers arranged in a circle. The numbers 6 and 9 look similar but are distinguished by colour — the number 9 has a red fill in its round space, while 6 does not. Return only a JSON array of the 4 numbers in clockwise order from the top, example: [3,8,6,2]. Nothing else." },
                { inlineData: { mimeType: "image/jpeg", data: base64 } }
              ]
            }]
          })
        }
      )

      const data = await response.json()

      if (data.error) {
        setStatus("API error: " + data.error.message)
        setLoading(false)
        return
      }

      const text = data.candidates[0].content.parts[0].text.trim()
      setStatus("Detected: " + text)

      const nums = JSON.parse(text)
      if (!Array.isArray(nums) || nums.length !== 4) {
        setStatus("Could not read 4 numbers. Try again.")
        setLoading(false)
        return
      }

      onNumbers(nums)

    } catch (err) {
      setStatus("Error: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="screen">
      <h1>Math 24 Solver</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="camera"
        videoConstraints={{ facingMode }}
      />
      <button onClick={toggleCamera}>
        {facingMode === "environment" ? "Switch to Front Camera" : "Switch to Back Camera"}
      </button>
      {status && (
        <p style={{ color: loading ? "#534AB7" : "red", textAlign: "center" }}>
          {status}
        </p>
      )}
      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan Card"}
      </button>
      <button onClick={onManual}>Enter Manually</button>
    </div>
  )
}