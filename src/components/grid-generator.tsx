"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Copy,
  Check,
  Save,
  Download,
  Undo,
  Redo,
  RefreshCw,
  Code,
  Eye,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react"
import GridCell from "./grid-cell"
import GridItem from "./grid-item"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface GridItemType {
  id: string
  name: string
  startCol: number
  startRow: number
  endCol: number
  endRow: number
  backgroundColor?: string
}

interface GridConfig {
  columns: number
  rows: number
  gap: number
  gapUnit: string
  columnUnit: string
  rowUnit: string
  items: GridItemType[]
  justifyItems: string
  alignItems: string
  justifyContent: string
  alignContent: string
}

interface HistoryEntry {
  config: GridConfig
  timestamp: number
}

// Predefined templates
const TEMPLATES = {
  "basic-3col": {
    name: "Basic 3-Column Layout",
    columns: 3,
    rows: 3,
    gap: 16,
    gapUnit: "px",
    columnUnit: "fr",
    rowUnit: "auto",
    items: [
      { id: "header", name: "header", startCol: 1, startRow: 1, endCol: 4, endRow: 2, backgroundColor: "#f0f4f8" },
      { id: "sidebar", name: "sidebar", startCol: 1, startRow: 2, endCol: 2, endRow: 3, backgroundColor: "#d1e3fa" },
      { id: "main", name: "main", startCol: 2, startRow: 2, endCol: 4, endRow: 3, backgroundColor: "#e6f0ff" },
      { id: "footer", name: "footer", startCol: 1, startRow: 3, endCol: 4, endRow: 4, backgroundColor: "#f0f4f8" },
    ],
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "start",
    alignContent: "start",
  },
  "holy-grail": {
    name: "Holy Grail Layout",
    columns: 5,
    rows: 5,
    gap: 16,
    gapUnit: "px",
    columnUnit: "fr",
    rowUnit: "auto",
    items: [
      { id: "header", name: "header", startCol: 1, startRow: 1, endCol: 6, endRow: 2, backgroundColor: "#f0f4f8" },
      {
        id: "left-sidebar",
        name: "left-sidebar",
        startCol: 1,
        startRow: 2,
        endCol: 2,
        endRow: 5,
        backgroundColor: "#d1e3fa",
      },
      { id: "content", name: "content", startCol: 2, startRow: 2, endCol: 5, endRow: 5, backgroundColor: "#e6f0ff" },
      {
        id: "right-sidebar",
        name: "right-sidebar",
        startCol: 5,
        startRow: 2,
        endCol: 6,
        endRow: 5,
        backgroundColor: "#d1e3fa",
      },
      { id: "footer", name: "footer", startCol: 1, startRow: 5, endCol: 6, endRow: 6, backgroundColor: "#f0f4f8" },
    ],
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "space-between",
    alignContent: "start",
  },
  dashboard: {
    name: "Dashboard Layout",
    columns: 4,
    rows: 4,
    gap: 16,
    gapUnit: "px",
    columnUnit: "fr",
    rowUnit: "auto",
    items: [
      { id: "header", name: "header", startCol: 1, startRow: 1, endCol: 5, endRow: 2, backgroundColor: "#f0f4f8" },
      { id: "sidebar", name: "sidebar", startCol: 1, startRow: 2, endCol: 2, endRow: 5, backgroundColor: "#d1e3fa" },
      {
        id: "main-chart",
        name: "main-chart",
        startCol: 2,
        startRow: 2,
        endCol: 4,
        endRow: 4,
        backgroundColor: "#e6f0ff",
      },
      { id: "stats-1", name: "stats-1", startCol: 4, startRow: 2, endCol: 5, endRow: 3, backgroundColor: "#c7d8ed" },
      { id: "stats-2", name: "stats-2", startCol: 4, startRow: 3, endCol: 5, endRow: 4, backgroundColor: "#c7d8ed" },
      {
        id: "bottom-panel",
        name: "bottom-panel",
        startCol: 2,
        startRow: 4,
        endCol: 5,
        endRow: 5,
        backgroundColor: "#d9e6f7",
      },
    ],
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "start",
    alignContent: "start",
  },
}

export default function GridGenerator() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("editor")
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activeBreakpoint, setActiveBreakpoint] = useState<"base" | "sm" | "md" | "lg" | "xl">("base")
  const [showNamedAreas, setShowNamedAreas] = useState(true)
  const [useGridAreas, setUseGridAreas] = useState(true)
  const [addPrefixes, setAddPrefixes] = useState(true)
  const [cssFormat, setCssFormat] = useState<"standard" | "scss">("standard")

  // Grid configuration
  const [config, setConfig] = useState<GridConfig>({
    columns: 5,
    rows: 5,
    gap: 16,
    gapUnit: "px",
    columnUnit: "fr",
    rowUnit: "auto",
    items: [{ id: "item-1", name: "item1", startCol: 1, startRow: 1, endCol: 2, endRow: 2 }],
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "start",
    alignContent: "start",
  })

  // History for undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [activeItem, setActiveItem] = useState<string | null>("item-1")
  const [copied, setCopied] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Add current config to history when it changes
  useEffect(() => {
    // Skip initial render
    if (historyIndex === -1) {
      setHistory([{ config, timestamp: Date.now() }])
      setHistoryIndex(0)
      return
    }

    // Don't add to history if we're just navigating through history
    if (history[historyIndex]?.timestamp === Date.now()) {
      return
    }

    // Add new history entry, truncating any future entries if we've gone back in time
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ config, timestamp: Date.now() })

    // Limit history size to prevent memory issues
    if (newHistory.length > 30) {
      newHistory.shift()
    }

    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [config])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setConfig(history[historyIndex - 1].config)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setConfig(history[historyIndex + 1].config)
    }
  }

  const handleAddItem = (col: number, row: number) => {
    const newId = `item-${config.items.length + 1}`
    const newName = `item${config.items.length + 1}`

    const newItems = [
      ...config.items,
      { id: newId, name: newName, startCol: col, startRow: row, endCol: col + 1, endRow: row + 1 },
    ]

    setConfig({
      ...config,
      items: newItems,
    })

    setActiveItem(newId)
  }

  const handleResizeItem = (id: string, endCol: number, endRow: number) => {
    setConfig({
      ...config,
      items: config.items.map((item) => (item.id === id ? { ...item, endCol, endRow } : item)),
    })
  }

  const handleMoveItem = (id: string, startCol: number, startRow: number) => {
    const item = config.items.find((i) => i.id === id)
    if (!item) return

    const width = item.endCol - item.startCol
    const height = item.endRow - item.startRow

    setConfig({
      ...config,
      items: config.items.map((item) =>
        item.id === id
          ? {
              ...item,
              startCol,
              startRow,
              endCol: startCol + width,
              endRow: startRow + height,
            }
          : item,
      ),
    })
  }

  const handleUpdateItemName = (id: string, name: string) => {
    setConfig({
      ...config,
      items: config.items.map((item) => (item.id === id ? { ...item, name } : item)),
    })
  }

  const handleUpdateItemColor = (id: string, backgroundColor: string) => {
    setConfig({
      ...config,
      items: config.items.map((item) => (item.id === id ? { ...item, backgroundColor } : item)),
    })
  }

  const handleDeleteItem = (id: string) => {
    setConfig({
      ...config,
      items: config.items.filter((item) => item.id !== id),
    })

    if (activeItem === id) {
      setActiveItem(config.items[0]?.id || null)
    }
  }

  const handleReset = () => {
    setConfig({
      columns: 5,
      rows: 5,
      gap: 16,
      gapUnit: "px",
      columnUnit: "fr",
      rowUnit: "auto",
      items: [{ id: "item-1", name: "item1", startCol: 1, startRow: 1, endCol: 2, endRow: 2 }],
      justifyItems: "stretch",
      alignItems: "stretch",
      justifyContent: "start",
      alignContent: "start",
    })
    setActiveItem("item-1")
  }

  const handleLoadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    setConfig(TEMPLATES[templateKey])
    setActiveItem(TEMPLATES[templateKey].items[0].id)

    toast({
      title: "Template loaded",
      description: `Loaded template: ${TEMPLATES[templateKey].name}`,
    })
  }

  const generateGridTemplateAreas = () => {
    if (!useGridAreas) return null

    // Create a 2D grid filled with "."
    const grid: string[][] = Array(config.rows)
      .fill(null)
      .map(() => Array(config.columns).fill("."))

    // Fill in the grid with area names
    config.items.forEach((item) => {
      const name = item.name || item.id
      for (let row = item.startRow - 1; row < item.endRow - 1; row++) {
        for (let col = item.startCol - 1; col < item.endCol - 1; col++) {
          if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
            grid[row][col] = name
          }
        }
      }
    })

    // Convert the 2D grid to the grid-template-areas format
    return grid.map((row) => `"${row.join(" ")}"`).join("\n    ")
  }

  const generateColumnTemplate = () => {
    if (config.columnUnit === "fr") {
      return `repeat(${config.columns}, 1fr)`
    } else {
      return `repeat(${config.columns}, ${config.columnUnit})`
    }
  }

  const generateRowTemplate = () => {
    if (config.rowUnit === "fr") {
      return `repeat(${config.rows}, 1fr)`
    } else if (config.rowUnit === "auto") {
      return `repeat(${config.rows}, auto)`
    } else {
      return `repeat(${config.rows}, ${config.rowUnit})`
    }
  }

  const generateCSS = () => {
    let css = `.grid-container {\n`
    css += `  display: grid;\n`
    css += `  grid-template-columns: ${generateColumnTemplate()};\n`
    css += `  grid-template-rows: ${generateRowTemplate()};\n`
    css += `  gap: ${config.gap}${config.gapUnit};\n`

    if (config.justifyItems !== "stretch") {
      css += `  justify-items: ${config.justifyItems};\n`
    }

    if (config.alignItems !== "stretch") {
      css += `  align-items: ${config.alignItems};\n`
    }

    if (config.justifyContent !== "start") {
      css += `  justify-content: ${config.justifyContent};\n`
    }

    if (config.alignContent !== "start") {
      css += `  align-content: ${config.alignContent};\n`
    }

    const gridTemplateAreas = generateGridTemplateAreas()
    if (gridTemplateAreas) {
      css += `  grid-template-areas: \n    ${gridTemplateAreas};\n`
    }

    css += `}\n\n`

    config.items.forEach((item) => {
      const selector = cssFormat === "scss" ? `  &__${item.name}` : `.${item.name || item.id}`

      css += `${selector} {\n`

      if (useGridAreas) {
        css += `  grid-area: ${item.name || item.id};\n`
      } else {
        css += `  grid-column: ${item.startCol} / ${item.endCol};\n`
        css += `  grid-row: ${item.startRow} / ${item.endRow};\n`
      }

      css += `}\n\n`
    })

    // Add media queries for responsive layouts if needed
    if (activeBreakpoint !== "base") {
      css += `/* Responsive layout */\n`
      css += `@media (max-width: 768px) {\n`
      css += `  .grid-container {\n`
      css += `    grid-template-columns: 1fr;\n`
      css += `    grid-template-areas: none;\n`
      css += `  }\n\n`

      config.items.forEach((item) => {
        css += `  .${item.name || item.id} {\n`
        css += `    grid-column: 1 / -1;\n`
        css += `  }\n\n`
      })

      css += `}\n`
    }

    return css
  }

  const generateHTML = () => {
    let html = `<div class="grid-container">\n`

    config.items.forEach((item) => {
      html += `  <div class="${item.name || item.id}">
    <!-- Content for ${item.name || item.id} -->
  </div>\n`
    })

    html += `</div>`

    return html
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = (type: "css" | "html") => {
    const text = type === "css" ? generateCSS() : generateHTML()
    const filename = type === "css" ? "grid-styles.css" : "grid-layout.html"
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "File downloaded",
      description: `${filename} has been downloaded.`,
    })
  }

  const saveConfiguration = () => {
    const configString = JSON.stringify(config)
    localStorage.setItem("gridGeneratorConfig", configString)

    toast({
      title: "Configuration saved",
      description: "Your grid configuration has been saved to local storage.",
    })
  }

  const loadConfiguration = () => {
    const savedConfig = localStorage.getItem("gridGeneratorConfig")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig(parsedConfig)
        setActiveItem(parsedConfig.items[0]?.id || null)

        toast({
          title: "Configuration loaded",
          description: "Your saved grid configuration has been loaded.",
        })
      } catch (error) {
        toast({
          title: "Error loading configuration",
          description: "There was an error loading your saved configuration.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No saved configuration",
        description: "No saved configuration was found.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1" onClick={() => setIsPreviewMode(true)}>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={saveConfiguration}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save configuration</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={loadConfiguration}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Load configuration</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="columns">Columns</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="columns"
                        type="number"
                        min="1"
                        max="12"
                        value={config.columns}
                        onChange={(e) => setConfig({ ...config, columns: Number.parseInt(e.target.value) || 1 })}
                        className="w-full"
                      />
                      <Select
                        value={config.columnUnit}
                        onValueChange={(value) => setConfig({ ...config, columnUnit: value })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">fr</SelectItem>
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="auto">auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="rows">Rows</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="rows"
                        type="number"
                        min="1"
                        max="12"
                        value={config.rows}
                        onChange={(e) => setConfig({ ...config, rows: Number.parseInt(e.target.value) || 1 })}
                        className="w-full"
                      />
                      <Select
                        value={config.rowUnit}
                        onValueChange={(value) => setConfig({ ...config, rowUnit: value })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">fr</SelectItem>
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="auto">auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="gap">Gap</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="gap"
                        type="number"
                        min="0"
                        max="50"
                        value={config.gap}
                        onChange={(e) => setConfig({ ...config, gap: Number.parseInt(e.target.value) || 0 })}
                        className="w-full"
                      />
                      <Select
                        value={config.gapUnit}
                        onValueChange={(value) => setConfig({ ...config, gapUnit: value })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="rem">rem</SelectItem>
                          <SelectItem value="em">em</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label>Templates</Label>
                    <Select onValueChange={(value: keyof typeof TEMPLATES) => handleLoadTemplate(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic-3col">Basic 3-Column Layout</SelectItem>
                        <SelectItem value="holy-grail">Holy Grail Layout</SelectItem>
                        <SelectItem value="dashboard">Dashboard Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Alignment</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="justify-items">Justify Items</Label>
                        <Select
                          value={config.justifyItems}
                          onValueChange={(value) => setConfig({ ...config, justifyItems: value })}
                        >
                          <SelectTrigger id="justify-items">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="stretch">Stretch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="align-items">Align Items</Label>
                        <Select
                          value={config.alignItems}
                          onValueChange={(value) => setConfig({ ...config, alignItems: value })}
                        >
                          <SelectTrigger id="align-items">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="stretch">Stretch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="justify-content">Justify Content</Label>
                        <Select
                          value={config.justifyContent}
                          onValueChange={(value) => setConfig({ ...config, justifyContent: value })}
                        >
                          <SelectTrigger id="justify-content">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="stretch">Stretch</SelectItem>
                            <SelectItem value="space-around">Space Around</SelectItem>
                            <SelectItem value="space-between">Space Between</SelectItem>
                            <SelectItem value="space-evenly">Space Evenly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="align-content">Align Content</Label>
                        <Select
                          value={config.alignContent}
                          onValueChange={(value) => setConfig({ ...config, alignContent: value })}
                        >
                          <SelectTrigger id="align-content">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="stretch">Stretch</SelectItem>
                            <SelectItem value="space-around">Space Around</SelectItem>
                            <SelectItem value="space-between">Space Between</SelectItem>
                            <SelectItem value="space-evenly">Space Evenly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Options</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-named-areas" className="cursor-pointer">
                          Show Named Areas
                        </Label>
                        <Switch id="show-named-areas" checked={showNamedAreas} onCheckedChange={setShowNamedAreas} />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-grid-areas" className="cursor-pointer">
                          Use Grid Template Areas
                        </Label>
                        <Switch id="use-grid-areas" checked={useGridAreas} onCheckedChange={setUseGridAreas} />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="add-prefixes" className="cursor-pointer">
                          Add Browser Prefixes
                        </Label>
                        <Switch id="add-prefixes" checked={addPrefixes} onCheckedChange={setAddPrefixes} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="css-format">CSS Format</Label>
                        <Select value={cssFormat} onValueChange={(value: "standard" | "scss") => setCssFormat(value)}>
                          <SelectTrigger id="css-format">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard CSS</SelectItem>
                            <SelectItem value="scss">SCSS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {activeItem && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Selected Item: {activeItem}</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="item-name">Name</Label>
                        <Input
                          id="item-name"
                          value={config.items.find((item) => item.id === activeItem)?.name || ""}
                          onChange={(e) => handleUpdateItemName(activeItem, e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-color">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="item-color"
                            type="color"
                            value={config.items.find((item) => item.id === activeItem)?.backgroundColor || "#ffffff"}
                            onChange={(e) => handleUpdateItemColor(activeItem, e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={config.items.find((item) => item.id === activeItem)?.backgroundColor || "#ffffff"}
                            onChange={(e) => handleUpdateItemColor(activeItem, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="item-start-col" className="text-xs">
                              Start Column
                            </Label>
                            <Input
                              id="item-start-col"
                              type="number"
                              min="1"
                              max={config.columns}
                              value={config.items.find((item) => item.id === activeItem)?.startCol || 1}
                              onChange={(e) => {
                                const item = config.items.find((i) => i.id === activeItem)
                                if (!item) return

                                const startCol = Number.parseInt(e.target.value) || 1
                                const endCol = Math.max(startCol + 1, item.endCol)

                                handleMoveItem(activeItem, startCol, item.startRow)
                                handleResizeItem(activeItem, endCol, item.endRow)
                              }}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor="item-start-row" className="text-xs">
                              Start Row
                            </Label>
                            <Input
                              id="item-start-row"
                              type="number"
                              min="1"
                              max={config.rows}
                              value={config.items.find((item) => item.id === activeItem)?.startRow || 1}
                              onChange={(e) => {
                                const item = config.items.find((i) => i.id === activeItem)
                                if (!item) return

                                const startRow = Number.parseInt(e.target.value) || 1
                                const endRow = Math.max(startRow + 1, item.endRow)

                                handleMoveItem(activeItem, item.startCol, startRow)
                                handleResizeItem(activeItem, item.endCol, endRow)
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Size</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="item-end-col" className="text-xs">
                              End Column
                            </Label>
                            <Input
                              id="item-end-col"
                              type="number"
                              min="2"
                              max={config.columns + 1}
                              value={config.items.find((item) => item.id === activeItem)?.endCol || 2}
                              onChange={(e) => {
                                const item = config.items.find((i) => i.id === activeItem)
                                if (!item) return

                                const endCol = Number.parseInt(e.target.value) || 2
                                if (endCol > item.startCol) {
                                  handleResizeItem(activeItem, endCol, item.endRow)
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor="item-end-row" className="text-xs">
                              End Row
                            </Label>
                            <Input
                              id="item-end-row"
                              type="number"
                              min="2"
                              max={config.rows + 1}
                              value={config.items.find((item) => item.id === activeItem)?.endRow || 2}
                              onChange={(e) => {
                                const item = config.items.find((i) => i.id === activeItem)
                                if (!item) return

                                const endRow = Number.parseInt(e.target.value) || 2
                                if (endRow > item.startRow) {
                                  handleResizeItem(activeItem, item.endCol, endRow)
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteItem(activeItem)}
                        disabled={config.items.length <= 1}
                      >
                        Delete Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div
              ref={gridRef}
              className="relative mx-auto border rounded-lg overflow-hidden bg-card"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                gridTemplateRows: `repeat(${config.rows}, 80px)`,
                gap: `${config.gap}${config.gapUnit}`,
                maxWidth: "1000px",
                padding: `${config.gap}${config.gapUnit}`,
              }}
            >
              {/* Grid cells */}
              {Array.from({ length: config.rows }).map((_, rowIndex) =>
                Array.from({ length: config.columns }).map((_, colIndex) => {
                  const col = colIndex + 1
                  const row = rowIndex + 1

                  // Check if this cell is already occupied by an item
                  const isOccupied = config.items.some(
                    (item) => col >= item.startCol && col < item.endCol && row >= item.startRow && row < item.endRow,
                  )

                  if (!isOccupied) {
                    return <GridCell key={`cell-${col}-${row}`} col={col} row={row} onAddItem={handleAddItem} />
                  }

                  return null
                }),
              )}

              {/* Grid items */}
              {config.items.map((item) => (
                <GridItem
                  key={item.id}
                  item={item}
                  isActive={activeItem === item.id}
                  maxCols={config.columns}
                  maxRows={config.rows}
                  showName={showNamedAreas}
                  onSelect={() => setActiveItem(item.id)}
                  onResize={handleResizeItem}
                  onMove={handleMoveItem}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex justify-center gap-4 mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "desktop" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Desktop</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "tablet" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tablet</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "mobile" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mobile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div
              className={cn(
                "mx-auto border rounded-lg overflow-hidden bg-card transition-all duration-300",
                viewMode === "desktop"
                  ? "w-full max-w-4xl"
                  : viewMode === "tablet"
                    ? "w-[768px] max-w-full"
                    : "w-[375px] max-w-full",
              )}
            >
              <div
                className="grid-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: viewMode === "mobile" ? "1fr" : `repeat(${config.columns}, 1fr)`,
                  gridTemplateRows:
                    viewMode === "mobile" ? `repeat(${config.items.length}, auto)` : `repeat(${config.rows}, auto)`,
                  gap: `${config.gap}${config.gapUnit}`,
                  padding: `${config.gap}${config.gapUnit}`,
                  justifyItems: config.justifyItems,
                  alignItems: config.alignItems,
                  justifyContent: config.justifyContent,
                  alignContent: config.alignContent,
                  ...(useGridAreas && viewMode !== "mobile"
                    ? {
                        gridTemplateAreas: generateGridTemplateAreas()?.split("\n    ").join(" "),
                      }
                    : {}),
                }}
              >
                {config.items.map((item) => (
                  <div
                    key={item.id}
                    className={item.name || item.id}
                    style={{
                      backgroundColor: item.backgroundColor || "#f0f4f8",
                      padding: "1rem",
                      borderRadius: "0.375rem",
                      minHeight: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                      ...(viewMode === "mobile"
                        ? {
                            gridColumn: "1 / -1",
                          }
                        : useGridAreas
                          ? {
                              gridArea: item.name || item.id,
                            }
                          : {
                              gridColumn: `${item.startCol} / ${item.endCol}`,
                              gridRow: `${item.startRow} / ${item.endRow}`,
                            }),
                    }}
                  >
                    {item.name || item.id}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Select value={cssFormat} onValueChange={(value: "standard" | "scss") => setCssFormat(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard CSS</SelectItem>
                    <SelectItem value="scss">SCSS</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch id="add-prefixes-code" checked={addPrefixes} onCheckedChange={setAddPrefixes} />
                  <Label htmlFor="add-prefixes-code">Add Browser Prefixes</Label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => downloadCode("css")} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Download CSS</span>
                </Button>

                <Button variant="outline" onClick={() => downloadCode("html")} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Download HTML</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="css" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="css" className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                  <code>{generateCSS()}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateCSS())}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TabsContent>
              <TabsContent value="html" className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-80">
                  <code>{generateHTML()}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateHTML())}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

