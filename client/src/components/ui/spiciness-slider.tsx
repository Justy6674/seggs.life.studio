import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SpicinessSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const spicinessLabels = [
  { level: 1, label: "Mild", emoji: "🥛", color: "text-green-600" },
  { level: 2, label: "Gentle", emoji: "🌸", color: "text-blue-600" },
  { level: 3, label: "Medium", emoji: "🔥", color: "text-yellow-600" },
  { level: 4, label: "Spicy", emoji: "🌶️", color: "text-orange-600" },
  { level: 5, label: "Wild", emoji: "💥", color: "text-red-600" },
];

export function SpicinessSlider({ value, onChange, className }: SpicinessSliderProps) {
  const currentLabel = spicinessLabels.find(l => l.level === value) || spicinessLabels[2];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Spiciness Level
        </label>
        <div className={cn("flex items-center space-x-2", currentLabel.color)}>
          <span className="text-lg">{currentLabel.emoji}</span>
          <span className="font-medium">{currentLabel.label}</span>
        </div>
      </div>
      
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {spicinessLabels.map((label) => (
            <div key={label.level} className="flex flex-col items-center">
              <span className="text-sm">{label.emoji}</span>
              <span>{label.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-gray-600 leading-relaxed">
        This controls the intensity level of content, conversation starters, and suggestions throughout your experience.
      </p>
    </div>
  );
}