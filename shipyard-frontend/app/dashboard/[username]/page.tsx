"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { ReposList } from "@/components/repos-list";
import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchAccessToken() {
      if (!session?.user?.email) {
        setLoadingToken(false);
        return;
      }

      try {
        const response = await fetch(`/api/access-token?email=${encodeURIComponent(session.user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken || "");
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      } finally {
        setLoadingToken(false);
      }
    }

    if (session) {
      fetchAccessToken();
    }
  }, [session]);

  if (isPending || loadingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const username = session.user?.name || "user";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and deploy your applications.
            </p>
          </div>
          <Button className="w-fit">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search projects..." />
        </div>

        <ReposList username={username} accessToken={accessToken} />
      </main>
    </div>
  );
}
