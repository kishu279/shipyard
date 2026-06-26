"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllUserRepos } from "@/src/lib/github-webhook";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
}

export function ReposList({ username, accessToken }: { username: string; accessToken: string }) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      if (!accessToken) {
        setError("No access token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllUserRepos(accessToken);
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <Card key={repo.id} className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{repo.name}</CardTitle>
              <Badge variant={repo.private ? "secondary" : "default"}>
                {repo.private ? "Private" : "Public"}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {repo.description || "No description"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded truncate font-mono">
              {repo.full_name}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/${username}/${repo.name}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
