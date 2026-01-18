// agent.ts
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import { read_file, write_file } from "./tools"

const tools = [read_file, write_file]

const toolsByName: Record<string, typeof read_file | typeof write_file> = {
    readfile: read_file,
    writefile: write_file
}

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
}).bindTools(tools)

const systemPrompt = `
You are a notes management agent.

Rules:
- Notes are stored in a file called notes.txt
- Each note is on a new line with a number prefix
  Example:
  1. buy milk
  2. learn langgraph

You can do ONLY these actions:
- Add a note
- List notes
- Delete a note by number

You MUST follow this process:
1. Always call readfile first to get current notes
2. Modify the notes in memory
3. Write the full updated content using writefile
4. When listing notes, return the file content as your final response

Always respond with the result after completing the action.
`

async function run(userInput: string) {
    console.log(`\n--- User: ${userInput} ---`)

    const messages: BaseMessage[] = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userInput)
    ]

    // Agent loop - keep going until no more tool calls
    while (true) {
        const response = await llm.invoke(messages)
        messages.push(response)

        // Check if there are tool calls
        if (response.tool_calls && response.tool_calls.length > 0) {
            // Execute each tool call
            for (const toolCall of response.tool_calls) {
                console.log(`Calling tool: ${toolCall.name}`)
                const tool = toolsByName[toolCall.name]
                if (tool) {
                    const result = await tool.invoke(toolCall.args as any)
                    console.log(`Tool result: ${result}`)

                    // Add tool result to messages
                    messages.push(new ToolMessage({
                        tool_call_id: toolCall.id!,
                        content: String(result)
                    }))
                }
            }
        } else {
            // No tool calls - we have the final response
            console.log("\nAgent response:")
            console.log(response.content)
            break
        }
    }
}

// Try commands
await run("Add note: buy milk")
await run("Add note: learn langgraph")
await run("List notes")
await run("Delete note 1")
await run("List notes")
