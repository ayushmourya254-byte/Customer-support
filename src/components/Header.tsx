interface HeaderProps {
  onTryChat: () => void;
}

export function Header({ onTryChat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#F8F9FA]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
        >
          Linden
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#demo"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Live Demo
          </a>
          <a
            href="#capabilities"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Capabilities
          </a>
          <a
            href="#pricing"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onTryChat}
            className="min-h-[40px] rounded-lg bg-[#1E40AF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Try Live Chat
          </button>
        </div>
      </div>
    </header>
  );
}
