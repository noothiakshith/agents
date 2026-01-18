import { tool } from '@langchain/core/tools'

import * as z from "zod"

export const add = tool(async({a,b})=>a+b,{
    name:"add",
    description:"add two numbers",
    schema:z.object({
        a:z.number(),
        b:z.number()
    })
})

export const sub = tool(async({a,b})=>a-b,{
    name:"sub",
    description:"this is used for subration",
    schema:z.object({
        a:z.number(),
        b:z.number()
    })
})


export const multiply = tool(async({a,b})=>a*b,{
    name:"mulitply",
    description:"multiplicatoin",
    schema:z.object({
        a:z.number(),
        b:z.number()
    })
})


export const divide = tool(async({a,b}: {a:number,b:number})=>{
    if(b==0){
        return "can't divide by zero"
    }
    return a/b
},{
    name:"divide",
    description:"this is used for division",
    schema:z.object({
        a:z.number(),
        b:z.number()
    })
})