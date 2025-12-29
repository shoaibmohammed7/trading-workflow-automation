import { Handle, Position } from "@xyflow/react";
import type { TradingMetadata } from "common/types";


export function Lighter({data}:{
    data:{
            metadata: TradingMetadata
    }
}) {
    return <div className="node-card">
        <p className="node-card__title">Lighter Trade</p>
        <div className="node-card__meta">
            <span className="node-card__badge">{data.metadata.type}</span>
            <span className="node-card__value">{data.metadata.qty}</span>
        </div>
        <p className="node-card__subtitle">{data.metadata.symbol}</p>
        <Handle type = "source" position={Position.Right}/>
        <Handle type = "target" position={Position.Left}/>
    </div>
}