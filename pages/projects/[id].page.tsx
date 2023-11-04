import React, { use, useEffect, useState } from "react";
import { Flex, Input, Spin, Typography } from "antd";
import axios from "axios";
import TopLayout from "@/components/TopLayout";
import EventDetector from "./eventdetector.page";
import { useRouter } from "next/router";

const { TextArea } = Input;

function TextContainer({
  onChange,
  textState,
}: {
  onChange: any;
  textState: string;
}) {
  return (
    <div className="min-w-full flex items-center justify-center">
      <TextArea
        className="w-1/2"
        showCount
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start Edit here"
        value={textState}
      />
    </div>
  );
}

function Index() {
  const [projectEvents, setProjectEvents] = useState<any>([]);
  const [textState, setTextState] = useState("Start editing me here!!!");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { id: projectId } = router.query;

  const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        console.log(
          "%cindex.page.tsx line:57 response.data.events",
          "color: #007acc;",
          response.data.events[response.data.events.length - 1]
        );
        setProjectEvents(response.data.events || []);
        setTextState(response.data.textState || "Start editing me here!!!");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    console.log(
      "%cindex.page.tsx line:48 projectEvents",
      "color: #007acc;",
      projectEvents
    );
    setIsSaving(true);
    // Clear the previous timer if the projectEvents change
    if (updateTimer) {
      clearTimeout(updateTimer);
    }

    // Set a new timer
    const timer = setTimeout(() => {
      // Function to call the API and update the database
      const updateDatabase = async () => {
        try {
          const response = await axios.post(`/api/projects/${projectId}`, {
            events: projectEvents,
            textState,
          });
          console.log("Database updated!", response.data);
          setIsSaving(false);
        } catch (error) {
          console.error("Failed to update database:", error);
        }
      };

      // Call the update function
      updateDatabase();
    }, 2000); // Wait for 5 seconds

    // Save the timer so it can be cleared if projectEvents changes again
    setUpdateTimer(timer);

    // Clear the timer on component unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [projectEvents]); // Only re-run the effect if projectEvents changes

  return (
    <TopLayout>
      <div className="absolute right-10">
        {isSaving ? (
          <p>
            <Spin className="mr-2" />
            Saving...
          </p>
        ) : (
          <p>Changes saved!</p>
        )}
      </div>
      <TextContainer onChange={setTextState} textState={textState} />
      <EventDetector
        textState={textState}
        setProjectEvents={setProjectEvents}
      />
    </TopLayout>
  );
}

export default Index;
