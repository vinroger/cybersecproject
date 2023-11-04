// pages/api/project.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const projectId = "myprojectididididididid"; // Hardcoded project ID
  const client = await clientPromise;
  const db = client.db("llmdetection");
  const collection = db.collection("projects");

  if (req.method === "GET") {
    try {
      const project = await collection.findOne({ id: projectId });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else if (req.method === "POST") {
    try {
      // For simplicity, we're assuming the body of the request is the events array
      // In production, you'd want to validate this data
      const { events } = req.body;
      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ message: "Invalid events array" });
      }

      const result = await collection.updateOne(
        { id: projectId },
        { $set: { events } }
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as any).message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
