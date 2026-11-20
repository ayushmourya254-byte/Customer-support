import { FormEvent, useEffect, useState } from 'react';

interface ContactSectionProps {
  selectedPlan: string;
}

export function ContactSection({ selectedPlan }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState('Under 1,500 tickets / mo');
  const [plan, setPlan] = useState(selectedPlan);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      setPlan(selectedPlan);
    }
  }, [selectedPlan]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }

    if (message.trim().length < 5) {
      setError('Please add a short note about what your customers ask most.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, volume, plan, message }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        ticketId?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Could not submit your request.');
      }

      setTicketId(data.ticketId || 'SUP-10042');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="border-t border-slate-200 bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#1E40AF]">Get started</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 [text-wrap:balance]">
              Launch Linden on your help site in a day
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Share your help center URL or common customer questions. Our team configures a live
              sandbox tailored to your policies so you can test every answer before publishing.
            </p>
            <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <p>Direct email: support@lindensupport.example</p>
              <p>Setup response: within 1 business day</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-[#F8F9FA] p-7 sm:p-8">
              {ticketId ? (
                <div className="space-y-3 py-4">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Request received
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Your setup request has been logged under reference{' '}
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {ticketId}
                    </span>
                    . We will reply to <span className="font-medium text-slate-900">{email}</span>{' '}
                    within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketId(null);
                      setMessage('');
                    }}
                    className="mt-2 min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-slate-800">
                        Your name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-slate-800">
                        Work email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-volume" className="block text-sm font-medium text-slate-800">
                        Monthly ticket volume
                      </label>
                      <select
                        id="contact-volume"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-[#1E40AF] focus:outline-none"
                      >
                        <option>Under 1,500 tickets / mo</option>
                        <option>1,500 – 10,000 tickets / mo</option>
                        <option>10,000+ tickets / mo</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-plan" className="block text-sm font-medium text-slate-800">
                        Plan interest
                      </label>
                      <input
                        id="contact-plan"
                        type="text"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        placeholder="Starter or Growth"
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-slate-800">
                      What do customers ask most?
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Order status lookups, return eligibility, or billing updates..."
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-sm font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-[44px] rounded-lg bg-[#1E40AF] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-900 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Chatbot Setup'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
