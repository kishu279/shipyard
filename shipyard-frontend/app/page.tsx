import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Deploy your projects with ease
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Shipyard is the fastest way to deploy your web applications. Simple, powerful, and built for developers.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/dashboard/user">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" size="lg">
                  Read Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8">
              Why Shipyard?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-background rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-2">Fast Deployment</h3>
                <p className="text-muted-foreground">Get your code live in seconds with our optimized pipeline.</p>
              </div>
              <div className="p-6 bg-background rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-2">Webhooks</h3>
                <p className="text-muted-foreground">Integrate with your favorite tools using our flexible webhooks.</p>
              </div>
              <div className="p-6 bg-background rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-2">Secure</h3>
                <p className="text-muted-foreground">Enterprise-grade security for all your applications.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Shipyard Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Privacy</Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
