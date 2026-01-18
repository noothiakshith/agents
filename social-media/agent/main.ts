import * as dotenv from "dotenv";
dotenv.config();
import express from 'express'
import { graph } from './graph'
import { HumanMessage } from "@langchain/core/messages";

async function runmovieagent(movie: string) {
    const result = await graph.invoke({
        messages: [new HumanMessage(`Prepare infrastructure for ${movie}`)],
        movieTitle: movie
    },
{
    recursionLimit:100
})
    console.log(result)
    return {
        movie: result.movieTitle,
        buzzData: result.buzzData,
        hypeScore: result.hypeScore,
        serverAllocation: result.serverAllocation
    }
}

runmovieagent("The Matrix").catch(e => {
    console.log("FULL ERROR DETAILS:");
    //console.log(JSON.stringify(e, null, 2));
    console.log(e);
})