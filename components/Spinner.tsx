export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`} role="status" aria-label="Loading">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
