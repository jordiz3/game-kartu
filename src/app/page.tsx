import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary flex items-center justify-center gap-3">
            <PenSquare className="w-12 h-12" />
            Secret Scribbles
          </h1>
          <p className="text-muted-foreground mt-2">
            Your AI-powered creative writing partner.
          </p>
        </header>

        <main>
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                Start a new story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-1">
                    What should we write about?
                  </label>
                  <Input 
                    id="topic" 
                    placeholder="e.g., A lost astronaut on a neon planet" 
                    className="bg-input"
                  />
                </div>
                <div>
                  <label htmlFor="preview" className="block text-sm font-medium mb-1">
                    Generated story preview
                  </label>
                  <Textarea
                    id="preview"
                    readOnly
                    placeholder="Your story will appear here..."
                    className="bg-muted h-48 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full text-lg py-6 font-semibold">
                  Generate Story
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>Built with Next.js, Genkit, and ShadCN UI</p>
      </footer>
    </div>
  );
}
