interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  color: string;
  unit: string;
}

const MacroBar = ({ label, consumed, target, color, unit }: MacroBarProps) => {
  const percentage = Math.min((consumed / target) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">
          {consumed}<span className="text-gray-500">/{target}{unit}</span>
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default MacroBar;