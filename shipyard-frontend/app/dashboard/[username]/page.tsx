import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

const mockProjects = [
  { id: "proj-1", name: "Alpha App", status: "Active", updated: "2h ago" },
  { id: "proj-2", name: "Beta Dashboard", status: "Active", updated: "5h ago" },
  { id: "proj-3", name: "Gamma API", status: "Maintenance", updated: "1d ago" },
  { id: "proj-4", name: "Delta Landing", status: "Active", updated: "3d ago" },
];

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage and deploy your applications.</p>
          </div>
          <Button className="w-fit">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search projects..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>Updated {project.updated}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded truncate font-mono">
                  shipyard.com/{username}/{project.id}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/${username}/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
