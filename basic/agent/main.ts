// index.js
import { buildGraph } from "./graph"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

const graph = buildGraph()

const initialState = {
    messages: [
        new SystemMessage(`
You are a calculator agent.

RULES:
- You MUST use exactly ONE tool.
- You MUST NOT do math yourself.
- Return ONLY the tool result.
`),
        new HumanMessage("What is 12/ 0?")
    ]
}

const result = await graph.invoke(initialState)

console.log("Final message:")
const lastMessage = result.messages[result.messages.length - 1]
console.log(lastMessage?.content ?? "No messages returned")
