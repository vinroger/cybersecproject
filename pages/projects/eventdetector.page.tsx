/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

const EventDetector = ({
  // eventCallback,
  textState,
  setProjectEvents,
}: {
  // eventCallback: (
  //   event: string,
  //   type: string,
  //   mousePosition: { x: number; y: number }
  // ) => void;
  textState: string;
  setProjectEvents: any;
}) => {
  const [eventInfo, setEventInfo] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const eventCallback = (
    event: string,
    type: string,
    textStateinput: string,
    mousePositionInput: { x: number; y: number },
    data: string
  ) => {
    setProjectEvents((prev: any) => [
      ...prev,
      {
        event,
        type,
        timestamp: new Date().toISOString(),
        mousePosition: mousePositionInput,
        textState: textStateinput,
        data,
      },
    ]);
  };
  // Function to handle keyboard events
  const handleKeyPress = (event: any) => {
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

    // Determine the type of the event based on the keys pressed
    const type = keysPressed.length > 1 ? "keyboard-combination" : "keyboard";

    eventCallback(info, type, textState, mousePosition, keysPressed.join("+"));

    // Prevent the default action to avoid interference with the normal behavior of the keys
    // event.preventDefault();
  };

  // Function to handle mouse click events
  const handleMouseClick = (event: any) => {
    const info = `Click (X:${event.clientX}, Y:${event.clientY})`;
    setEventInfo(info);
    setShowPopup(true);
    eventCallback(
      info,
      "mouse",
      textState,
      mousePosition,
      `${event.clientX};${event.clientY}`
    );
  };

  const handleMouseWheel = (event: any) => {
    const info = `Scroll: ${event.deltaY > 0 ? "Down" : "Up"}`;
    setEventInfo(info);
    setShowPopup(true);
    eventCallback(info, "mouse", textState, mousePosition, `${event.deltaY}`);
  };

  // Function to handle mouse move events
  const handleMouseMove = (event: any) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
    // const info = `Move (X:${event.clientX}, Y:${event.clientY})`;
    // eventCallback(info, "mouse");
  };

  useEffect(() => {
    // Adding event listeners when page renders
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleMouseClick);
    window.addEventListener("wheel", handleMouseWheel);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("wheel", handleMouseWheel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleKeyPress, handleMouseClick, handleMouseWheel]); // Empty array ensures effect only runs once

  return (
    <div className="absolute bottom-0 right-20 min-w-screen text-center">
      {/* Your other components go here */}

      {showPopup && (
        <div className="z-50 bg-gray-700 p-4 border border-gray-300 shadow-lg rounded w-36 text-center text-white mb-10">
          <p>
            Mouse Position: {mousePosition.x}, {mousePosition.y}
          </p>
          <p>{eventInfo}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetector;
