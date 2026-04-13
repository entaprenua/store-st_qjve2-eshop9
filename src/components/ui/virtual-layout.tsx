import {
  createVirtualizer,
  type VirtualItem,
} from "@tanstack/solid-virtual"
import {
  splitProps,
  For,
  type JSX,
  type Accessor,
} from "solid-js"
import { cn } from "~/lib/utils"

type LayoutMode = "col" | "vertical-grid" | "row" | "horizontal-grid"

type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

const GAP_PX: Record<GapSize, number> = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
}

type VirtualLayoutProps<T> = {
  data: T[]
  layout?: LayoutMode
  columns?: ColumnCount
  gap?: GapSize
  itemHeight?: number
  itemWidth?: number
  height?: string
  width?: string
  overscan?: number
  windowScroll?: boolean
  class?: string
  children: (item: T, index: Accessor<number>) => JSX.Element
}

function VirtualLayout<T>(props: VirtualLayoutProps<T>) {
  const [local] = splitProps(props, [
    "data",
    "layout",
    "columns",
    "gap",
    "itemHeight",
    "itemWidth",
    "height",
    "width",
    "overscan",
    "windowScroll",
    "class",
    "children",
  ])

  let scrollElement: HTMLDivElement | undefined

  const mode = () => local.layout ?? "col"
  const columns = () => local.columns ?? 1
  const gapPx = () => GAP_PX[local.gap as GapSize ?? 4] ?? 16
  const estimatedHeight = () => local.itemHeight ?? 100
  const estimatedWidth = () => local.itemWidth ?? 100
  const overscanCount = () => local.overscan ?? 5
  
  const isVertical = () => mode() === "col" || mode() === "vertical-grid"
  const isGrid = () => mode() === "vertical-grid" || mode() === "horizontal-grid"

  const rowCount = () => {
    if (isGrid()) {
      return Math.ceil(local.data.length / columns())
    }
    return local.data.length
  }

  const virtualizer = createVirtualizer({
    get count() {
      return rowCount()
    },
    getScrollElement: () => (local.windowScroll ? null : scrollElement ?? null),
    estimateSize: () => isVertical() ? estimatedHeight() : estimatedWidth(),
    overscan: overscanCount(),
    horizontal: !isVertical(),
  })

  const virtualItems = () => virtualizer.getVirtualItems()

  const getRowData = (virtualItem: VirtualItem) => {
    if (isGrid()) {
      const startIdx = virtualItem.index * columns()
      return local.data.slice(startIdx, startIdx + columns())
    }
    return local.data[virtualItem.index]
  }

  const resolveIndex = (virtualItem: VirtualItem, columnIdx = 0) => {
    if (isGrid()) {
      return virtualItem.index * columns() + columnIdx
    }
    return virtualItem.index
  }

  const scrollContainerStyle = (): JSX.CSSProperties => ({
    height: local.height ?? "100%",
    width: local.width ?? "100%",
    position: "relative" as const,
    ...(isVertical() ? {} : { display: "flex", "overflow-x": "auto" }),
  })

  const innerStyle = (): JSX.CSSProperties => {
    const totalSize = virtualizer.getTotalSize()
    if (isVertical()) {
      return { height: `${totalSize}px`, width: "100%", position: "relative" }
    }
    return { height: "100%", width: `${totalSize}px`, position: "relative", display: "flex" }
  }

  const rowContainerStyle = (): JSX.CSSProperties => {
    if (isGrid() && isVertical()) {
      return {
        display: "grid",
        "grid-template-columns": `repeat(${columns()}, 1fr)`,
        gap: `${gapPx()}px`,
        width: "100%",
      }
    }
    return {
      display: "flex",
      "flex-direction": isVertical() ? "column" : "row",
      gap: `${gapPx()}px`,
    }
  }

  const virtualItemStyle = (item: VirtualItem): JSX.CSSProperties => {
    const translate = isVertical() 
      ? `translateY(${item.start}px)` 
      : `translateX(${item.start}px)`
    
    return {
      position: "absolute",
      top: 0,
      left: 0,
      transform: translate,
      ...(isVertical() 
        ? { width: isGrid() ? "100%" : undefined, height: `${item.size}px` } 
        : { height: "100%", width: `${item.size}px` }
      ),
    }
  }

  return (
    <div
      ref={scrollElement}
      class={cn(
        "overflow-auto",
        isVertical() ? "overflow-y-auto" : "overflow-x-auto",
        local.class
      )}
      style={scrollContainerStyle()}
    >
      <div style={innerStyle()}>
        <For each={virtualItems()}>
          {(virtualItem) => {
            const rowData = getRowData(virtualItem)

            if (isGrid() && Array.isArray(rowData)) {
              return (
                <div
                  style={virtualItemStyle(virtualItem)}
                  data-index={virtualItem.index}
                  ref={(el) => virtualizer.measureElement(el)}
                >
                  <div style={rowContainerStyle()}>
                    <For each={rowData}>
                      {(item, columnIdx) => (
                        <div style={{ height: "100%" }}>
                          {local.children(item, () => resolveIndex(virtualItem, columnIdx()))}
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )
            }

            return (
              <div
                style={virtualItemStyle(virtualItem)}
                data-index={virtualItem.index}
                ref={(el) => virtualizer.measureElement(el)}
              >
                {local.children(rowData as T, () => resolveIndex(virtualItem))}
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export { VirtualLayout }

export type { VirtualLayoutProps, LayoutMode, ColumnCount, GapSize }
