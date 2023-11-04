// pages/api/projects/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const client = await clientPromise;
  const db = client.db("llmdetection");
  const collection = db.collection("projects");

  if (req.method === "GET") {
    try {
      const projects = await collection.find({}).toArray(); // Fetch all documents
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else if (req.method === "POST") {
    try {
      // Assuming the request body will have the 'title' field for the new project
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      // Insert a new project into the database
      const result = await collection.insertOne({ title });

      if (result.acknowledged) {
        const newProject = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(newProject);
      } else {
        throw new Error("Project creation failed");
      }
    } catch (error) {
      console.log("%cindex.page.tsx line:35 error", "color: #007acc;", error);
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
