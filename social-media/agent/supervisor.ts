import { ChatMistralAI } from "@langchain/mistralai"
import { MovieState } from "./state"
import * as z from "zod"
import { SystemMessage,HumanMessage } from "@langchain/core/messages"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
})

const routeSchema = z.object({
  next: z.enum(["BuzzScout", "DataScientist", "SiteReliabilityEngineer", "FINISH"]),
});

export const supervisorNode = async (state: MovieState) => {
  const systemPrompt = `You are the Launch Manager for a Streaming Service.
  Movie: ${state.movieTitle}
  
  Status:
  - Buzz Data: ${!!state.buzzData}
  - Hype Score: ${state.hypeScore !== undefined}
  - Server Plan: ${!!state.serverAllocation}
  
  Rules:
  1. No Buzz Data -> 'BuzzScout' (Find trailer stats).
  2. Data but no Score -> 'DataScientist' (Calculate 0-100 score).
  3. Score but no Servers -> 'SiteReliabilityEngineer' (Provision infra).
  4. Done -> 'FINISH'.`;

  const result = await llm.withStructuredOutput(routeSchema).invoke([
    new SystemMessage(systemPrompt),
    ...state.messages
  ]);

  return { next: result.next };
};