// pages/api/projects/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb"; // Import ObjectId for handling MongoDB's _id field
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
  const collection = db.collection("projects");

  if (req.method === "GET") {
    try {
      const project = await collection.findOne({
        _id: new ObjectId(id as string),
      }); // Use ObjectId for proper querying
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else if (req.method === "POST") {
    try {
      const { events, textState } = req.body;

      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ message: "Invalid events array" });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id as string) }, // Make sure to search by ObjectId
        { $set: { events, textState } },
        { upsert: true } // This creates a new document if one doesn't exist
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else if (req.method === "DELETE") {
    console.log("%c[id].page.tsx line:52 id", "color: #007acc;", id);
    try {
      const result = await collection.deleteOne({
        _id: new ObjectId(id as string),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      console.log("%c[id].page.tsx line:63 error", "color: #007acc;", error);
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
