import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 pt-14 pb-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A0A3C 0%, #3D1A78 100%)' }}
    >

      {/* Decorative aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.35), transparent 70%)' }}
      />

      {/* Logo */}
      <div className="w-full max-w-sm flex justify-center relative z-10">
        <div className="flex items-center gap-2 glass-card rounded-pill px-4 py-2 shadow-card">
          <span className="text-base">🌙</span>
          <span className="font-heading font-bold text-text text-sm">Animadabra</span>
        </div>
      </div>

      {/* Center content */}
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-7">

        {/* Floating monkey illustration */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-60 h-60 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(107,63,160,0.3), transparent 70%)' }}
          />
          <div className="relative w-52 h-52 rounded-full glass-card shadow-magic flex items-center justify-center animate-float">
            <span className="text-9xl select-none">🐒</span>
          </div>
          {/* Floating badges */}
          <div className="absolute -top-2 -right-2 glass-card rounded-lg px-3 py-1.5 shadow-card">
            <p className="font-heading font-bold text-text text-xs">😴 Dormiu!</p>
          </div>
          <div className="absolute -bottom-2 -left-2 glass-card rounded-lg px-3 py-1.5 shadow-card">
            <p className="font-heading font-bold text-accent-gold text-xs">🔥 15 noites</p>
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center space-y-2">
          <p className="text-lavender font-extrabold text-xs uppercase tracking-widest">Sono Mágico</p>
          <h1 className="font-heading text-4xl font-bold leading-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #C8A8E9 50%, #F5B942 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Transforme a hora<br />de dormir
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            Rituais noturnos que acalmam, conectam<br />e preparam seu filho para sonhos felizes.
          </p>
        </div>

        {/* Trust signals */}
        <div className="w-full glass-card rounded-lg p-4 flex items-center justify-around shadow-card">
          <div className="text-center">
            <p className="font-heading font-bold text-text text-xl">10k+</p>
            <p className="text-text-muted text-xs">famílias</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-heading font-bold text-text text-xl">4.8 ⭐</p>
            <p className="text-text-muted text-xs">avaliação</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-heading font-bold text-text text-xl">95%</p>
            <p className="text-text-muted text-xs">recomendam</p>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-6 bg-lavender' : 'w-1.5 bg-white/[0.12]'}`} />
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full max-w-sm space-y-3 relative z-10">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-pill text-white font-body font-extrabold text-base text-center transition-all active:scale-[0.96] shadow-glow"
          style={{ background: 'linear-gradient(135deg, #7B4FC0, #9B6DD4)' }}
        >
          🚀 Começar Gratuitamente
        </Link>
        <Link
          href="/login"
          className="block w-full py-4 px-6 rounded-pill text-light-lavender font-body font-bold text-center border-2 border-lavender/50 hover:border-lavender/80 transition-colors text-sm"
        >
          Já tenho conta
        </Link>
        <p className="text-center text-text-muted text-xs">Grátis para começar · Sem cartão de crédito</p>
      </div>
    </main>
  );
}
