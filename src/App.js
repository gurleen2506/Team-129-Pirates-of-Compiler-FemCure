import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Link to the CSS file for styles

function App() {
  const [input, setInput] = useState(""); // State to hold the user input
  const [messages, setMessages] = useState([]); // State to hold the messages
  const [loading, setLoading] = useState(false); // Loading state to show when data is being fetched

  // Function to handle sending the request
  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const newMessage = { role: "user", content: input }; // Create the new message

    // Update the message array with the user's message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput(""); // Clear input field after sending message

    setLoading(true); // Set loading state to true

    try {
      // Send only the current message (not including the entire previous message history)
      const response = await axios.post(
        "https://chatgpt-42.p.rapidapi.com/gpt4", // API endpoint
        {
          messages: [newMessage], // Send only the current message
          web_access: false,
        },
        {
          headers: {
            "x-rapidapi-key": "6ae6c279ecmsh1aaccd21ed7fc67p104f29jsn37ebb2aa65c7", // Replace with your API key
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response.data); // Log the response data

      // Format the response by splitting at line breaks
      const formattedResponse = response.data.result
        .split("\n")
        .map((line, index) => (
          <p key={index} className="response-line">
            {line}
          </p>
        ));

      // Update the state with the assistant's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: formattedResponse },
      ]);
    } catch (error) {
      console.error("Error:", error); // Log any error that occurs
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error: Unable to fetch response." },
      ]);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="header">
          <h1>TechGyan</h1>
          <p>Ask anything about tech...</p>
        </div>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={msg.role}>
              <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
              <div className="message-content">
                {msg.role === "assistant"
                  ? msg.content
                  : msg.content.split("\n").map((line, idx) => (
                      <p key={idx} className="response-line">
                        {line}
                      </p>
                    ))}
              </div>
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
