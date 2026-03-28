export default function Header() {
  return (
    <header className="bg-black text-[#d6a85f]">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-10 text-center md:py-16">
        <h1 className="text-3xl font-semibold tracking-[0.25em] md:text-6xl">
          HARUN ATEŞOĞLU
        </h1>

        <p className="mt-3 text-xl md:text-3xl">DESIGN STUDIO</p>

        <div className="mt-6 h-px w-40 bg-[#d6a85f]/50" />

        <p className="mt-6 text-base md:text-xl">+90 545 275 43 18</p>
      </div>
    </header>
  );
}
