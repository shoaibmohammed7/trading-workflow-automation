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
import { SUPPORTED_ASSETS, type TimerNodeMetadata } from "common/types"
import type { PriceTriggerMetadata } from "common/types"




const SUPPORTED_TRIGGERS = [{
    id:"timer",
    title:"Timer",
    description:"Run this trigger after every x seconds/minutes"

},{
    id:"price-trigger",
    title:"Price-Trigger",
    description:"execute this if the price goes above/below the selected range"
}]




export const TriggerSheet= ({
    onSelect 
}: {
    onSelect:(kind: NodeKind, metadata:NodeMetadata) => void
})=> {
   
  const [metadata, setmetadata] = useState<PriceTriggerMetadata | TimerNodeMetadata >({
    time:3600
  });  
  const [selectedTrigger, setselectedTrigger] = useState(SUPPORTED_TRIGGERS[0].id)
  return (
    <Sheet open={true}>
      <SheetTrigger asChild>
      </SheetTrigger>
      <SheetContent className="sheet-panel space-y-6">
        <SheetHeader>
          <SheetTitle>Trigger Library</SheetTitle>
          <SheetDescription>
            Choose the condition that should wake up this workflow. Triggers define when the action graph starts executing.
          </SheetDescription>
        </SheetHeader>

        <div className="sheet-stack">
          <div>
            <p className="section-label">Trigger Type</p>
            <Select value={selectedTrigger} onValueChange={(value)=> setselectedTrigger(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Trigger" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {SUPPORTED_TRIGGERS.map(({id,title})=>
                        <SelectItem key = {id} value={id}>{title} </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>

          {selectedTrigger === "timer" && (
            <div className="field-grid">
              <div>
                <Label htmlFor="timer-delay" className="section-label">Delay (seconds)</Label>
                <Input id="timer-delay" value={metadata.time} onChange = {(e)=>setmetadata(metadata=>({
                  ...metadata,
                  time:Number(e.target.value)
                }))}></Input>
                <p className="sheet-note">This determines how often the trigger fires after the previous run.</p>
              </div>
            </div>
          )}


          {selectedTrigger === "price-trigger" && (
            <div className="field-grid field-grid--two">
              <div>
                <Label htmlFor="price-target" className="section-label">Target Price</Label>
                <Input id="price-target" type="number" inputMode="decimal" onChange={(e)=> setmetadata(m=>({
                  ...m,
                  price:Number(e.target.value)
                }))}></Input>
              </div>
              <div>
                <Label htmlFor="price-asset" className="section-label">Asset</Label>
                <Select value={metadata.asset} onValueChange={(value)=> setmetadata(metadata =>({
                  ...metadata,
                  asset:value
                }))}>
                  <SelectTrigger id="price-asset" className="w-full">
                      <SelectValue placeholder="Select a Asset" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          {SUPPORTED_ASSETS.map((id)=>
                          <SelectItem key = {id} value={id}>{id} </SelectItem>
                          )}
                      </SelectGroup>
                  </SelectContent>
              </Select>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter>
          <Button className="w-full" onClick={()=>{
            onSelect(
                //@ts-ignore
                selectedTrigger,
                metadata
            )
          }} type="submit">Create Trigger</Button>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
