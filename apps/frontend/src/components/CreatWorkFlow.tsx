import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger } from './nodes/triggers/PriceTrigger';
import { Timer } from './nodes/triggers/Timer';
import { Lighter } from './nodes/actions/Lighter';
import { ActionSheet } from './ActionSheet';
import { Backpack } from './nodes/actions/Backpack';
import { Hyperliquid } from './nodes/actions/Hyperliquid';
import { type PriceTriggerMetadata,  type TimerNodeMetadata, type TradingMetadata  } from "common/types"


const nodeTypes= {
  "price-trigger": PriceTrigger,
  "timer": Timer,
  "backpack": Backpack,
  "lighter":Lighter,
  "hyperliquid":Hyperliquid
}


export type NodeKind = "timer" | "price-trigger" | "lighweight" | "hyperliquid" | "backpack"

interface NodeType{
  type:NodeKind,  
  data:{
        kind : "action" | "trigger"
        metadata:NodeMetadata

    },
    id:string, position: { x: number, y: number }
}

interface Edge{
    id: string, source: string, target: string
}

export type NodeMetadata = PriceTriggerMetadata | TradingMetadata | TimerNodeMetadata;

export default function CreatWorkFlow() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction , setSelectedAction] = useState<{
    position:{
      x:number,
      y:number
    },
    startingNodeId: string
  } | null >(null);

  const triggerCount = nodes.filter(node => node.data.kind === "trigger").length;
  const actionCount = nodes.filter(node => node.data.kind === "action").length;


  const onNodesChange = useCallback(
    
    (changes:any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [], 
  );
  const onConnect = useCallback(
    (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onConnectEnd = useCallback(
    (params, connectionInfo) =>{
      
      if(!connectionInfo.isValid){
        setSelectedAction({
          startingNodeId: connectionInfo.fromNode.id,
          position: connectionInfo.from
        })
          console.log(connectionInfo.fromNode.id)
          console.log(connectionInfo.to)
      }
    },[]
  )
 
  return (
    <div className="workflow-shell">
      <section className="workflow-header">
        <div>
          <p className="metric-pill">Workflow Studio</p>
          <h1 className="workflow-header__title">Design automated trading rituals with clarity.</h1>
        </div>
        <p className="sheet-note">
          Pick a trigger to start the flow, connect orchestration nodes, and preview every hop on the graph canvas.
        </p>
        <div className="workflow-header__meta">
          <span className="metric-pill">Nodes {nodes.length}</span>
          <span className="metric-pill">Triggers {triggerCount}</span>
          <span className="metric-pill">Actions {actionCount}</span>
          <span className="metric-pill">Edges {edges.length}</span>
        </div>
      </section>

      <div className="workflow-body">
        <aside className="workflow-aside">
          <div className="glass-card">
            <p className="glass-card__title">Build Rituals</p>
            <p className="glass-card__body">
              Drag wires between triggers and actions to choreograph hands-free trading behaviors. Each node represents a precise instruction.
            </p>
          </div>
          <div className="glass-card">
            <p className="glass-card__title">Tips</p>
            <div className="glass-card__body">
              <ul className="list-disc list-inside space-y-1">
                <li>Start with a price or timer trigger.</li>
                <li>Connect to Hyperliquid, Backpack, or Lighter actions.</li>
                <li>Use the sheets to fine tune metadata before placing nodes.</li>
              </ul>
            </div>
          </div>
        </aside>
        <div className="workflow-canvas">
          <div className="workflow-canvas__inner">
            <ReactFlow
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectEnd={onConnectEnd}
              fitView
            />
          </div>
        </div>
      </div>

      {!nodes.length && <TriggerSheet onSelect={(type, metadata)=> {
        setNodes([...nodes,{
          id:Math.random().toString(),
          type,
          data:{
            kind:"trigger",
            metadata,
          },
          position: {x:0, y:0}
        }])
      }}/>}
      {selectAction && (
        <ActionSheet
          isOpen={!!selectAction}
          onClose={() => setSelectedAction(null)}
          onSelect={(type, metadata)=> {
            const nodeId = Math.random().toString();
            setNodes([...nodes,{
              id:nodeId,
              type,
              data:{
                kind:"action",
                metadata,
              },
              position: selectAction.position
            }]);
            setEdges([...edges, {
              id:`${selectAction.startingNodeId}= ${nodeId}`,
              source:selectAction.startingNodeId,
              target: nodeId,

            }]),
            setSelectedAction(null)
          }}
        />
      )}
    </div>
  );
}