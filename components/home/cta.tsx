export default function CTA() {
  return (
    <section className="py-32 bg-background-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">
          Your story is waiting <br /> to be told.
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Ready to stop being just another name in the crowd? Let&apos;s
          architect your brand&apos;s full potential together.
        </p>
        <div className="inline-flex p-1.5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
          <button className="bg-primary text-background-dark px-12 py-5 rounded-xl font-bold text-xl hover:bg-white transition-all">
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}
