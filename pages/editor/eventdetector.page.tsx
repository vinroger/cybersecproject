import { Button } from "antd";
import React, { useState, useEffect } from "react";

const EventDetector = () => {
  const [eventInfo, setEventInfo] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle keyboard events
  const handleKeyPress = (event) => {
    // Array to hold the keys pressed
    const keysPressed: any = [];

    // Check and add the key modifiers
    if (event.ctrlKey) {
      keysPressed.push("Ctrl");
    }
    if (event.shiftKey) {
      keysPressed.push("Shift");
    }
    if (event.altKey) {
      keysPressed.push("Alt");
    }
    if (event.metaKey) {
      keysPressed.push("Cmd");
    }

    // Add the actual key presseda
    keysPressed.push(event.key.toUpperCase());

    // Join all keys pressed into a string
    const info = `Key: ${keysPressed.join(" + ")}`;
    setEventInfo(info);
    setShowPopup(true);

    // Prevent the default action to avoid interference with the normal behavior of the keys
    // event.preventDefault();
  };

  // Function to handle mouse click events
  const handleMouseClick = (event) => {
    const info = `Click (X:${event.clientX}, Y:${event.clientY})`;
    setEventInfo(info);
    setShowPopup(true);
  };

  useEffect(() => {
    // Adding event listeners when component mounts
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleMouseClick);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []); // Empty array ensures effect only runs once

  return (
    <div className="absolute bottom-0 right-20 min-w-screen text-center">
      {/* Your other components go here */}

      {showPopup && (
        <div className="z-50 bg-gray-700 p-4 border border-gray-300 shadow-lg rounded w-36 text-center text-white mb-10">
          <p>{eventInfo}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetector;
