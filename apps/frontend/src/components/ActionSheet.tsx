import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import type { NodeKind, NodeMetadata } from "./CreatWorkFlow"
import type { TimerNodeMetadata } from "common/types"
import type { PriceTriggerMetadata } from "common/types"

import { SUPPORTED_ASSETS } from "common/types"
import type { TradingMetadata } from "common/types"




const SUPPORTED_ACTION = [{
    id:"hyperliquid",
    title:"Hyperliquid",
    description:"Place a trade on hyperliquide"

},{
    id:"backpack",
    title:"Backpack",
    description:"Place a trade on backpack"
},{
     id:"lighter",
    title:"Lighter",
    description:"Place a trade on lighter"
}]




export const ActionSheet= ({
  isOpen,
  onClose,
  onSelect 
}: {
  isOpen: boolean
  onClose: () => void
  onSelect:(kind: NodeKind, metadata:NodeMetadata) => void
})=> {
   
  const [metadata, setmetadata] = useState<TradingMetadata | {} >({});  
  const [selectedAction, setSelectedAction] = useState(SUPPORTED_ACTION[0].id)
  return (
    <Sheet open={isOpen} onOpenChange={(nextOpen)=> {
      if(!nextOpen){
        onClose()
      }
    }}>
      <SheetTrigger asChild>
      </SheetTrigger>
      <SheetContent className="sheet-panel space-y-6">
        <SheetHeader>
          <SheetTitle>Action Palette</SheetTitle>
          <SheetDescription>
            Route the trigger output to one of the supported execution venues. Configure the trade metadata before inserting the node.
          </SheetDescription>
        </SheetHeader>

        <div className="sheet-stack">
          <div>
            <p className="section-label">Destination</p>
            <Select value={selectedAction} onValueChange={(value)=> setSelectedAction(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an Action" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {SUPPORTED_ACTION.map(({id,title})=>
                        <SelectItem key = {id} value={id}>{title} </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>

          {(selectedAction === "lighter" || selectedAction === "backpack" || selectedAction === "hyperliquid") && (
            <div className="field-grid field-grid--two">
              <div>
                <Label htmlFor="action-type" className="section-label">Direction</Label>
                <Select value={metadata?.type} onValueChange={(value)=> setmetadata(metadata =>({
                    ...metadata,
                    type:value
                    }))}>
                    <SelectTrigger id="action-type" className="w-full">
                        <SelectValue placeholder="Select a Direction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={"long"}>LONG </SelectItem>
                            <SelectItem value={"short"}>SHORT </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action-symbol" className="section-label">Asset</Label>
                <Select value={metadata?.symbol} onValueChange={(value)=> setmetadata(metadata =>({
                    ...metadata,
                    symbol:value
                }))}>
                    <SelectTrigger id="action-symbol" className="w-full">
                        <SelectValue placeholder="Select an Asset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {SUPPORTED_ASSETS.map(asset => <SelectItem key = {asset} value={asset}>
                                {asset} </SelectItem>)
                                
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action-qty" className="section-label">Quantity</Label>
                <Input id="action-qty" value={metadata.qty} onChange = {(e)=>setmetadata(metadata=>({
                    ...metadata,
                    qty:Number(e.target.value)
                }))}></Input>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter>
          <Button className="w-full" onClick={()=>{
            onSelect(
                //@ts-ignore
                selectedAction,
                metadata
            )
          }} type="submit">Create Action</Button>
          {/* <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </SheetClose> */}
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
