import { Handle, Position } from "@xyflow/react";
import type { PriceTriggerMetadata } from "common/types";



export function PriceTrigger({data}:{
    data:{
        metadata: PriceTriggerMetadata
    },
    isConnectable:boolean
}){

    return <div className="node-card node-card--trigger">
        <p className="node-card__title">Price Trigger</p>
        <div className="node-card__meta">
            <span className="node-card__badge">{data.metadata.asset}</span>
            <span className="node-card__value">${data.metadata.price}</span>
        </div>
        <Handle type = "source" position={Position.Right}/>
    </div>
}