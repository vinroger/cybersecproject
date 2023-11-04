/* eslint-disable no-else-return */
import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, Input, Slider, Spin, Tooltip, Typography } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import TopLayout from "@/components/TopLayout";
import { PauseOutlined, PlayCircleOutlined } from "@ant-design/icons";

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

  // For play and pause stuff
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

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

  const play = () => {
    if (currentEventIndex < projectEvents.length - 1 && !isPlaying) {
      setIsPlaying(true);
      playbackIntervalRef.current = setInterval(
        () => {
          setCurrentEventIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < projectEvents.length) {
              updateStateForEvent(nextIndex);
              return nextIndex;
            } else {
              clearInterval(playbackIntervalRef.current as NodeJS.Timeout);
              setIsPlaying(false);
              return prevIndex;
            }
          });
        },
        calculateInterval(currentEventIndex) / playbackSpeed
      );
    }
  };

  const pause = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setIsPlaying(false);
  };

  // New function to handle speed change
  const changeSpeed = () => {
    setPlaybackSpeed((prevSpeed) => {
      // Cycle through 1x, 1.5x, and 2x speeds
      const newSpeed = prevSpeed >= 2 ? 1 : prevSpeed + 0.5;
      if (isPlaying) {
        // Restart the interval with the new speed
        clearInterval(playbackIntervalRef.current as NodeJS.Timeout);
        playbackIntervalRef.current = setInterval(
          () => {
            setCurrentEventIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              if (nextIndex < projectEvents.length) {
                updateStateForEvent(nextIndex);
                return nextIndex;
              } else {
                clearInterval(playbackIntervalRef.current as NodeJS.Timeout);
                setIsPlaying(false);
                return prevIndex;
              }
            });
          },
          calculateInterval(currentEventIndex) / newSpeed
        );
      }
      return newSpeed;
    });
  };

  const calculateInterval = (index: number) => {
    if (index < projectEvents.length - 1) {
      const currentEventTimestamp = new Date(
        projectEvents[index].timestamp
      ).getTime();
      const nextEventTimestamp = new Date(
        projectEvents[index + 1].timestamp
      ).getTime();
      return nextEventTimestamp - currentEventTimestamp;
    }
    return 1000; // Default to 1 second if no more events
  };

  const updateStateForEvent = (index: number) => {
    const event = projectEvents[index];
    if (event) {
      setTextState(event.textState);
      updateClickPosition(event);
      setCurrentEvent(event.event);
      setMousePosition(event.mousePosition);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

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
        className="bg-white absolute bottom-10 p-5 rounded-lg"
        style={{ width: "calc(100vw - 150px)" }}
      >
        <Typography.Title className="mt-0" level={3}>
          Navigator
        </Typography.Title>
        <div className="controls">
          <Button
            onClick={isPlaying ? pause : play}
            icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={changeSpeed}>{playbackSpeed}x</Button>
        </div>
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
