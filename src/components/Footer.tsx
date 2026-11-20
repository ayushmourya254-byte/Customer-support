export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#F8F9FA] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-display text-base font-bold tracking-tight text-slate-900">
            Linden
          </span>
          <p className="mt-1 text-xs text-slate-500">
            Customer support chatbot for clear, policy-grounded answers.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <a href="#demo" className="hover:text-slate-900 transition-colors">
            Live Demo
          </a>
          <a href="#capabilities" className="hover:text-slate-900 transition-colors">
            Capabilities
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
          <span className="text-slate-400 tabular-nums">© 2026 Linden Support</span>
        </nav>
      </div>
    </footer>
  );
}
