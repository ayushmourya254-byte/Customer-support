import { useState } from 'react';
import { Check } from 'lucide-react';

interface ProofAndPricingSectionProps {
  onSelectPlan: (planLabel: string) => void;
}

export function ProofAndPricingSection({ onSelectPlan }: ProofAndPricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 24,
      description: 'For small shops and early product teams handling everyday customer inquiries.',
      features: [
        'Up to 1,500 resolved chats per month',
        'Help center & policy document indexing',
        'Email inbox handoff with ticket summaries',
        '1 support workspace',
      ],
      featured: false,
    },
    {
      name: 'Growth',
      monthlyPrice: 79,
      annualPrice: 64,
      description: 'For growing support teams connecting live order, billing, and booking lookups.',
      features: [
        'Up to 10,000 resolved chats per month',
        'Order, subscription & booking status lookups',
        'Custom escalation rules and priority routing',
        'Up to 5 support workspaces',
      ],
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="border-t border-slate-200 bg-[#F8F9FA] py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Claim-to-Proof Outcome Block */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-[#1E40AF]">Customer outcome</p>
              <blockquote className="mt-3 font-display text-xl font-medium leading-snug text-slate-900 sm:text-2xl [text-wrap:balance]">
                “Moving order tracking and return questions to Linden cut our Monday morning queue
                in half without sacrificing our refund rules or tone.”
              </blockquote>
              <p className="mt-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Claire Sato</span> · Head of
                Customer Experience, Northwind Goods
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div>
                <p className="font-display text-3xl font-semibold text-slate-900 tabular-nums">
                  -62%
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Median first reply time over 90 days
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-slate-900 tabular-nums">
                  4.8 / 5
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  CSAT score across 14,200 resolved chats
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Two-Plan Pricing */}
        <div className="mt-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[#1E40AF]">Simple pricing</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 [text-wrap:balance]">
              Predictable monthly plans with no per-seat fees
            </h2>
          </div>

          <div
            role="group"
            aria-label="Billing frequency"
            className="inline-flex items-center gap-1 self-start rounded-lg bg-slate-200/75 p-1"
          >
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual (Save 18%)
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            const planLabel = `${plan.name} ($${price}/mo, ${billingCycle})`;

            return (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-xl border bg-white p-8 ${
                  plan.featured ? 'border-slate-900' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold text-slate-900">
                      {plan.name}
                    </h3>
                    <div className="text-right">
                      <span className="font-display text-3xl font-semibold text-slate-900 tabular-nums">
                        ${price}
                      </span>
                      <span className="text-sm text-slate-500"> / month</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#1E40AF]"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(planLabel)}
                  className={`mt-8 min-h-[44px] w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 whitespace-nowrap cursor-pointer ${
                    plan.featured
                      ? 'bg-[#1E40AF] text-white hover:bg-blue-900'
                      : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
