import React, { useState, useEffect } from 'react';

interface ThinkingTimerProps {
  label?: string;
}

export function ThinkingTimer({ label = "Thinking" }: ThinkingTimerProps) {
  const [seconds, setSeconds] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>{label}... {seconds}s</span>
  );
}
