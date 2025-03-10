"use client"

import { Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GridCellProps {
  col: number
  row: number
  onAddItem: (col: number, row: number) => void
}

export default function GridCell({ col, row, onAddItem }: GridCellProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => onAddItem(col, row)}
            style={{
              gridColumn: col,
              gridRow: row,
            }}
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Add grid item at column {col}, row {row}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

