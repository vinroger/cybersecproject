import axios from "axios";

// Function to get the project data
// eslint-disable-next-line consistent-return
const getProjectData = async (projectId: string) => {
  try {
    const response = await axios.get(`/api/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the project data:", error);
  }
};

// Function to update the project data
// eslint-disable-next-line consistent-return
const updateProjectData = async (events: any[], projectId: string) => {
  try {
    const response = await axios.post(`/api/projects/${projectId}`, { events });
    return response.data;
  } catch (error) {
    console.error("There was an error updating the project data:", error);
  }
};

export { getProjectData, updateProjectData };
