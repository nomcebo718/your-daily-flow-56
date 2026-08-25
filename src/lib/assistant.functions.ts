import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { generateText } from "./ai.server";

const EmailInput = z.object({
  instructions: z.string().min(3).max(4000),
  tone: z.enum(["formal", "friendly", "professional"]),
  recipient: z.string().max(200).optional(),
  length: z.enum(["short", "medium", "detailed"]),
});

export const draftEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const text = await generateText(
      [
        "You are a productivity assistant that writes clear, professional emails.",
        "Use simple language, short paragraphs and no filler.",
        "Always output plain text in this exact shape:",
        "Subject: <subject line>",
        "",
        "<email body with greeting, body and sign-off>",
        "Use [Name] style placeholders when a detail is unknown. Never invent facts.",
      ].join("\n"),
      [
        `Tone: ${data.tone}`,
        `Length: ${data.length}`,
        data.recipient ? `Recipient: ${data.recipient}` : "",
        `What the email should say: ${data.instructions}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return { text };
  });

const NotesInput = z.object({
  notes: z.string().min(20).max(20000),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const text = await generateText(
      [
        "You summarize meeting notes and transcripts for busy people.",
        "Output plain text with these exact section headings and nothing else:",
        "SUMMARY",
        "KEY DISCUSSION POINTS",
        "DECISIONS",
        "ACTION ITEMS",
        "Under SUMMARY write 2-4 sentences. The other sections use '- ' bullets.",
        "Action items follow: '- Owner — task — due date (or 'no date given')'.",
        "Only use information present in the notes. If a section has nothing, write '- None mentioned'.",
      ].join("\n"),
      `Meeting notes:\n${data.notes}`,
    );
    return { text };
  });

const PlanInput = z.object({
  tasks: z.string().min(3).max(8000),
  hoursPerDay: z.number().int().min(1).max(16),
  horizon: z.enum(["today", "this week"]),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const text = await generateText(
      [
        "You are a task planner. You organise tasks by urgency and importance and build a realistic schedule.",
        "Output plain text with these exact section headings and nothing else:",
        "DO FIRST",
        "PRIORITISED TASKS",
        "SUGGESTED SCHEDULE",
        "WATCH OUT",
        "DO FIRST: 1-3 bullets naming the tasks to start with and why (deadline or impact).",
        "PRIORITISED TASKS: '- [High|Medium|Low] Task — deadline — estimated time'.",
        "SUGGESTED SCHEDULE: time blocks with realistic breaks, fitting the available hours.",
        "WATCH OUT: overloaded days, missing deadlines or tasks worth delegating or dropping.",
        "Keep it short, practical and easy to scan. Suggest, never decide for the user.",
      ].join("\n"),
      [
        `Planning horizon: ${data.horizon}`,
        `Available focus hours per day: ${data.hoursPerDay}`,
        `Tasks (one per line, may include deadlines):\n${data.tasks}`,
      ].join("\n"),
    );
    return { text };
  });
