import { useServerFn } from "@tanstack/react-start";
import { ListChecks } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/assistant.functions";

export function MeetingSummarizer() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [original, setOriginal] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (notes.trim().length < 20) {
      toast.error("Paste a bit more of the notes so the summary is useful.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { notes: notes.trim() } });
      setOriginal(result.text);
      setSummary(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't summarize the notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-panel">
        <h2 className="text-sm font-semibold tracking-tight">Meeting notes or transcript</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Paste the raw notes — messy is fine. Nothing is stored.
        </p>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={16}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={
                "e.g. Sipho: Q3 budget is tight, marketing spend capped at 40k. Lerato to confirm vendor quote by Friday. Agreed to delay the launch to 14 Sept…"
              }
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <ListChecks className="size-4" />
            {loading ? "Summarizing…" : "Summarize the meeting"}
          </Button>
        </div>
      </form>

      <ResultPanel
        title="Summary, decisions & action items"
        emptyHint="Your short summary with decisions and action items will appear here."
        value={summary}
        original={original}
        onChange={setSummary}
        isLoading={loading}
      />
    </div>
  );
}
