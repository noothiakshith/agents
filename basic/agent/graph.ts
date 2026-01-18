// graph.ts
import { StateGraph, Annotation } from "@langchain/langgraph"
import { ChatMistralAI } from "@langchain/mistralai"
import { BaseMessage, AIMessage, ToolMessage } from "@langchain/core/messages"
import { add, sub, multiply, divide } from "./tools"
import { ToolNode } from "@langchain/langgraph/prebuilt"

// Define the state using Annotation
const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (curr, update) => [...curr, ...update],
        default: () => [],
    }),
})

// All available tools
const tools = [add, sub, multiply, divide]

export function buildGraph() {
    const llm = new ChatMistralAI({
        model: "mistral-large-latest",
        temperature: 0,
        maxRetries: 2,
    }).bindTools(tools)

    // Agent node - calls the LLM
    const agentNode = async (state: typeof AgentState.State) => {
        const response = await llm.invoke(state.messages)
        return {
            messages: [response]
        }
    }

    // Tool node - executes tool calls
    const toolNode = new ToolNode(tools)

    // Conditional function to determine next step
    const shouldContinue = (state: typeof AgentState.State): string => {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage

        // If there are tool calls, route to tools
        if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
            return "tools"
        }
        // Otherwise, end
        return "__end__"
    }

    const graph = new StateGraph(AgentState)
        .addNode("agent", agentNode)
        .addNode("tools", toolNode)
        .addEdge("__start__", "agent")
        .addConditionalEdges("agent", shouldContinue, {
            tools: "tools",
            __end__: "__end__"
        })
        .addEdge("tools", "agent")  // After tool execution, go back to agent

    return graph.compile()
}
