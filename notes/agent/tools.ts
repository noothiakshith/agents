import { tool } from "@langchain/core/tools"
import * as z from "zod"
import fs from "fs/promises"

const file = 'notes.txt'

export const read_file = tool(
    async () => {
        try {
            console.log("using read operation")
            return await fs.readFile(file, "utf-8")
        }
        catch (err) {
            console.log(err)
            return ""
        }
    },
    {
        name: "readfile",
        description: "Read the notes file to get current notes",
        schema: z.object({})
    }
)

export const write_file = tool(
    async ({ content }: { content: string }) => {
        try {
            console.log("using write operation")
            await fs.writeFile(file, content, "utf-8")
            return "File written successfully"
        }
        catch (err) {
            console.log(err);
            return "Error writing file"
        }
    },
    {
        name: "writefile",
        description: "Write content to the notes file. Use this to save updated notes.",
        schema: z.object({
            content: z.string().describe("The full content to write to the notes file")
        })
    }
)