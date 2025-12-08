export default function Hero() {
  return (
    <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            J & C Group
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Come to the point, go to the root
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Publishing stories that inspire young minds and foster deep thinking.
          </p>
        </div>
      </div>
    </section>
  );
}