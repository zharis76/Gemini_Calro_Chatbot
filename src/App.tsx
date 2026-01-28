import React, { useState } from 'react'
import './App.css'
import { getGeminiResponse } from './utils/gemini'


function App() {
  const [text,setText]=useState(``);
  const[response,setResponse]=useState(``);
  const[loading,setLoading]=useState(false);

  const handleButtonClick = async() => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await getGeminiResponse(text);
      setResponse(res || '');
    } catch (err) {
      console.error(err);
      setResponse('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="response-box">{loading ? "Loading the response..." : response}</div>
      <div className="input-container">
        <textarea
          className="query-input"
          placeholder="Type your query here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        ></textarea>
        <button onClick={handleButtonClick} disabled={loading}>Submit</button>
      </div>
      </div>
  )
}

export default App

