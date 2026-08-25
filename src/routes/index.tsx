import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, ListChecks, Mail } from "lucide-react";

import { EmailComposer } from "@/components/EmailComposer";
import { MeetingSummarizer } from "@/components/MeetingSummarizer";
import { TaskPlanner } from "@/components/TaskPlanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const title = "Flowdesk — AI Assistant for Email, Meetings & Tasks";
const description =
  "Draft professional emails, turn meeting notes into clear summaries with action items, and get a prioritised daily schedule. No sign-up needed.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-hero-gradient">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Flowdesk
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary-foreground sm:text-4xl">
            Your AI assistant for everyday communication, meetings and tasks
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            Write a clear email, summarise a meeting, or plan your day in seconds. Everything the
            assistant produces is a suggestion — you review, edit and decide.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <Tabs defaultValue="email">
          <TabsList className="mb-6 h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="email" className="gap-2 px-4 py-2">
              <Mail className="size-4" />
              Email writer
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-2 px-4 py-2">
              <ListChecks className="size-4" />
              Meeting summary
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 px-4 py-2">
              <CalendarClock className="size-4" />
              Task planner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <EmailComposer />
          </TabsContent>
          <TabsContent value="meetings">
            <MeetingSummarizer />
          </TabsContent>
          <TabsContent value="tasks">
            <TaskPlanner />
          </TabsContent>
        </Tabs>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          No account, no password. Your text is only used to generate the response you asked for.
        </p>
      </div>
    </main>
  );
}
