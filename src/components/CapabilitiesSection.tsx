import { CAPABILITIES } from '../data/scenarios';

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="border-t border-slate-200 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#1E40AF]">How Linden works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
            Accurate support answers grounded in your actual policies
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Instead of improvising generic replies, Linden reads your order statuses, refund
            windows, and billing docs before responding to a customer.
          </p>
        </div>

        {/* Asymmetric 3-Column Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div
              key={item.index}
              className={`flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8F9FA] p-7 ${
                item.wide ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  <span className="mr-2 font-mono text-sm font-medium text-slate-500 tabular-nums">
                    {item.index}
                  </span>
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
              <p className="mt-6 border-t border-slate-200 pt-4 text-xs font-medium text-slate-700">
                {item.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
