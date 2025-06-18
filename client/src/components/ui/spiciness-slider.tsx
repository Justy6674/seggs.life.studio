import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SpicinessSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  showLabel?: boolean;
}

const spicinessLabels = {
  1: "Mild",
  2: "Warm", 
  3: "Medium",
  4: "Hot",
  5: "Wild"
};

const spicinessColors = {
  1: "text-green-600",
  2: "text-yellow-600",
  3: "text-orange-600", 
  4: "text-red-600",
  5: "text-purple-600"
};

export function SpicinessSlider({ value, onChange, className = "", showLabel = true }: SpicinessSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Spiciness Level</Label>
          <span className={`text-sm font-semibold ${spicinessColors[value as keyof typeof spicinessColors]}`}>
            {spicinessLabels[value as keyof typeof spicinessLabels]} ({value}/5)
          </span>
        </div>
      )}
      
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Mild</span>
          <span>Wild</span>
        </div>
      </div>
    </div>
  );
}