import GridGenerator from "@/components/grid-generator"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-grid"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </div>
              <span className="text-lg font-semibold">CSS Grid Generator</span>
            </div>
            <nav className="ml-auto flex gap-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#templates" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Templates
              </a>
              <a href="#docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Documentation
              </a>
            </nav>
          </div>
        </header>

        <div className="container py-8 px-4 md:py-12">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">CSS Grid Generator</h1>
            <p className="text-xl text-muted-foreground">
              Create custom CSS grid layouts visually and generate production-ready code.
            </p>
          </div>

          <div className="mx-auto max-w-3xl mb-10">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">How to use</h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    1
                  </span>
                  <span className="mt-0.5">Customize the number of columns, rows, and gaps to fit your needs.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    2
                  </span>
                  <span className="mt-0.5">Click the square with + sign to add a new element to the grid.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    3
                  </span>
                  <span className="mt-0.5">Resize the DIV using the handle in the bottom right corner.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    4
                  </span>
                  <span className="mt-0.5">Drag and drop the DIV to reposition it as desired.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    5
                  </span>
                  <span className="mt-0.5">Name your grid areas and customize alignment options.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
                    6
                  </span>
                  <span className="mt-0.5">Copy the generated code or export it to use in your project.</span>
                </li>
              </ol>
            </div>
          </div>

          <GridGenerator />

          <section id="features" className="py-12 md:py-16">
            <div className="mx-auto max-w-4xl text-center mb-10">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4">Features</h2>
              <p className="text-muted-foreground">Everything you need to create perfect CSS grid layouts</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Visual Editor</h3>
                <p className="text-muted-foreground">
                  Drag, drop, and resize grid items visually without writing code.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M21 2H3v16h5v4l4-4h5l4-4V2z" />
                    <path d="M10 8h4" />
                    <path d="M10 12h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Named Grid Areas</h3>
                <p className="text-muted-foreground">
                  Create and name grid areas for more semantic and maintainable CSS.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M3 15h18" />
                    <path d="M9 3v18" />
                    <path d="M15 3v18" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Responsive Layouts</h3>
                <p className="text-muted-foreground">
                  Generate responsive grid layouts with media queries for different screen sizes.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="m7 11 2-2-2-2" />
                    <path d="M11 13h4" />
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Clean Code Output</h3>
                <p className="text-muted-foreground">
                  Generate clean, optimized CSS and HTML code ready for production.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
                    <polyline points="2.32 6.16 12 11 21.68 6.16" />
                    <line x1="12" x2="12" y1="22" y2="11" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Save & Export</h3>
                <p className="text-muted-foreground">Save your grid layouts and export them in different formats.</p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                    <line x1="16" x2="2" y1="8" y2="22" />
                    <line x1="17.5" x2="9" y1="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Customization</h3>
                <p className="text-muted-foreground">
                  Customize alignment, spacing, and other grid properties with ease.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">© 2025 CSS Grid Generator. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </ThemeProvider>
  )
}

