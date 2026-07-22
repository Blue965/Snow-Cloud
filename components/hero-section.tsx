import Image from "next/image"
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const badges = [
  { icon: Zap, label: "One-click deploy" },
  { icon: ShieldCheck, label: "DDoS protected" },
  { icon: Sparkles, label: "99.99% uptime" },
]

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <div className="h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[140px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Now hosting 40,000+ Discord bots
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Deploy Discord bots at the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              speed of light
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0 sm:text-lg">
            Snow Cloud is the premium cloud hosting platform built for Discord developers.
            One-click deployment, blazing NVMe storage, and 24/7 uptime — so your bots never
            sleep.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/25 sm:w-auto">
              Start hosting free
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full border-border bg-card/40 sm:w-auto">
              View documentation
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <b.icon className="size-4 text-primary" aria-hidden="true" />
                {b.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-accent/10 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 shadow-2xl shadow-primary/10 backdrop-blur">
            <Image
              src="/hero-cloud.png"
              alt="Snow Cloud infrastructure visualization showing glowing cloud servers and network nodes"
              width={960}
              height={720}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
