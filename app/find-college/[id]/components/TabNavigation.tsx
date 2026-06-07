"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TabKey } from "../../types";
import { TAB_DEFINITIONS } from "../constants";

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const updateTabScrollState = useCallback(() => {
    const container = tabsScrollRef.current;
    const nav = tabsNavRef.current;
    const firstTab = nav?.firstElementChild as HTMLElement | null;
    const lastTab = nav?.lastElementChild as HTMLElement | null;
    if (!container || !nav || !firstTab || !lastTab) {
      setIsTabsOverflowing(false);
      setCanScrollTabsLeft(false);
      setCanScrollTabsRight(false);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const firstTabRect = firstTab.getBoundingClientRect();
    const lastTabRect = lastTab.getBoundingClientRect();
    const leftOverflow = firstTabRect.left < containerRect.left - 4;
    const rightOverflow = lastTabRect.right > containerRect.right + 4;
    setIsTabsOverflowing(leftOverflow || rightOverflow);
    setCanScrollTabsLeft(leftOverflow);
    setCanScrollTabsRight(rightOverflow);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const step = Math.max(180, Math.floor(container.clientWidth * 0.5));
    container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    updateTabScrollState();
    const handleScroll = () => updateTabScrollState();
    const handleResize = () => updateTabScrollState();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateTabScrollState());
      observer.observe(container);
      if (tabsNavRef.current) observer.observe(tabsNavRef.current);
    }
    requestAnimationFrame(() => updateTabScrollState());
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [updateTabScrollState]);

  useEffect(() => {
    updateTabScrollState();
  }, [activeTab, updateTabScrollState]);

  return (
    <div className="sticky top-0 z-40 border-b border-t border-gray-100 bg-white shadow-gray-100/50">
      <div className="relative overflow-hidden px-6 md:px-12 lg:px-24 xl:px-32">
        {isTabsOverflowing && canScrollTabsLeft && (
          <button type="button" onClick={() => scrollTabs("left")} className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50 md:left-12 lg:left-24 xl:left-32" aria-label="Scroll tabs left">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {isTabsOverflowing && canScrollTabsRight && (
          <button type="button" onClick={() => scrollTabs("right")} className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50 md:right-12 lg:right-24 xl:right-32" aria-label="Scroll tabs right">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        <div ref={tabsScrollRef} className={`overflow-x-auto scroll-smooth ${canScrollTabsLeft ? "pl-8 sm:pl-9" : "pl-0"} pr-8 sm:pr-9 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
          <nav ref={tabsNavRef} className="flex w-max space-x-8 whitespace-nowrap pr-6 md:pr-12 lg:pr-24 xl:pr-32">
            {TAB_DEFINITIONS.map(([key, label]) => {
              const selected = activeTab === key;
              return (
                <button key={key} onClick={() => onTabChange(key)} className={`shrink-0 border-b-2 bg-white py-4 text-[15px] ${selected ? "border-brand-blue font-bold text-gray-900" : "border-transparent font-semibold text-gray-500 hover:text-gray-900"}`}>
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
