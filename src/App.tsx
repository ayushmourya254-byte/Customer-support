import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { SupportChatWidget } from './components/SupportChatWidget';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { ProofAndPricingSection } from './components/ProofAndPricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlan, setSelectedPlan] = useState('Growth ($64/mo, annual)');

  function handleTryChat() {
    const demoEl = document.getElementById('demo');
    demoEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 250);
  }

  function handleSelectPlan(planLabel: string) {
    setSelectedPlan(planLabel);
    const contactEl = document.getElementById('contact');
    contactEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
      <Header onTryChat={handleTryChat} />

      <main>
        {/* Hero + Interactive Live Chatbot Split */}
        <section id="demo" className="py-12 lg:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Value Proposition */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <p className="text-sm font-medium text-[#1E40AF]">Customer support chatbot</p>
                  <h1 className="mt-3 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-slate-900 [text-wrap:balance]">
                    Instant answers for every customer question
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
                    Linden resolves order tracking, billing updates, and booking changes in plain
                    language—and hands edge cases to your team with a clear summary.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={handleTryChat}
                      className="min-h-[44px] rounded-lg bg-[#1E40AF] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 whitespace-nowrap cursor-pointer"
                    >
                      Ask a Support Question
                    </button>
                    <a
                      href="#capabilities"
                      className="min-h-[44px] inline-flex items-center px-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap"
                    >
                      See capabilities
                    </a>
                  </div>
                </div>

                <div className="mt-10 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
                  Test the live assistant on the right across three industries: retail orders, SaaS
                  billing, or studio bookings.
                </div>
              </div>

              {/* Right Interactive Chatbot Panel */}
              <div className="lg:col-span-7">
                <SupportChatWidget inputRef={chatInputRef} />
              </div>
            </div>

            {/* Full-Width 4-Column Metric Strip */}
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 md:grid-cols-4">
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 tabular-nums">
                  &lt; 2s
                </p>
                <p className="mt-1 text-xs text-slate-600">Typical first response time</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 tabular-nums">
                  74%
                </p>
                <p className="mt-1 text-xs text-slate-600">Questions resolved without handoff</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 tabular-nums">
                  24 / 7
                </p>
                <p className="mt-1 text-xs text-slate-600">Coverage across all time zones</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 tabular-nums">
                  1-Click
                </p>
                <p className="mt-1 text-xs text-slate-600">Transcript handoff to support inbox</p>
              </div>
            </div>
          </div>
        </section>

        <CapabilitiesSection />
        <ProofAndPricingSection onSelectPlan={handleSelectPlan} />
        <ContactSection selectedPlan={selectedPlan} />
      </main>

      <Footer />
    </div>
  );
}
