import React from "react";
import TopLayout from "@/components/TopLayout";
import EventDetector from "./eventdetector.page";

function TextContainer({ text, onChange }: { text: string; onChange: any }) {
  // Inline CSS styles for the container
  const containerStyle = {
    maxWidth: "600px", // ch units base the width on the width of the zero character, closely approximating the average character width for the font.
    lineHeight: "1.6", // Optimal line height for readability
    padding: "1rem", // Padding inside the container
    margin: "auto", // Center the container
    border: "1px solid #ddd", // Just to show the container's bounds, can be removed
    borderRadius: "8px", // Optional border radius for aesthetics
    minWidth: "600px",
  };

  const handleContentChange = (e: any) => {
    onChange(e.target.innerHTML);
  };

  return (
    <div
      contentEditable
      onInput={handleContentChange}
      suppressContentEditableWarning={true}
      className="editable mx-auto p-4 max-w-[60ch] border border-gray-300 rounded-lg leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
      style={containerStyle}
    >
      {text}
    </div>
  );
}

function index() {
  return (
    <TopLayout>
      {/* <div>Test</div> */}
      <TextContainer
        text="This is a test"
        onChange={(e) => {
          console.log(e);
        }}
      />
      <EventDetector />
    </TopLayout>
  );
}

export default index;
