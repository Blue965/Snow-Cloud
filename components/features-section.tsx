import {
  Rocket,
  Clock,
  DatabaseBackup,
  TerminalSquare,
  FolderTree,
  Database,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Activity,
} from "lucide-react"

const features = [
  {
    icon: Rocket,
    title: "One-click deployment",
    desc: "Push your Discord bot live in seconds. Connect a repo, hit deploy, and Snow Cloud handles the rest.",
  },
  {
    icon: Clock,
    title: "24/7 uptime",
    desc: "Your bots stay online around the clock with redundant infrastructure and automatic restarts.",
  },
  {
    icon: DatabaseBackup,
    title: "Automatic backups",
    desc: "Scheduled snapshots of your code and data, restorable to any point with a single click.",
  },
  {
    icon: TerminalSquare,
    title: "Real-time console",
    desc: "Stream live logs and run commands from an in-browser console with zero latency.",
  },
  {
    icon: FolderTree,
    title: "File manager",
    desc: "Browse, edit, and upload files directly from a fast, intuitive web-based file explorer.",
  },
  {
    icon: Database,
    title: "Database support",
    desc: "Managed PostgreSQL, MySQL, MongoDB and Redis instances provisioned in a single click.",
  },
  {
    icon: RefreshCw,
    title: "Automatic restarts",
    desc: "Crash detection instantly reboots your bot so downtime is measured in milliseconds.",
  },
  {
    icon: HardDrive,
    title: "SSD / NVMe storage",
    desc: "Ultra-fast NVMe-backed storage for lightning reads, writes, and instant cold starts.",
  },
  {
    icon: ShieldCheck,
    title: "DDoS protection",
    desc: "Enterprise-grade mitigation shields every node from volumetric and layer-7 attacks.",
  },
  {
    icon: Activity,
    title: "Live resource monitoring",
    desc: "Track CPU, RAM, and network usage in real time with beautiful, responsive graphs.",
  },
]

const runtimes = ["Node.js", "Python", "Java", "Go", "Docker"]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Everything included
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Built for performance and reliability
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Every tool a Discord developer needs to build, ship, and scale — in one elegant
            platform.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-inset ring-primary/25 transition-colors group-hover:bg-primary/20">
                <f.icon className="size-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/30 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            Deploy in your favorite language — full support for
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {runtimes.map((r) => (
              <span
                key={r}
                className="rounded-lg border border-border/70 bg-background/60 px-3 py-1.5 font-mono text-sm text-foreground"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
