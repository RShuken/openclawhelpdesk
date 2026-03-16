export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} OpenClaw Install. All rights reserved.</p>
          <a
            href="https://openclawinstall.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-purple-400 transition-colors"
          >
            Powered by OpenClaw Install
          </a>
        </div>
      </div>
    </footer>
  )
}
