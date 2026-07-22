import { CircleCheck, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "Perfect for hobby bots and getting started.",
    featured: false,
    cta: "Start for free",
    features: [
      "1 Discord bot",
      "512 MB RAM",
      "Shared NVMe storage",
      "Community support",
      "Daily automatic backups",
      "Real-time console",
    ],
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    desc: "For production bots that need power and scale.",
    featured: true,
    cta: "Upgrade to Premium",
    features: [
      "Unlimited Discord bots",
      "8 GB RAM + dedicated vCPU",
      "Priority NVMe storage",
      "24/7 priority support",
      "Hourly backups & restores",
      "Advanced DDoS protection",
      "Managed databases included",
      "Live resource monitoring",
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start free, upgrade when you scale. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 backdrop-blur ${
                plan.featured
                  ? "border-primary/50 bg-card/70 shadow-2xl shadow-primary/20"
                  : "border-border/60 bg-card/40"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  <Crown className="size-3.5" aria-hidden="true" />
                  Most popular
                </span>
              )}

              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-bold tracking-tight">{plan.price}</span>
                <span className="mb-1.5 text-muted-foreground">{plan.period}</span>
              </div>

              <Button
                className="mt-6 w-full"
                variant={plan.featured ? "default" : "outline"}
                size="lg"
              >
                {plan.cta}
              </Button>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm">
                    <CircleCheck
                      className={`size-4 shrink-0 ${plan.featured ? "text-primary" : "text-accent"}`}
                      aria-hidden="true"
                    />
                    <span className="text-foreground/90">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
