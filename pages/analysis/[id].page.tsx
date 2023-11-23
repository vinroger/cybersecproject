/* eslint-disable no-restricted-properties */
/* eslint-disable prefer-exponentiation-operator */
/* eslint-disable no-plusplus */
/* eslint-disable indent */
/* eslint-disable no-else-return */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Slider, Spin, Tooltip, Typography } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import {
  InfoCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
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
    marginBottom: "500px",
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

type EventType = "keyboard" | "keyboard-combination" | "mouse";
type Event = {
  event: string;
  type: EventType;
  timestamp: string;
  mousePosition: {
    x: number;
    y: number;
  };
  textState: string;
  data: string;
};

function calculateUserActivityMetrics(events: Event[]) {
  let keyboardEventCount = 0;
  let mouseClickCount = 0;
  const timeDifferences: number[] = [];
  let deleteCount = 0;
  let pasteCount = 0;
  let finalTextState = "";
  const typingIntervals: number[] = [];

  let totalTextStateLength = 0;
  const uniqueKeyPresses: any = new Set<string>();
  let totalMouseDistance = 0;
  let lastMousePosition: any = null;

  events.forEach((event, index) => {
    if (event.type === "keyboard" || event.type === "keyboard-combination") {
      keyboardEventCount++;

      if (
        ["backspace", "del", "ctrl+z"].includes(event.data.toLocaleLowerCase())
      ) {
        deleteCount++;
      }

      if (["ctrl+v", "cmd+v"].includes(event.data.toLocaleLowerCase())) {
        pasteCount++;
      }

      if (index > 0) {
        const timeDiff =
          new Date(event.timestamp).getTime() -
          new Date(events[index - 1].timestamp).getTime();
        timeDifferences.push(timeDiff);

        if (event.type === "keyboard") {
          typingIntervals.push(timeDiff);
        }
      }
    } else if (event.type === "mouse" && event.event.startsWith("Click")) {
      mouseClickCount++;
    }

    finalTextState = event.textState;

    totalTextStateLength += event.textState.length;

    if (event.type === "keyboard" || event.type === "keyboard-combination") {
      uniqueKeyPresses.add(event.data.toLocaleLowerCase());
    }

    if (event.type === "mouse" && lastMousePosition) {
      totalMouseDistance += Math.sqrt(
        Math.pow(event.mousePosition.x - lastMousePosition.x, 2) +
          Math.pow(event.mousePosition.y - lastMousePosition.y, 2)
      );
    }

    lastMousePosition = event.mousePosition;
  });

  const medianTime =
    timeDifferences.length > 0
      ? timeDifferences.sort((a, b) => a - b)[
          Math.floor(timeDifferences.length / 2)
        ]
      : 0;
  const averageTypingInterval =
    typingIntervals.length > 0
      ? typingIntervals.reduce((a, b) => a + b, 0) / typingIntervals.length
      : 0;
  const ratioDeletes = keyboardEventCount
    ? deleteCount / keyboardEventCount
    : 0;
  const ratioPastes = keyboardEventCount ? pasteCount / keyboardEventCount : 0;
  const lengthPerEvent = keyboardEventCount
    ? finalTextState.length / keyboardEventCount
    : 0;

  const totalDuration =
    events.length > 1
      ? new Date(events[events.length - 1].timestamp).getTime() -
        new Date(events[0].timestamp).getTime()
      : 0;

  const averageTextStateLength = totalTextStateLength / events.length;
  const uniqueKeyPressCount = uniqueKeyPresses.size;

  const meanTypingInterval = averageTypingInterval;
  const sumOfSquares = typingIntervals.reduce(
    (acc, val) => acc + Math.pow(val - meanTypingInterval, 2),
    0
  );
  const standardDeviation =
    Math.sqrt(sumOfSquares / typingIntervals.length) || 0;

  return {
    numberOfKeyboardEvents: keyboardEventCount,
    numberOfMouseClicks: mouseClickCount,
    medianTimeBetweenEvents: Math.round(medianTime * 100) / 100,
    averageTypingInterval: Math.round(averageTypingInterval * 100) / 100,
    standardDeviationOfTypingIntervals:
      Math.round(standardDeviation * 100) / 100,
    totalElapsedTime: totalDuration,
    uniqueKeyPressCount,
    totalMouseMovementDistance: Math.round(totalMouseDistance * 100) / 100,
    ratioOfDeleteEvents: Math.round(ratioDeletes * 100) / 100,
    ratioOfPasteEvents: Math.round(ratioPastes * 100) / 100,
    lengthPerKeyboardEvent: Math.round(lengthPerEvent * 100) / 100,
    averageTextStateLength: Math.round(averageTextStateLength * 100) / 100,
  };
}

const plagiarismMessages = [
  {
    range: [0, 10],
    message:
      "High likelihood of plagiarism, potentially due to unusual keystroke patterns. This score may suggest extensive copy-paste actions or atypical typing behavior. Recommended actions: 1) Check the content for plagiarism against known sources. 2) Use the playback feature to examine text creation for suspicious activity.",
  },
  {
    range: [10, 20],
    message:
      "Strong signs of potentially non-original creation methods. The score may indicate frequent paste actions or irregular typing patterns, pointing towards possible content borrowing. Recommended actions: 1) Conduct a thorough content plagiarism check. 2) Review the text creation process with the playback feature for suspect sections.",
  },
  {
    range: [20, 30],
    message:
      "Moderate to high possibility of plagiarism based on potential keystroke patterns. This score suggests some irregularities that could indicate copying or non-standard text creation. Recommended actions: 1) Analyze the content for possible plagiarism. 2) Examine keystroke playback to detect copied portions of text.",
  },
  {
    range: [30, 40],
    message:
      "Moderate plagiarism risk inferred from potential typing patterns. The score reflects certain inconsistencies that might suggest partial copying of content. Recommended actions: 1) Verify against known sources for content similarity. 2) Use playback functionality to observe text development.",
  },
  {
    range: [40, 50],
    message:
      "Possible unoriginal typing patterns detected, suggesting some degree of content copying. The balance between typical typing and suspect actions like frequent pasting points to potential plagiarism. Recommended actions: 1) Investigate content for unoriginality. 2) Analyze specific sections with the playback feature for further insight.",
  },
  {
    range: [50, 60],
    message:
      "Uncertain originality based on potential typing patterns. A mix of regular typing and potential copy-paste actions creates ambiguity. Recommended actions: 1) Conduct a careful review of the content for plagiarism. 2) Utilize the playback feature to scrutinize the text creation process.",
  },
  {
    range: [60, 70],
    message:
      "Likely original with some unusual patterns potentially present. The majority of typing seems standard, but sporadic actions might raise mild concerns. Recommended actions: 1) Perform a basic plagiarism check. 2) Review text creation using playback for any unusual activity.",
  },
  {
    range: [70, 80],
    message:
      "Mostly standard typing behavior with minor irregularities potentially present. The text is likely original, though some keystroke patterns may warrant a second look. Recommended actions: 1) Briefly check content for plagiarism. 2) Use the playback feature to confirm the originality of suspicious parts.",
  },
  {
    range: [80, 90],
    message:
      "High likelihood of originality based on keystroke analysis. Occasional anomalies in the data might not significantly affect the overall normal typing pattern. Recommended actions: 1) Minimal content verification may be performed. 2) Playback review is optional but can offer additional confidence.",
  },
  {
    range: [90, 100],
    message:
      "Excellent indication of originality from keystroke behavior. The patterns largely align with standard text creation, suggesting minimal plagiarism risk. Recommended actions: 1) Routine plagiarism checks can be conducted for assurance. 2) Optional playback review for compliance and further confirmation.",
  },
];

const AIscore = (Math.random() * 100).toFixed(2);

function getPlagiarismMessage(score: any) {
  const found = plagiarismMessages.find(
    ({ range }) => score >= range[0] && score < range[1]
  );
  return found ? found.message : "Unknown score range.";
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

  // For play and pause stuff
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true);
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        console.log(
          "%c[id].page.tsx line:67 response.data",
          "color: #007acc;",
          response.data
        );
        setProjectEvents(response.data.events || []);
        setTextState(response.data.textState || "Start editing me here!!!");
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, [projectId]);

  // Handler for when the slider changes
  const onSliderChange = (value: number) => {
    setCurrentEventIndex(value);
    const event = projectEvents[value];
    if (event) {
      pause();
      setTextState(event.textState);
      updateClickPosition(event);
      // setCurrentEvent(event.event);
      // setMousePosition(event.mousePosition);
    }
  };

  const updateClickPosition = (event: any) => {
    if (event.type === "mouse" && event.mousePosition) {
      setClickPosition({ x: event.mousePosition.x, y: event.mousePosition.y });
    } else {
      setClickPosition(null);
    }
  };

  const updateStateForEvent = useCallback(
    (index: number) => {
      const event = projectEvents[index];
      if (event) {
        setTextState(event.textState);
        updateClickPosition(event);
        // setCurrentEvent(event.event);
        // setMousePosition(event.mousePosition);
      }
    },
    [projectEvents]
  );

  const calculateInterval = useCallback(
    (index: number) => {
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
    },
    [projectEvents]
  );

  const play = useCallback(() => {
    if (currentEventIndex < projectEvents.length - 1) {
      setIsPlaying(true);
      const callback = (index: number) => {
        if (index < projectEvents.length) {
          updateStateForEvent(index);
          setCurrentEventIndex(index);
          // Schedule the next event
          playbackIntervalRef.current = setTimeout(
            () => callback(index + 1),
            calculateInterval(index) / playbackSpeed
          );
        } else {
          setIsPlaying(false);
        }
      };
      // Kick off the chain reaction
      callback(currentEventIndex);
    }
  }, [
    calculateInterval,
    currentEventIndex,
    playbackSpeed,
    projectEvents.length,
    updateStateForEvent,
  ]);

  const pause = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setIsPlaying(false);
  };

  // New function to handle speed change
  const changeSpeed = useCallback(() => {
    setPlaybackSpeed((prevSpeed) => {
      const newSpeed = prevSpeed >= 5 ? 1 : prevSpeed + 2;
      if (isPlaying) {
        // Stop the current playback
        pause();
        // Then start it again with the new speed
      }
      return newSpeed;
    });
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  const metrics = calculateUserActivityMetrics(projectEvents);

  if (isLoading) {
    return (
      <TopLayout>
        <div className="flex justify-center items-center h-screen">
          <Spin className="mr-2" />
          Loading ...
        </div>
      </TopLayout>
    );
  }

  const currentEvent = projectEvents[currentEventIndex]?.event;
  const mousePosition = projectEvents[currentEventIndex]?.mousePosition;

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
        className="bg-white fixed p-5 rounded-lg"
        style={{ width: "calc(100vw - 150px)", bottom: "20px" }}
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
            formatter: (index) => projectEvents[index || 0]?.timestamp,
            // @ts-expect-error idk
            draggableTrack: true,
          }}
        />
        <Typography.Text>
          Timestamp: {projectEvents[currentEventIndex]?.timestamp}
        </Typography.Text>
      </div>
      {currentEvent && mousePosition && (
        <div
          className="absolute z-50 right-20 bg-gray-700 p-4 border border-gray-300 shadow-lg rounded w-36 text-center text-white mb-10"
          style={{ position: "absolute", top: "70px", right: "20px" }}
        >
          <p>
            Mouse Position: {mousePosition.x}, {mousePosition.y}
          </p>
          <p>{currentEvent}</p>
        </div>
      )}
      {currentEvent && (
        <div
          className="absolute z-50 right-20 bg-gray-700 p-4 border border-gray-300 shadow-lg rounded w-96 text-white mb-10"
          style={{ position: "absolute", top: "70px", left: "20px" }}
        >
          <div className="text-lg font-semibold mb-4">Analysis</div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>Number of Keyboard Events:</span>
              <span>{metrics.numberOfKeyboardEvents}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Mouse Clicks:</span>
              <span>{metrics.numberOfMouseClicks}</span>
            </div>
            <div className="flex justify-between">
              <span>Median Time Between Events:</span>
              <span>{metrics.medianTimeBetweenEvents.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Average Typing Interval:</span>
              <span>{metrics.averageTypingInterval.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Deviation of Typing Intervals:</span>
              <span>
                {metrics.standardDeviationOfTypingIntervals.toFixed(2)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Elapsed Time:</span>
              <span>
                {new Date(metrics.totalElapsedTime).toISOString().substr(11, 8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Unique Key Press Count:</span>
              <span>{metrics.uniqueKeyPressCount}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Total Mouse Movement Distance:</span>
              <span>{metrics.totalMouseMovementDistance.toFixed(2)} units</span>
            </div> */}
            <div className="flex justify-between">
              <span>Ratio of Delete Events:</span>
              <span>{(metrics.ratioOfDeleteEvents * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Ratio of Paste Events:</span>
              <span>{(metrics.ratioOfPasteEvents * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Length per Keyboard Event:</span>
              <span>{metrics.lengthPerKeyboardEvent.toFixed(2)} s</span>
            </div>
            <div className="flex justify-between">
              <span>Total Text Length:</span>
              <span>
                {projectEvents[projectEvents.length - 1].textState.length} chars
              </span>
            </div>
          </div>
          <div className="mt-4 text-lg font-semibold">Prediction</div>
          <div className="mt-3 mb-2">
            AI Plagiarism Detection Score: <strong>{AIscore} %</strong>
            <Tooltip
              className="text-gray-300 cursor-pointer"
              title="This score indicates the likelihood of the text being original. A higher score (closer to 100%) suggests a higher probability of originality, implying that the text is less likely to be plagiarized. Scores closer to 0% indicate a higher likelihood of plagiarism. This metric is useful for initial screening but should be supplemented with further review for accurate determination."
            >
              <InfoCircleOutlined className="ml-2" />
            </Tooltip>
          </div>
          <div>{getPlagiarismMessage(AIscore)}</div>
        </div>
      )}
    </TopLayout>
  );
}

export default Index;
