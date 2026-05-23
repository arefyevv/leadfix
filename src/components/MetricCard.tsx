type MetricCardProps = {
  value: string;
  label: string;
  accent?: boolean;
};

export function MetricCard({ value, label, accent = false }: MetricCardProps) {
  return (
    <div className={accent ? "metric metric--score" : "metric"}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
