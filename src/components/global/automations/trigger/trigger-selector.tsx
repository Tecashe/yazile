"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TRIGGER_MODES } from "@/constants/automation-triggers"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

type Props = {
  selectedType: string
  onSelect: (type: string) => void
}

const TriggerModeSelector = ({ selectedType, onSelect }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TRIGGER_MODES.map((mode) => (
        <Card
          key={mode.id}
          className={cn(
            "border-border/50 bg-background/50 hover:border-primary/50 transition-all cursor-pointer",
            selectedType === mode.type && "border-primary/50 shadow-md shadow-primary/10",
          )}
          onClick={() => onSelect(mode.type)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md bg-${mode.color}-100/20`}>{mode.icon}</div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">{mode.label}</h3>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </div>
            </div>
            {selectedType === mode.type && <CheckCircle className="h-4 w-4 text-green-500" />}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-muted-foreground">Advantages</h4>
                <ul className="list-disc list-inside text-xs text-muted-foreground pl-1 space-y-0.5">
                  {mode.pros.slice(0, 2).map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {mode.useCase}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TriggerModeSelector
