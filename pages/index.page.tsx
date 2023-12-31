import { useRouter } from "next/router";
import { useEffect } from "react";
import TopLayout from "@/components/TopLayout";

export default function Home(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push("/projects");
  }, [router]);

  return (
    <TopLayout>
      <div className="font-bold">
        Welcome to Project AlphaDetect - LLM Detection!
      </div>
    </TopLayout>
  );
}
