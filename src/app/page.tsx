import { ArrowRight, Bot, BarChart, CheckSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: 'Dynamic Form Builder',
    description: 'Create custom feedback forms with various question types using a simple, intuitive interface.',
    image_id: 'feature-1',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Real-time Analytics',
    description: 'Visualize feedback data with interactive charts and graphs as it comes in.',
    image_id: 'feature-2',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Insights',
    description: 'Leverage AI for sentiment analysis and get smart suggestions to drive improvement.',
    image_id: 'feature-3',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Anonymous & Secure',
    description: 'Build trust with respondents through secure, anonymous feedback options.',
  },
];

const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn opinions into meaningful insights.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Collect structured feedback, analyze responses instantly, and make smarter decisions with confidence.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#features">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
               {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width={600}
                  height={400}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              )}
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From building beautiful forms to uncovering deep insights with AI, our platform is designed to make feedback your most valuable asset.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature, index) => {
                const featureImage = PlaceHolderImages.find(img => img.id === feature.image_id);
                return (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="mb-4">{feature.icon}</div>
                      <CardTitle className="font-headline">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                       {featureImage && (
                        <div className="mt-4">
                            <Image
                            src={featureImage.imageUrl}
                            width={400}
                            height={300}
                            alt={featureImage.description}
                            data-ai-hint={featureImage.imageHint}
                            className="rounded-lg object-cover"
                            />
                        </div>
                        )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
