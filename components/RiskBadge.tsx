export type Risk = 'low' | 'medium' | 'high' | 'unknown';

const LABELS: Record<Risk, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  unknown: 'Unknown',
};

const CLASSES: Record<Risk, string> = {
  low: 'bg-risk-low-bg text-risk-low-text',
  medium: 'bg-risk-medium-bg text-risk-medium-text',
  high: 'bg-risk-high-bg text-risk-high-text',
  unknown: 'bg-risk-unknown-bg text-risk-unknown-text',
};

export function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${CLASSES[risk]}`}>
      {LABELS[risk]}
    </span>
  );
}
