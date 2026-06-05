import Link from "next/link";
import Image from "next/image";

/* ── Inline SVG Icons (Lucide-style, 24x24 viewBox) ── */

interface IconProps { className?: string; style?: React.CSSProperties }

function MoonIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function WindIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

function BookOpenIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function HeartIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function UserPlusIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

function SparklesIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function TrendingUpIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BrainIcon({ className = "w-6 h-6", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M12 18v-5" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-5 h-5", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ── Page ── */

const features = [
  {
    icon: MoonIcon,
    title: "Ritual de Sono",
    description: "Passos guiados que criam uma rotina noturna calma e consistente, preparando seu filho para uma noite tranquila.",
    color: "#9B72CF",
  },
  {
    icon: WindIcon,
    title: "Respiracao Magica",
    description: "Exercicio de respiracao com animacao suave que ajuda a crianca a relaxar corpo e mente antes de dormir.",
    color: "#4ECDC4",
  },
  {
    icon: BookOpenIcon,
    title: "Historias para Dormir",
    description: "Biblioteca de historias encantadas, narradas com carinho, que embalam e acalmam na hora de dormir.",
    color: "#F5B942",
  },
  {
    icon: HeartIcon,
    title: "Termometro Emocional",
    description: "Check-in de emocoes que ajuda seu filho a reconhecer como esta se sentindo e aprender a se regular.",
    color: "#FF8C42",
  },
];

const steps = [
  {
    icon: UserPlusIcon,
    title: "Crie o perfil",
    description: "Cadastre-se gratuitamente e adicione o perfil do seu filho com nome e idade.",
  },
  {
    icon: SparklesIcon,
    title: "Escolha o ritual",
    description: "Selecione as atividades da noite: historia, respiracao ou check-in emocional.",
  },
  {
    icon: TrendingUpIcon,
    title: "Acompanhe o progresso",
    description: "Veja a sequencia de noites e celebre cada conquista junto com seu filho.",
  },
];

const benefits = [
  {
    icon: MoonIcon,
    title: "Noites mais tranquilas",
    description: "Rotinas previsiveis ajudam a crianca a se sentir segura e adormecer com mais facilidade.",
  },
  {
    icon: HeartIcon,
    title: "Conexao afetiva",
    description: "A hora de dormir se torna um momento especial de vinculo entre pais e filhos.",
  },
  {
    icon: BrainIcon,
    title: "Regulacao emocional",
    description: "Ferramentas que ensinam a crianca a reconhecer e lidar com suas emocoes de forma saudavel.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Rotina sem estresse",
    description: "Chega de batalhas na hora de dormir. O ritual guiado faz tudo fluir naturalmente.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="relative flex flex-col min-h-[600px] lg:min-h-[700px]">
        {/* Background image */}
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
        {/* Overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(26,10,60,0.92) 0%, rgba(26,10,60,0.7) 40%, rgba(26,10,60,0.15) 70%, transparent 100%)' }}
        />
        {/* Bottom fade to blend with next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #1A0A3C, transparent)' }}
        />

        {/* Nav */}
        <nav className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-center px-6 pt-12 lg:pt-16 mb-16 lg:mb-20">
          <Image
            src="/images/logo-sono-magico.png"
            alt="Sono Magico Animadabra"
            width={200}
            height={80}
            className="select-none"
            priority
          />
          <Link
            href="/login"
            className="absolute right-6 text-sm font-body font-bold text-light-lavender hover:text-text transition-colors duration-200 cursor-pointer"
          >
            Entrar
          </Link>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 lg:pb-28 flex flex-col items-start">
          <div className="flex flex-col items-start gap-6 text-left max-w-lg">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-text">
              Transforme a hora de dormir em{" "}
              <span
                style={{
                  background: 'linear-gradient(135deg, #C8A8E9 0%, #F5B942 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                um momento magico
              </span>
            </h1>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed">
              Rituais noturnos que acalmam, conectam e preparam seu filho para sonhos felizes. Regulacao emocional e rotina de sono em um so lugar.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-pill text-white font-body font-extrabold text-base transition-all duration-200 active:scale-[0.96] shadow-glow cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
              >
                Comecar gratuitamente
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center py-3.5 px-8 rounded-pill text-light-lavender font-body font-bold border border-lavender/30 hover:border-lavender/60 hover:bg-white/[0.04] transition-all duration-200 text-sm cursor-pointer"
              >
                Ja tenho conta
              </Link>
            </div>

            <p className="text-text-muted text-xs">Gratis para comecar · Sem cartao de credito</p>
          </div>
        </div>
      </section>

      {/* ===== FUNCIONALIDADES ===== */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-accent-teal font-body font-extrabold text-xs uppercase tracking-widest mb-3">Funcionalidades</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text leading-tight">
              Tudo que seu filho precisa<br className="hidden sm:block" /> para dormir bem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-card p-6 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-11 h-11 rounded-md flex items-center justify-center mb-4"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-text text-lg mb-2">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(61,26,120,0.15), transparent)' }}
        />
        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent-teal font-body font-extrabold text-xs uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text">
              Simples de comecar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-14">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="flex flex-col items-center text-center gap-5">
                  <div className="relative">
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-gold text-deep text-xs font-heading font-bold flex items-center justify-center z-10 shadow-card">
                      {i + 1}
                    </div>
                    <div
                      className="w-16 h-16 rounded-card flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(123,79,192,0.2), rgba(155,109,212,0.1))', border: '1px solid rgba(155,114,207,0.2)' }}
                    >
                      <Icon className="w-7 h-7 text-lavender" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-text text-lg">{s.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-xs">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BENEFICIOS ===== */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-accent-teal font-body font-extrabold text-xs uppercase tracking-widest mb-3">Beneficios</p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text">
              Por que familias amam o Sono Magico
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="flex items-start gap-4 rounded-card p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-lavender/10 border border-lavender/20">
                    <Icon className="w-5 h-5 text-lavender" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text text-base mb-1.5">{b.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTO ===== */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(107,63,160,0.1), transparent 70%)' }}
        />
        <div className="relative z-10 w-full max-w-2xl">
          <div
            className="rounded-card p-8 lg:p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-accent-gold" />
              ))}
            </div>
            <blockquote className="font-body text-text text-base lg:text-lg leading-relaxed italic mb-6">
              &ldquo;Meu filho de 4 anos agora pede para fazer o ritual antes de dormir. Em 2 semanas a rotina mudou completamente. Recomendo para todas as maes e pais.&rdquo;
            </blockquote>
            <div>
              <p className="font-heading font-bold text-text text-sm">Camila R.</p>
              <p className="text-text-muted text-xs">Mae do Pedro, 4 anos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative px-6 py-20 lg:py-28 flex flex-col items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(26,10,60,0.6))' }}
        />
        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center gap-6">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight text-text">
            Noites magicas{" "}
            <span
              style={{
                background: 'linear-gradient(135deg, #C8A8E9 0%, #F5B942 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              comecam aqui
            </span>
          </h2>
          <p className="text-text-secondary text-base leading-relaxed">
            Junte-se a milhares de familias que transformaram a hora de dormir em um momento de conexao e carinho.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-10 rounded-pill text-white font-body font-extrabold text-base transition-all duration-200 active:scale-[0.96] shadow-glow cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
          >
            Comecar gratuitamente
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <p className="text-text-muted text-xs">Gratis para comecar · Sem cartao de credito</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative px-6 py-8 flex justify-center border-t border-white/[0.06]">
        <p className="text-text-muted text-xs font-body">
          Sono Magico Animadabra · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
