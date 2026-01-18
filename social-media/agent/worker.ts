import * as z from "zod"
import { MovieState } from "./state"
import { moveiscannertool, streamingloadtool } from './tools'
import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
}).bindTools([moveiscannertool, streamingloadtool])


export const buzzscoutnode = async (state: MovieState) => {
    const response = await llm.invoke([
        new SystemMessage({
            content: `you are a movie buzzscout agent u are given a movie title and u have to find the buzz around the movie and it is ${state.movieTitle}`
        }),
        ...state.messages
    ]);
    if (response.tool_calls?.length) {
        const raw: any = await moveiscannertool.invoke(response.tool_calls[0].args)
        const toolMsg = new ToolMessage({
            tool_call_id: response.tool_calls[0].id!,
            content: JSON.stringify(raw)
        })
        return {
            messages: [response, toolMsg],
            buzzData: {
                trailerViews: raw.trailerViews,
                socialMentions: raw.socialMentions,
                sentiment: raw.sentiment
            }
        }
    }
    return { messages: [new HumanMessage({ content: response.content as string })] }
}

export const hypecalculator = async (state: MovieState) => {
    const prompt = `
    Analyze this movie data: ${JSON.stringify(state.buzzData)}.
    Calculate a 'Hype Score' (0-100). 
    Note: >10M views is instant 90+. <1M views is <40.
    Return JSON: { "score": number }
  `;
    const response = await llm.invoke([
        new HumanMessage(prompt)
    ])
    const match = response.content.toString().match(/\{.*\}/s);
    const json = match ? JSON.parse(match[0]) : { score: 50 };

    return {
        messages: [new HumanMessage({ content: response.content as string })],
        hypeScore: json.score
    };
}


export const sreNode = async (state: MovieState) => {
    const response = await llm.invoke([
        new SystemMessage(`Hype Score is ${state.hypeScore}. Allocate streaming servers.`),
        ...state.messages
    ]);

    if (response.tool_calls?.length) {
        console.log("SRE Tool Args:", JSON.stringify(response.tool_calls[0].args));
        const allocation = await streamingloadtool.invoke(response.tool_calls[0].args);
        const toolMsg = new ToolMessage({
            tool_call_id: response.tool_calls[0].id!,
            content: String(allocation)
        })
        return {
            messages: [response, toolMsg],
            serverAllocation: allocation
        };
    }
    return { messages: [new HumanMessage({ content: response.content as string })] };
};