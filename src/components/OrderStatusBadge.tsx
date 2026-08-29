import type { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; dot: string }> = {
  'Requested': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  'Accepted': { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', dot: 'bg-blue-400' },
  'Picked Up': { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', dot: 'bg-purple-400' },
  'Out for Delivery': { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', dot: 'bg-cyan-400' },
  'Delivered': { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', dot: 'bg-green-400' },
  'Cancelled': { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', dot: 'bg-red-400' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium', config.bg, config.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}

export const STATUS_FLOW: OrderStatus[] = ['Requested', 'Accepted', 'Picked Up', 'Out for Delivery', 'Delivered'];

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  if (status === 'Cancelled') {
    return <OrderStatusBadge status={status} />;
  }
  const currentIdx = STATUS_FLOW.indexOf(status);
  const progress = ((currentIdx + 1) / STATUS_FLOW.length) * 100;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-saffron-700 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="flex items-center gap-1 flex-wrap">
        {STATUS_FLOW.map((s, i) => {
          const done = i <= currentIdx;
          return (
            <div key={s} className="flex items-center gap-1">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                  done ? 'bg-saffron-600/20 text-saffron-300' : 'bg-white/5 text-slate-500'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', done ? 'bg-saffron-400' : 'bg-slate-600')} />
                {s}
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={cn('w-3 h-0.5', i < currentIdx ? 'bg-saffron-500' : 'bg-white/10')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
