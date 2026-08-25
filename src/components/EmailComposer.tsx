import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { draftEmail } from "@/lib/assistant.functions";

type Tone = "formal" | "friendly" | "professional";
type Length = "short" | "medium" | "detailed";

export function EmailComposer() {
  const run = useServerFn(draftEmail);
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<Length>("medium");
  const [original, setOriginal] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (instructions.trim().length < 3) {
      toast.error("Tell me what the email should say first.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({
        data: {
          instructions: instructions.trim(),
          recipient: recipient.trim() || undefined,
          tone,
          length,
        },
      });
      setOriginal(result.text);
      setDraft(result.text);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't write the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="rounded-2xl border bg-card p-5 shadow-panel">
        <h2 className="text-sm font-semibold tracking-tight">What do you need to send?</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Describe it in your own words — bullet points are fine.
        </p>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient (optional)</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="e.g. Thabo, my project manager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Message details</Label>
            <Textarea
              id="instructions"
              rows={8}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder={
                "e.g. Ask to move Thursday's review to Friday morning, apologise for the short notice, and offer 09:00 or 11:00."
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={(value) => setLength(value as Length)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Writing…" : "Write the email"}
          </Button>
        </div>
      </form>

      <ResultPanel
        title="Draft email"
        emptyHint="Your draft will appear here, ready to review and edit."
        value={draft}
        original={original}
        onChange={setDraft}
        isLoading={loading}
      />
    </div>
  );
}
