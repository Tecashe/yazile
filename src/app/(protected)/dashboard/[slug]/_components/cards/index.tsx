'use client'

import FlipCardGrid from "@/components/global/desktopcards/FlipCardGrid";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const DesktopCards = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Only show theme toggle after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FlipCardGrid />
    </div>
  );
};

export default DesktopCards;
