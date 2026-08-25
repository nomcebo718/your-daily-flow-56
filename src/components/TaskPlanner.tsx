import { useServerFn } from "@tanstack/react-start";
import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/assistant.functions";

type Horizon = "today" | "this week";

export function TaskPlanner() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(6);
  const [horizon, setHorizon] = useState<Horizon>("this week");
  const [original, setOriginal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (tasks.trim().length < 3) {
      toast.error("Add at least one task to plan.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({
        data: { tasks: tasks.trim(), hoursPerDay: hours, horizon },
      });
      setOriginal(result.text);
      setPlan(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't build the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-panel">
        <h2 className="text-sm font-semibold tracking-tight">Your tasks</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          One task per line. Add deadlines where you know them.
        </p>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasks">Task list</Label>
            <Textarea
              id="tasks"
              rows={10}
              value={tasks}
              onChange={(event) => setTasks(event.target.value)}
              placeholder={
                "Finish client proposal — due Wed\nReply to supplier email\nPrepare team update slides — due Friday\nBook flights for the conference"
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan for</Label>
              <Select value={horizon} onValueChange={(value) => setHorizon(value as Horizon)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Focus hours per day: {hours}</Label>
              <Slider
                id="hours"
                min={1}
                max={12}
                step={1}
                value={[hours]}
                onValueChange={([value]) => setHours(value ?? 6)}
                className="pt-3"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <CalendarClock className="size-4" />
            {loading ? "Planning…" : "Prioritise & schedule"}
          </Button>
        </div>
      </form>

      <ResultPanel
        title="Priorities & suggested schedule"
        emptyHint="Your prioritised list and a practical schedule will appear here."
        value={plan}
        original={original}
        onChange={setPlan}
        isLoading={loading}
      />
    </div>
  );
}
