import { Cloud, MessageCircle, Mail, Globe, Send } from "lucide-react"

const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Dashboard", "Changelog", "Status"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "Guides", "Runtimes", "CLI"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact", "Partners"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Acceptable Use", "SLA", "Cookies"],
  },
]

const socials = [
  { icon: MessageCircle, label: "Discord" },
  { icon: Send, label: "Telegram" },
  { icon: Globe, label: "Website" },
  { icon: Mail, label: "Email" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-inset ring-primary/30">
                <Cloud className="size-5 text-primary" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">Snow Cloud</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium cloud hosting built for Discord developers. Fast, reliable, and effortless.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <s.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Snow Cloud. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Crafted for Discord developers worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
