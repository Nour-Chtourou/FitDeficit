interface CalorieRingProps {
  consumed: number;
  target: number;
}

const CalorieRing = ({ consumed, target }: CalorieRingProps) => {
  const percentage = Math.min((consumed / target) * 100, 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const remaining = target - consumed;
  const isOver = consumed > target;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth="16"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={isOver ? '#ef4444' : '#4ade80'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${isOver ? 'text-red-400' : 'text-white'}`}>
            {consumed}
          </span>
          <span className="text-gray-400 text-xs">kcal</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        {isOver ? (
          <p className="text-red-400 font-semibold">+{Math.abs(remaining)} kcal dépassé</p>
        ) : (
          <p className="text-gray-400">
            <span className="text-green-400 font-bold">{remaining}</span> kcal restants
          </p>
        )}
        <p className="text-gray-600 text-sm">Objectif : {target} kcal</p>
      </div>
    </div>
  );
};

export default CalorieRing;