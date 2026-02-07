import { FeedbackStats } from '../hooks/useLectureFeedback';

interface HeatmapCardProps {
  understanding: 'fully' | 'partial' | 'need_clarity';
  topic: string;
  percentage: number;
}

export function HeatmapCard({ understanding, topic, percentage }: HeatmapCardProps) {
  const getBgColor = () => {
    if (percentage < 20) return 'bg-emerald-500';
    if (percentage < 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getLabel = () => {
    if (understanding === 'fully') return '✅ Fully Understood';
    if (understanding === 'partial') return '⚠️ Partially Understood';
    return '❌ Need Clarity';
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">{topic}</h4>
        <p className="text-xs text-gray-600 mt-1">{getLabel()}</p>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBgColor()} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="mt-2 text-xs font-medium text-gray-700">{percentage.toFixed(0)}%</div>
    </div>
  );
}

interface FeedbackSummaryProps {
  stats: FeedbackStats;
}

export function FeedbackSummary({ stats }: FeedbackSummaryProps) {
  if (!stats || stats.total_responses === 0) {
    return (
      <div className="p-8 bg-white rounded-xl border border-slate-200 text-center">
        <p className="text-gray-600">No feedback submitted yet</p>
      </div>
    );
  }

  const fullyPct = (stats.fully_understanding / stats.total_responses) * 100;
  const partialPct = (stats.partial_understanding / stats.total_responses) * 100;
  const needClarityPct = (stats.need_clarity / stats.total_responses) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Summary</h3>

        <div className="space-y-4">
          {/* Fully Understanding */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">✅ Fully Understood</span>
              <span className="text-sm font-bold text-emerald-600">
                {stats.fully_understanding}/{stats.total_responses}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${fullyPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{fullyPct.toFixed(1)}%</p>
          </div>

          {/* Partial Understanding */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">⚠️ Partially Understood</span>
              <span className="text-sm font-bold text-amber-600">
                {stats.partial_understanding}/{stats.total_responses}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${partialPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{partialPct.toFixed(1)}%</p>
          </div>

          {/* Need Clarity */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">❌ Need Clarity</span>
              <span className="text-sm font-bold text-rose-600">
                {stats.need_clarity}/{stats.total_responses}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all"
                style={{ width: `${needClarityPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{needClarityPct.toFixed(1)}%</p>
          </div>
        </div>

        {/* Confusion Topics */}
        {stats.confusion_topics && stats.confusion_topics.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Difficult Topics</h4>
            <div className="flex flex-wrap gap-2">
              {stats.confusion_topics.map((topic, idx) => (
                <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
