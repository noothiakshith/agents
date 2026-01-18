import { stateChannels, MovieState } from "./state";
import { buzzscoutnode, hypecalculator, sreNode } from "./worker";
import { supervisorNode } from "./supervisor";
import { StateGraph } from "@langchain/langgraph";
import { Channel } from "@langchain/langgraph/pregel";

const workflow = new StateGraph<MovieState>({ channels: stateChannels })
    .addNode("supervisor", supervisorNode)
    .addNode("buzzscout", buzzscoutnode)
    .addNode("DataScientist", hypecalculator)
    .addNode("sre", sreNode)
    .addEdge("__start__", "supervisor")
    .addConditionalEdges("supervisor", (state) => state.next!, {
        "BuzzScout": "buzzscout",
        "DataScientist": "DataScientist",
        "SiteReliabilityEngineer": "sre",
        "FINISH": "__end__"
    })
    .addEdge("buzzscout", "supervisor")
    .addEdge("DataScientist", "supervisor")
    .addEdge("sre", "supervisor")

export const graph = workflow.compile()