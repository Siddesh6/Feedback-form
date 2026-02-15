
import { Header } from '@/components/layout/header';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                About OpinionLoop
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                OpinionLoop is a comprehensive platform designed to turn opinions into meaningful insights. We empower you to collect structured feedback, analyze responses instantly, and make smarter decisions with confidence. Our intuitive tools make it easy to create dynamic forms, visualize real-time analytics, and leverage AI for deeper understanding.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
