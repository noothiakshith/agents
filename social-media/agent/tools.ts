import { tool } from '@langchain/core/tools'
import * as z from "zod"

export const moveiscannertool = tool(
    async ({ movie_title }: { movie_title: string }) => {
        try {
            console.log(`I am Scanning for this tool ${movie_title}`)
            const isblockbuster = Math.random() > 0.5;
            const trailerViews = Math.floor(Math.random() * 1000000);
            const socialMentions = Math.floor(Math.random() * 10000);
            const sentiment = isblockbuster ? "positive" : "negative"
            return {
                isblockbuster,
                trailerViews,
                socialMentions,
                sentiment
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    , {
        name: "movie_scanner",
        description: "Scans for the movie and return the data"
    })


export const streamingloadtool = tool(
    async ({ hype_score }: { hype_score: number }) => {
        console.log(`The hype score is ${hype_score}`)
        if (hype_score > 90) {
            return "High"
        }
        else if (hype_score > 80 && hype_score < 90) {
            return "Medium"
        }
        else {
            return "Low"
        }
    }

    , {
        name: "streaming_load_tool",
        description: "Returns the streaming load. Input MUST be an object with strict key 'hype_score' (number). Example: { hype_score: 85 }"
    })