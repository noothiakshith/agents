import { BaseMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";

export interface MovieState {
  messages: BaseMessage[];
  movieTitle: string;
  // Specific Movie Data
  buzzData?: { 
    trailerViews: number; 
    socialMentions: number; 
    sentiment: string 
  };
  hypeScore?: number; // 0-100
  serverAllocation?: string; // The final output
  next?: string;
}

export const stateChannels = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  movieTitle: {
    value: (x: string, y: string) => y ?? x,
    default: () => "",
  },
  buzzData: {
    value: (x: any, y: any) => y ?? x,
    default: () => undefined,
  },
  hypeScore: {
    value: (x: number, y: number) => y ?? x,
    default: () => undefined,
  },
  serverAllocation: {
    value: (x: string, y: string) => y ?? x,
    default: () => undefined,
  },
  next: {
    value: (x: string, y: string) => y,
    default: () => END,
  },
};