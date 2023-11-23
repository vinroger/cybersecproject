/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Spin } from "antd";
import { useRouter } from "next/router";
import { DeleteFilled } from "@ant-design/icons";
import TopLayout from "@/components/TopLayout";

const ProjectPage = () => {
  const [projects, setProjects] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Fetch projects on component mount
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  // Show modal to create new project
  const showCreateProjectModal = () => {
    setIsModalVisible(true);
  };

  // Handle input change for new project title
  const handleTitleChange = (event: any) => {
    setNewProjectTitle(event.target.value);
  };

  // Handle creating a new project
  const handleCreateProject = () => {
    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newProjectTitle }),
    })
      .then((response) => response.json())
      .then((newProject) => {
        setProjects([...projects, newProject]);
        setIsModalVisible(false);
        setNewProjectTitle("");
      })
      .catch((error) => console.error("Error creating project:", error));
  };

  const handleDelete = (projectId: string) => {
    fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the project from the local state to update UI
        setProjects(
          projects.filter((project: any) => project._id !== projectId)
        );
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

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

  return (
    <TopLayout>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px",
        }}
      >
        {projects.map((project: any) => (
          <Card
            className="cursor-pointer hover:border-blue-500 flex"
            bodyStyle={{ minWidth: "100%" }}
            key={project._id}
            style={{ width: 300 }}
            onClick={() => {
              router.push(`/analysis/${project._id}`);
            }}
          >
            <div className="flex flex-row justify-between min-w-full">
              {project.title}
              <DeleteFilled
                className="text-red-500 hover:bg-red-600 p-1 hover:text-white rounded-full right-0 cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project._id);
                }}
              />
            </div>
          </Card>
        ))}
        <Card
          style={{ width: 300, borderStyle: "dashed" }}
          onClick={showCreateProjectModal}
        >
          <Button type="dashed">Create New Project</Button>
        </Card>
      </div>

      <Modal
        title="Create New Project"
        open={isModalVisible}
        onOk={handleCreateProject}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Project Title"
          value={newProjectTitle}
          onChange={handleTitleChange}
        />
      </Modal>
    </TopLayout>
  );
};

export default ProjectPage;
