import Image from "next/image";

export default function Details() {
  return (
    <section className="py-32 relative bg-background-dark" id="process">
      <div className="max-w-4xl mx-auto px-4 relative">
        <div className="text-center mb-32">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">
            The Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">
            How We Transcend the Ordinary
          </h2>
        </div>
        <div className="relative">
        <div className="narrative-line hidden md:block"></div>
          <div className="relative mb-40 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 md:text-right">
              <span className="text-6xl font-black text-white/5 block mb-4">
                01
              </span>
              <h3 className="text-3xl font-bold mb-4 text-white">The Genesis</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Every masterpiece begins with a spark. We create the opportunity for you to find 
                that spark,  to find the unique story that needs to be
                told. It&apos;s not a consultation; it&apos;s an awakening. Awakening creativity.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                <Image
                  alt="Abstract spark concept"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  src="https://bw0vyo4i33.ufs.sh/f/ELXzaNpHGwv9YkBUJzqc3nwxryWvUVthRK6AbE2MZduzICc7"
                />
                
              </div>
            </div>
          </div>
          <div className="relative mb-40 flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 md:text-left">
              <span className="text-6xl font-black text-white/5 block mb-4">
                02
              </span>
              <h3 className="text-3xl font-bold mb-4 text-white">
                Digital Alchemy
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our artisans transform raw vision into refined digital gold. We
                meticulously craft every pixel and interaction to ensure your
                brand&apos;s essence is felt in every touchpoint.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                <Image
                  alt="Metaphorical design process"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  src="https://bw0vyo4i33.ufs.sh/f/ELXzaNpHGwv9RjLCsq5W96TEPnJtmYbZHVqLzNsdQAixvF7o"
                />
                
              </div>
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 md:text-right">
              <span className="text-6xl font-black text-white/5 block mb-4">
                03
              </span>
              <h3 className="text-3xl font-bold mb-4 text-white">The Ascent</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Delivery is just the beginning. We launch your brand into the
                digital stratosphere, equipped with the tools and the presence
                to command attention and inspire action.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                <Image
                  alt="Abstract launch visual"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  src="https://bw0vyo4i33.ufs.sh/f/ELXzaNpHGwv9kHVNrntJeq90HAuryBz3mRxwFZsc2df4ojiV"
                />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
