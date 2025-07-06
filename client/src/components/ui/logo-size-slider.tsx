import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";

interface LogoSizeSliderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const sizeOptions = [
  { value: "sm", label: "Small", numeric: 0 },
  { value: "md", label: "Medium", numeric: 1 },
  { value: "lg", label: "Large", numeric: 2 },
  { value: "xl", label: "Extra Large", numeric: 3 }
];

export default function LogoSizeSlider({ value, onChange, className }: LogoSizeSliderProps) {
  const [currentSize, setCurrentSize] = useState(value);
  
  // Convert string size to numeric value for slider
  const getCurrentNumericValue = (size: string) => {
    const option = sizeOptions.find(opt => opt.value === size);
    return option ? option.numeric : 1;
  };

  // Convert numeric value to string size
  const getStringSize = (numeric: number) => {
    const option = sizeOptions.find(opt => opt.numeric === numeric);
    return option ? option.value : "md";
  };

  const handleSliderChange = (values: number[]) => {
    const newSize = getStringSize(values[0]);
    setCurrentSize(newSize);
    onChange(newSize);
  };

  useEffect(() => {
    setCurrentSize(value);
  }, [value]);

  const currentOption = sizeOptions.find(opt => opt.value === currentSize);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Logo Size</Label>
        <div className="px-3">
          <Slider
            value={[getCurrentNumericValue(currentSize)]}
            onValueChange={handleSliderChange}
            max={3}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-3">
          {sizeOptions.map((option) => (
            <span key={option.value} className={currentSize === option.value ? "font-medium text-zerodna-blue" : ""}>
              {option.label}
            </span>
          ))}
        </div>
      </div>
      
      {/* Live Preview */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 mb-4">Live Preview</p>
            <div className="flex justify-center items-center min-h-[60px]">
              <Logo size={currentSize as any} />
            </div>
            <p className="text-xs text-gray-500">
              Current: {currentOption?.label} ({currentSize})
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}