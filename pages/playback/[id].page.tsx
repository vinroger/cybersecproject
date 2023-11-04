import React, { useEffect, useState } from "react";
import { Flex, Input, Slider, Spin, Tooltip, Typography } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import TopLayout from "@/components/TopLayout";

function TextContainer({ textState }: { textState: string }) {
  const containerStyle = {
    maxWidth: "600px", // ch units base the width on the width of the zero character, closely approximating the average character width for the font.
    lineHeight: "1.6", // Optimal line height for readability
    padding: "1rem", // Padding inside the container
    margin: "auto", // Center the container
    border: "1px solid #ddd", // Just to show the container's bounds, can be removed
    borderRadius: "8px", // Optional border radius for aesthetics
    minWidth: "600px",
  };
  return (
    <div
      className="editable mx-auto p-4 max-w-[60ch] border border-gray-300 rounded-lg leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
      style={containerStyle}
    >
      {textState}
    </div>
  );
}

// const clickMarkerStyle = {
//   position: "absolute",
//   width: "10px",
//   height: "10px",
//   backgroundColor: "red",
//   borderRadius: "50%",
//   transform: "translate(-50%, -50%)", // Center the dot on the click position
// };

const clickMarkerStyle: React.CSSProperties = {
  position: "absolute",
  width: "15px",
  height: "15px",
  backgroundColor: "red",
  borderRadius: "50%",
  transform: "translate(-50%, -50%)", // Center the dot on the click position
};

function Index() {
  const [projectEvents, setProjectEvents] = useState<any>([]);
  const [textState, setTextState] = useState("Start editing me here!!!");

  const router = useRouter();
  const { id: projectId } = router.query;

  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [currentEvent, setCurrentEvent] = useState<string>("");
  const [mousePosition, setMousePosition] = useState<any>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        setProjectEvents(response.data.events || []);
        setTextState(response.data.textState || "Start editing me here!!!");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Handler for when the slider changes
  const onSliderChange = (value: number) => {
    setCurrentEventIndex(value);
    const event = projectEvents[value];
    if (event) {
      setTextState(event.textState);
      updateClickPosition(event);
      setCurrentEvent(event.event);
      setMousePosition(event.mousePosition);
    }
  };

  const updateClickPosition = (event: any) => {
    if (event.type === "mouse" && event.mousePosition) {
      setClickPosition({ x: event.mousePosition.x, y: event.mousePosition.y });
    } else {
      setClickPosition(null);
    }
  };

  return (
    <TopLayout>
      <TextContainer textState={textState} />
      {clickPosition && (
        <Tooltip
          title={`Click happened here, X: ${clickPosition.x}, Y: ${clickPosition.y}, at ${projectEvents[currentEventIndex]?.timestamp}`}
          placement="top"
        >
          <div
            className="animate-ping cursor-help"
            style={{
              ...clickMarkerStyle,
              left: `${clickPosition.x}px`,
              top: `${clickPosition.y}px`,
            }}
          />
        </Tooltip>
      )}
      <div
        className="bg-white absolute bottom-10 p-5"
        style={{ width: "calc(100vw - 150px)" }}
      >
        <Typography.Title level={3}>Navigator</Typography.Title>
        <Slider
          className="mt-10 "
          min={0}
          max={projectEvents.length - 1}
          value={currentEventIndex}
          onChange={onSliderChange}
          //   marks={projectEvents.reduce((acc, _, index) => {
          //     return { ...acc, [index]: index.toString() };
          //   }, {})}
          step={1}
          tooltip={{
            formatter: (index) => projectEvents[index]?.timestamp,
            draggableTrack: true,
          }}
        />
        <Typography.Text>
          Timestamp: {projectEvents[currentEventIndex]?.timestamp}
        </Typography.Text>
      </div>
      {currentEvent && (
        <div className="absolute z-50 right-20 bg-gray-700 p-4 border border-gray-300 shadow-lg rounded w-36 text-center text-white mb-10">
          <p>
            Mouse Position: {mousePosition.x}, {mousePosition.y}
          </p>
          <p>{currentEvent}</p>
        </div>
      )}
    </TopLayout>
  );
}

export default Index;
