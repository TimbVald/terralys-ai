import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";


export type MeetingGetOne = inferRouterOutputs<AppRouter>["meeting"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meeting"]["getMany"]["items"];

export enum MeetingStatus {
    Upcoming = "upcoming",
    Active= "active",
    Completed = "completed",
    Processing = "processing",
    Cancelled = "cancelled",
};

export type StreamTranscriptItem = {
    speaker_id: string;
    type: string;
    text: string;
    start_ts: number;
    stop_ts: number;
}