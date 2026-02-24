export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold font-space-grotesk mb-10">
        Engineered for Performance
      </h1>
      <div className="h-[200vh] w-full flex flex-col items-center pt-20 text-gray-500">
        <p>↓ Haz scroll hacia abajo para probar la inercia ↓</p>
      </div>
    </main>
  );
}