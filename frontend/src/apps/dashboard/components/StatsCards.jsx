export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total',
      value: stats.total,
      textColor: 'text-white',
      bg: 'bg-gray-800',
      icon: '📊',
    },
    {
      label: 'Pending',
      value: stats.pending,
      textColor: 'text-yellow-400',
      bg: 'bg-yellow-900/20 border border-yellow-900',
      icon: '⏳',
    },
    {
      label: 'Assigned',
      value: stats.assigned,
      textColor: 'text-blue-400',
      bg: 'bg-blue-900/20 border border-blue-900',
      icon: '🚑',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      textColor: 'text-green-400',
      bg: 'bg-green-900/20 border border-green-900',
      icon: '✅',
    },
    {
      label: 'Critical',
      value: stats.critical,
      textColor: 'text-red-400',
      bg: 'bg-red-900/20 border border-red-900',
      icon: '🔴',
    },
    {
      label: 'High',
      value: stats.high,
      textColor: 'text-orange-400',
      bg: 'bg-orange-900/20 border border-orange-900',
      icon: '🟠',
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {cards.map(({ label, value, textColor, bg, icon }) => (
        <div key={label} className={`${bg} rounded-xl px-3 py-2`}>
          <div className={`text-2xl font-bold leading-none ${textColor}`}>{value}</div>
          <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
            <span>{icon}</span>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
