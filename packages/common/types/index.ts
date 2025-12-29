import { password } from "bun"
import { z } from "zod"


export const SignupSchema = z.object({
    username: z.string().min(3).max(100),
    password:z.string().min(5).max(100)
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(3).max(100)

})

export const WorkflowSchema = z.object({
    nodes:z.array(z.object({
        types:z.string(),
        data: z.object({
            kind: z.enum(["ACTIONS", "TRIGGER"]),
            metadata: z.any()
        }),
        id:z.string(),
        position:z.object({
            x:z.number(),
            y:z.number()
        }),


    })),
    edges:z.array(z.object({
        id:z.string(),
        source:z.string(),
        target:z.string()
    }))
})

export const UpdateWorkflowSchema = z.object({
    nades:z.array(z.object({
        id:z.string(),
        position: z.object({
            x:z.number(),
            y:z.number()
        })
    })),
    edges:z.array(z.object({
        id:z.string(),
        source:z.string(),
        target:z.string()
    }))
})