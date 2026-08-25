import { Check, Copy, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ResultPanelProps = {
  title: string;
  emptyHint: string;
  value: string;
  onChange: (value: string) => void;
  original: string;
  isLoading: boolean;
  rows?: number;
};

export function ResultPanel({
  title,
  emptyHint,
  value,
  onChange,
  original,
  isLoading,
  rows = 18,
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-panel">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">
            You can edit everything before you use it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(original)}
            disabled={!original || value === original}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            Copy
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-1 flex-col justify-center gap-3 py-10">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          <p className="mt-2 text-xs text-muted-foreground">Thinking it through…</p>
        </div>
      ) : value ? (
        <Textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 resize-y whitespace-pre-wrap font-mono text-[13px] leading-relaxed"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}
    </section>
  );
}
