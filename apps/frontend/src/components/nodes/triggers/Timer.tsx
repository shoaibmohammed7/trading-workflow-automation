import { Handle, Position } from "@xyflow/react";
import type { TimerNodeMetadata } from "common/types";



export function Timer({data}:{
    data:{
        metadata: TimerNodeMetadata
    },
    isConnectable:boolean
}){

    return <div className="node-card node-card--trigger">
        <p className="node-card__title">Timer</p>
        <p className="node-card__subtitle">Every {data.metadata.time} seconds</p>
        <Handle type = "source" position={Position.Right}/>
    </div>
}