import TopLayout from "@/components/TopLayout";
import React from "react";

function About() {
  return (
    <TopLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-4">About Project Alpha Detect</h1>

        <p>
          In the ever-evolving landscape of academia, where the lines between
          technology-assisted research and plagiarism blur, Project Alpha Detect
          emerges as a groundbreaking solution. As AI and large language models
          (LLMs) like ChatGPT become more prevalent, traditional plagiarism
          detection tools often fail to identify content generated by these
          advanced algorithms. This gap in detection is where Project Alpha
          Detect steps in – a cutting-edge platform designed to discern between
          human-generated content and AI-produced text.
        </p>

        <p>
          Developed with educators and students in mind, Project Alpha Detect is
          a web-based text editor platform that meticulously records keystrokes
          and captures metadata. This data, including browser information and
          interaction patterns, is securely transmitted, encrypted, and
          timestamped to our server for a comprehensive analysis. By employing a
          sophisticated machine learning model, the platform can efficiently
          differentiate between text written by a human and that generated by AI
          tools, ensuring academic integrity in the process.
        </p>

        <p>
          Our unique approach involves a combination of technical strategies and
          features. We utilize the React and Next.js frameworks to craft a
          user-friendly web-based text editor that supports a document playback
          feature. This playback functionality allows a detailed review of how a
          document was created, providing invaluable insights into the writing
          process. Only interactions within the text editor are recorded,
          maintaining user privacy and focusing on the content generation
          process.
        </p>

        <p>
          To further empower our solution, we integrate machine learning,
          developing a supervised learning model specifically trained to
          recognize the nuances that differentiate AI-generated content from
          human writing. This integration provides an automatic and efficient
          way to scrutinize academic submissions for authenticity.
        </p>

        <p>
          The evidence of demand for such a tool is clear. Our discussions with
          educators and surveys among students have highlighted a significant
          concern regarding the use of AI tools in academic settings. With the
          increasing use of AI for homework, essay writing, and even during
          tests, the need for a reliable system to verify the originality of
          academic work has never been more urgent.
        </p>

        <p>
          As we progress with Project Alpha Detect, our focus remains steadfast
          on delivering a comprehensive, secure, and user-friendly solution to
          uphold academic integrity in this new age of AI-generated content. We
          are committed to continually refining our approach, ensuring it
          remains at the forefront of technological and educational
          advancements.
        </p>

        <p>
          For educators and students, Project Alpha Detect promises to be an
          invaluable ally in the quest for authenticity and integrity in
          academic work. It's not just a tool; it's a commitment to preserving
          the essence of original thought and research in the educational
          landscape transformed by artificial intelligence.
        </p>

        <h1 className="text-xl font-bold mb-4 mt-5">Acknowledgements</h1>

        <p>
          We owe a heartfelt thank you to <strong>Professor Simon Oya </strong>
          for his guidance in our Introduction to Cybersecurity course (CPEN
          442) at UBC. His practical advice and personal anecdotes have not only
          enriched our learning but also directly inspired many aspects of
          Project Alpha Detect. Prof. Oya’s approachable teaching style and
          genuine interest in our success turned complex cybersecurity concepts
          into lessons we looked forward to. His mentorship went beyond the
          classroom, often sparking ideas that helped shape this project. It's
          rare and rewarding to find an educator who invests so personally in
          their students’ journeys.
        </p>
        <p>
          From the bottom of our hearts, Thank you, Prof. Simon Oya, for being
          that mentor for us. 🥳
        </p>
      </div>
    </TopLayout>
  );
}

export default About;
