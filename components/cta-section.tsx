import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/50 px-6 py-16 text-center backdrop-blur sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div className="h-72 w-72 rounded-full bg-primary/25 blur-[120px]" />
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Ready to give your bots a home in the cloud?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Join thousands of developers running reliable, lightning-fast Discord bots on Snow
            Cloud. Deploy your first bot free — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 shadow-lg shadow-primary/25 sm:w-auto">
              Start hosting free
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full border-border bg-background/40 sm:w-auto">
              Talk to sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
