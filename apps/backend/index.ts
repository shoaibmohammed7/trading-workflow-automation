import express from "express"
import { ExecutionModel, NodesModel, UserModel, WorkflowModel } from "db/client"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { SignupSchema,SigninSchema, WorkflowSchema } from "common/types"
import { authMiddleware } from "./middleware"

mongoose.connect(process.env.MONGO_URL!)

const JWT_SECRET = process.env.JWT_SECRET!
const app = express()

app.use(express.json())

app.post("/signup", async(req,res)=>{
    const {success, data} = SignupSchema.safeParse(req.body)
    if(!success){
        res.status(403).json({
            message: "Invalid Inputs"
        })
        return
    }


    try{
        const password = data.password
        const hashedPassword = await Bun.password.hash(password)
        const user = await UserModel.create({
        username:data.username,
        password:hashedPassword
    })
        res.status(201).json({
            id: user._id
        })
    }
    catch(e){
        res.status(409).json({
            message:"Usename Alread Exits"
        })

    }

})

app.post("/signin", async(req,res)=>{

    const {success, data} = SigninSchema.safeParse(req.body)
    if(!success){
        res.status(403).json({
            message: "Invalid Inputs"
        })
        return
    }

        const user = await UserModel.findOne({username:data.username})
        if(!user){
            res.status(404).json({
                message:"User Not Found"
            })
            return
        }
        const isPasswordValid = await Bun.password.verify(data.password,user.password)
        if(!isPasswordValid){
            res.status(403).json({
                message:"Invalid Credentials"
            })
            return
        }
        const token = jwt.sign({userId:user._id}, JWT_SECRET, {expiresIn:"7d"})
        res.status(200).json({
            id: user._id,
            token
        })  
       

})

app.post("/workflow", authMiddleware, async(req,res)=>{

    const userId = req.userId!
    const {success , data} = WorkflowSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message: "Incorrect Inputs"
        })
        return
    }
    try{
        const workflow = await WorkflowModel.create({
            userId,
            nodes: data.nodes,
            edges:data.edges
        })
        res.json({
            id:workflow._id
        })
    }catch(e){
        res.status(411).json({
            message:"Failed to creat a workflow"
        })
    }



})

app.put("/workflow", authMiddleware, (req,res)=>{

})

app.get("/workflow/:workflowId", authMiddleware, async(req,res)=>{
    const workflow = await WorkflowModel.findById(req.params.workflowId);
    if(!workflow || workflow.userId.toString() !== req.userId){
        res.status(400).json({
            message:"Workflow not found"
        })
        return
    }
    res.json(workflow)

})

app.get("/workflow/executions/:workflowId", authMiddleware, async(req,res)=>{
    const executions = await ExecutionModel.find({workflowId: req.params.workflowId})
    res.json(executions)

})

app.get("/nodes", async(req,res)=>{
    const nodes = await NodesModel.find();
    res.json(nodes)
})



app.listen(process.env.PORT || 3000)