import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box } from "@mui/material";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  buffer?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  buffer = 5,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = items.length * itemHeight;

  // We need to know the actual pixel height of the container if it's a string (like "70vh")
  const [pixelContainerHeight, setPixelContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setPixelContainerHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + pixelContainerHeight) / itemHeight) + buffer
    );
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, items.length, pixelContainerHeight, buffer]);

  const visibleItems = items.slice(startIndex, endIndex);
  const translateY = startIndex * itemHeight;

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      sx={{
        height: containerHeight,
        overflowY: "auto",
        position: "relative",
        // Smooth scroll for better UX
        scrollBehavior: "auto",
      }}
    >
      <Box sx={{ height: totalHeight, width: "100%", position: "relative" }}>
        <Box
          sx={{
            transform: `translateY(${translateY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </Box>
      </Box>
    </Box>
  );
}
