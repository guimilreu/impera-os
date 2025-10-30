import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(
  ({ className, value, onChange, min = 1, max = 5, step = 0.1, ...props }, ref) => {
    const handleChange = (e) => {
      const newValue = parseFloat(e.target.value)
      onChange?.(newValue)
    }

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value || min}
          onChange={handleChange}
          className="h-3 w-full cursor-pointer appearance-none rounded-lg"
          style={{
            "--value": `${((value || min) - min) / (max - min) * 100}%`,
          }}
          ref={ref}
          {...props}
        />
        <style>{`
          input[type="range"] {
            background: rgba(255, 255, 255, 0.2);
          }
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            position: relative;
            transform: translateY(-25%);
            cursor: pointer;
            border: 3px solid hsl(var(--primary));
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            position: relative;
            transform: translateY(-25%);
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 3px solid hsl(var(--primary));
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          input[type="range"]::-webkit-slider-runnable-track {
            background: linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) var(--value), rgba(255, 255, 255, 0.2) var(--value), rgba(255, 255, 255, 0.2) 100%);
            height: 12px;
            border-radius: 6px;
          }
          input[type="range"]::-moz-range-track {
            background: rgba(255, 255, 255, 0.2);
            height: 12px;
            border-radius: 6px;
          }
          input[type="range"]::-moz-range-progress {
            background: hsl(var(--primary));
            height: 12px;
            border-radius: 6px;
          }
        `}</style>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }

