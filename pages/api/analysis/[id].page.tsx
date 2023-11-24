/* eslint-disable consistent-return */
// pages/api/projects/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb"; // Import ObjectId for handling MongoDB's _id field
import axios from "axios";
import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { id },
  } = req; // Destructure the id from the query
  const client = await clientPromise;
  const db = client.db("llmdetection");
  const collection = db.collection("analysis");

  if (req.method === "GET") {
    try {
      console.log("%c[id].page.tsx line:21 id", "color: #007acc;", id);
      const project = await collection.findOne({
        project_id: id,
      }); // Use ObjectId for proper querying
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  }
  if (req.method === "POST") {
    try {
      // Define the request body
      const requestBody = {
        password: process.env.API_PASSWORD,
        project_id: id as string, // Cast id to string if it's not already
      };

      // Make a POST request to the external API with the requestBody
      const response = await axios.post(
        "https://apillmdetection.vinroger.com/analysis",
        requestBody
      );

      // Send the response back to the client
      res.status(200).json(response.data);
    } catch (error) {
      // Handle errors in the POST request
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
