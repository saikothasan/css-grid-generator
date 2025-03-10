"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GridItemProps {
  item: {
    id: string
    name: string
    startCol: number
    startRow: number
    endCol: number
    endRow: number
    backgroundColor?: string
  }
  isActive: boolean
  maxCols: number
  maxRows: number
  showName?: boolean
  onSelect: () => void
  onResize: (id: string, endCol: number, endRow: number) => void
  onMove: (id: string, startCol: number, startRow: number) => void
}

export default function GridItem({
  item,
  isActive,
  maxCols,
  maxRows,
  showName = true,
  onSelect,
  onResize,
  onMove,
}: GridItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const itemRef = useRef<HTMLDivElement>(null)

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button

    e.preventDefault()
    e.stopPropagation()

    onSelect()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  // Handle mouse events for resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button

    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate the grid cell size based on the parent container
        const gridCell = itemRef.current?.parentElement
        if (!gridCell) return

        const cellWidth = gridCell.clientWidth / maxCols
        const cellHeight = gridCell.clientHeight / maxRows

        // Calculate the movement in grid cells
        const deltaX = Math.round((e.clientX - dragStart.x) / cellWidth)
        const deltaY = Math.round((e.clientY - dragStart.y) / cellHeight)

        if (deltaX !== 0 || deltaY !== 0) {
          // Calculate new position
          const newStartCol = Math.max(1, Math.min(maxCols - (item.endCol - item.startCol) + 1, item.startCol + deltaX))
          const newStartRow = Math.max(1, Math.min(maxRows - (item.endRow - item.startRow) + 1, item.startRow + deltaY))

          // Update position
          onMove(item.id, newStartCol, newStartRow)

          // Reset drag start
          setDragStart({ x: e.clientX, y: e.clientY })
        }
      } else if (isResizing) {
        // Calculate the grid cell size based on the parent container
        const gridCell = itemRef.current?.parentElement
        if (!gridCell) return

        const cellWidth = gridCell.clientWidth / maxCols
        const cellHeight = gridCell.clientHeight / maxRows

        // Calculate the resize in grid cells
        const deltaX = Math.round((e.clientX - resizeStart.x) / cellWidth)
        const deltaY = Math.round((e.clientY - resizeStart.y) / cellHeight)

        if (deltaX !== 0 || deltaY !== 0) {
          // Calculate new size
          const newEndCol = Math.max(item.startCol + 1, Math.min(maxCols + 1, item.endCol + deltaX))
          const newEndRow = Math.max(item.startRow + 1, Math.min(maxRows + 1, item.endRow + deltaY))

          // Update size
          onResize(item.id, newEndCol, newEndRow)

          // Reset resize start
          setResizeStart({ x: e.clientX, y: e.clientY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, item, maxCols, maxRows, onMove, onResize])

  return (
    <div
      ref={itemRef}
      className={`bg-card border-2 rounded flex items-center justify-center relative select-none ${
        isActive ? "border-primary z-10" : "border-border"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        gridColumn: `${item.startCol} / ${item.endCol}`,
        gridRow: `${item.startRow} / ${item.endRow}`,
        backgroundColor: item.backgroundColor,
      }}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-foreground font-medium">{showName ? item.name || item.id : item.id.split("-")[1]}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {item.name || item.id}: ({item.startCol},{item.startRow}) to ({item.endCol - 1},{item.endRow - 1})
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isActive && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}

