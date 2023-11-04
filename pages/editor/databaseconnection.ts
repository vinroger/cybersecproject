import axios from "axios";

// Function to get the project data
// eslint-disable-next-line consistent-return
const getProjectData = async () => {
  try {
    const response = await axios.get("/api/project");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the project data:", error);
  }
};

// Function to update the project data
// eslint-disable-next-line consistent-return
const updateProjectData = async (events: any[]) => {
  try {
    const response = await axios.post("/api/project", { events });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error updating the project data:", error);
  }
};

export { getProjectData, updateProjectData };
