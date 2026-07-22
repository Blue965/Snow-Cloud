"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "How fast can I deploy a Discord bot?",
    a: "Most bots go live in under two seconds. Connect your repository or upload your files, choose a runtime, and Snow Cloud builds and boots your bot automatically.",
  },
  {
    q: "Which languages and runtimes are supported?",
    a: "We natively support Node.js, Python, Java, Go, and custom Docker images. If it runs in a container, it runs on Snow Cloud.",
  },
  {
    q: "What happens if my bot crashes?",
    a: "Our crash detection instantly restarts your bot, typically within milliseconds. You can also configure custom restart policies from the dashboard.",
  },
  {
    q: "Are backups really automatic?",
    a: "Yes. Free plans get daily snapshots and Premium plans get hourly backups. Every backup is restorable to any point with a single click.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Absolutely. Plans are billed monthly with no lock-in — upgrade, downgrade, or cancel whenever you like from your account settings.",
  },
  {
    q: "Is my bot protected against attacks?",
    a: "Every node sits behind enterprise-grade DDoS protection that mitigates both volumetric and layer-7 attacks, so your bots stay online.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{faq.q}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
