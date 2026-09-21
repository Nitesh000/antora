import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="group/layout relative z-10 flex min-h-svh flex-col bg-background has-data-[slot=designer]:h-svh has-data-[slot=designer]:overflow-hidden"
    >
      <div className="flex justify-center items-center p-2 bg-card">
        <p className="font-mono tracking-wider">
          The product currently in development phase.
        </p>
      </div>
      <SiteHeader />
      <main className="flex flex-col flex-1 min-h-0">{children}</main>
      <SiteFooter />
    </div>
  )
}
