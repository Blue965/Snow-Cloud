import Image from "next/image"
import { Cpu, MemoryStick, Network } from "lucide-react"

const metrics = [
  { icon: Cpu, label: "CPU", value: "23%", bar: "w-[23%]" },
  { icon: MemoryStick, label: "RAM", value: "512 MB", bar: "w-[41%]" },
  { icon: Network, label: "Network", value: "8.4 MB/s", bar: "w-[64%]" },
]

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Live monitoring
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            A dashboard that keeps you in control
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Watch CPU, RAM, and network usage update in real time, stream logs from the live
            console, and manage every bot from one clean interface.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <m.icon className="size-4 text-primary" aria-hidden="true" />
                    {m.label}
                  </span>
                  <span className="font-mono text-sm font-medium">{m.value}</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full bg-gradient-to-r from-primary to-accent ${m.bar}`} />
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 font-mono text-xs leading-relaxed text-muted-foreground backdrop-blur">
              <p className="text-accent">$ snow deploy --prod</p>
              <p className="text-foreground/70">✓ Building container...</p>
              <p className="text-foreground/70">✓ Bot online in 1.2s</p>
              <p className="text-primary">▸ Listening on 3 guilds</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-primary/15 blur-2xl" />
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/40 shadow-2xl shadow-primary/10">
                <Image
                  src="/dashboard-preview.png"
                  alt="Snow Cloud dashboard showing real-time CPU, RAM and network graphs alongside a live console"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
