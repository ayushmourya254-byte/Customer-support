import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { ArrowUp, RotateCcw, UserCheck, AlertCircle } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ChatMessage, ScenarioId } from '../types/support';

interface SupportChatWidgetProps {
  inputRef: RefObject<HTMLInputElement | null>;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createInitialMessage(scenarioId: ScenarioId): ChatMessage {
  return {
    id: `greeting-${scenarioId}-${Date.now()}`,
    role: 'assistant',
    content: SCENARIOS[scenarioId].greeting,
    timestamp: formatTime(new Date()),
  };
}

export function SupportChatWidget({ inputRef }: SupportChatWidgetProps) {
  const [scenario, setScenario] = useState<ScenarioId>('retail');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createInitialMessage('retail'),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handoffEmail, setHandoffEmail] = useState('');
  const [handoffSummary, setHandoffSummary] = useState<string | null>(null);
  const [handoffStatus, setHandoffStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [handoffTicketId, setHandoffTicketId] = useState<string | null>(null);
  const [handoffError, setHandoffError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading, handoffSummary]);

  const activeScenario = SCENARIOS[scenario];

  function handleScenarioChange(nextScenario: ScenarioId) {
    if (nextScenario === scenario) return;
    setScenario(nextScenario);
    setMessages([createInitialMessage(nextScenario)]);
    setErrorMessage(null);
    setHandoffSummary(null);
    setHandoffStatus('idle');
    setHandoffTicketId(null);
    setHandoffError(null);
  }

  function handleReset() {
    setMessages([createInitialMessage(scenario)]);
    setInputValue('');
    setErrorMessage(null);
    setHandoffSummary(null);
    setHandoffStatus('idle');
    setHandoffTicketId(null);
    setHandoffError(null);
    inputRef.current?.focus();
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: formatTime(new Date()),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        shouldEscalate?: boolean;
        handoffSummary?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Could not reach support assistant.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'How else can I assist you today?',
        timestamp: formatTime(new Date()),
        shouldEscalate: Boolean(data.shouldEscalate),
        handoffSummary: data.handoffSummary,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.shouldEscalate) {
        setHandoffSummary(
          data.handoffSummary || 'Customer requested a specialist follow-up from live chat.'
        );
        setHandoffStatus('idle');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send message.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(inputValue);
  }

  function openManualHandoff() {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    setHandoffSummary(
      lastUser
        ? `Follow-up requested on: "${lastUser.content.slice(0, 100)}"`
        : `Customer requested to speak with a ${activeScenario.companyName} team member.`
    );
    setHandoffStatus('idle');
    setHandoffError(null);
  }

  async function handleHandoffSubmit(e: FormEvent) {
    e.preventDefault();
    const email = handoffEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setHandoffError('Enter a valid email address for the transcript.');
      return;
    }

    setHandoffError(null);
    setHandoffStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Live Chat Visitor',
          email,
          plan: activeScenario.label,
          message: handoffSummary || 'Support chat escalation request',
        }),
      });
      const data = (await response.json()) as { ok?: boolean; ticketId?: string; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Could not create handoff ticket.');
      }
      setHandoffTicketId(data.ticketId || 'SUP-10420');
      setHandoffStatus('sent');
    } catch (err: unknown) {
      setHandoffError(err instanceof Error ? err.message : 'Failed to send handoff.');
      setHandoffStatus('idle');
    }
  }

  const showStarterChips = messages.length <= 1 && !isLoading;

  return (
    <div
      className="flex h-full min-h-[540px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      aria-label="Interactive customer support chatbot"
    >
      {/* Chat Header & Scenario Switcher */}
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900">
              {activeScenario.companyName} Support
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{activeScenario.policyNote}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openManualHandoff}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Human agent</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset conversation"
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Interactive Scenario Tabs */}
        <div
          role="tablist"
          aria-label="Support context presets"
          className="mt-3.5 flex items-center gap-1 rounded-lg bg-slate-100 p-1"
        >
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => {
            const isActive = scenario === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => handleScenarioChange(id)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {SCENARIOS[id].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation History */}
      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-4 overflow-y-auto bg-[#F8F9FA] px-5 py-5"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1E40AF] text-white'
                    : 'border border-slate-200 bg-white text-slate-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
              <span className="mt-1.5 font-mono text-[11px] text-slate-400 tabular-nums">
                {isUser ? 'You' : 'Linden'} · {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              Checking policy and order details...
            </div>
          </div>
        )}

        {showStarterChips && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Try a common customer question:
            </p>
            <div className="flex flex-wrap gap-2">
              {activeScenario.starterQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(q)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-blue-800 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {handoffSummary && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xs font-semibold text-slate-900">
                  Escalate to Support Specialist
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Summary: {handoffSummary}
                </p>
              </div>
            </div>

            {handoffStatus === 'sent' && handoffTicketId ? (
              <p className="mt-3 text-xs font-medium text-slate-800">
                Ticket <span className="font-mono tabular-nums">{handoffTicketId}</span> created. A
                specialist will reply to {handoffEmail} shortly.
              </p>
            ) : (
              <form onSubmit={handleHandoffSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={handoffEmail}
                  onChange={(e) => setHandoffEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email address for human follow-up"
                  className="min-h-[40px] flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={handoffStatus === 'submitting'}
                  className="min-h-[40px] rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {handoffStatus === 'submitting' ? 'Sending...' : 'Send to Inbox'}
                </button>
              </form>
            )}
            {handoffError && <p className="mt-2 text-xs text-red-700">{handoffError}</p>}
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium">Unable to generate reply</p>
              <p className="mt-0.5 text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask ${activeScenario.companyName} support anything...`}
          aria-label="Customer support message"
          disabled={isLoading}
          className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-[#1E40AF] px-4 text-sm font-medium text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 cursor-pointer"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
