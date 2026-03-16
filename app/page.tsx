import Link from 'next/link'

const cards = [
  {
    title: 'Documentation',
    description: 'Browse our knowledge base for guides, tutorials, and reference material on your OpenClaw setup.',
    href: '/docs',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: 'Q&A',
    description: 'Ask questions and find answers from the OpenClaw community. Search existing topics or start a new one.',
    href: '/q',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: 'Support',
    description: 'Need direct help? Submit a support ticket and our team will get back to you as soon as possible.',
    href: '/support',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796l-3.448 4.138m5.716-.37l-4.138 3.448M7.288 19.67a9.014 9.014 0 01-2.958-2.958m0 0l4.138-3.448m-4.138 3.448a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0a3.736 3.736 0 01.88-1.388 3.737 3.737 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 15.34l3.448-4.138m0 0a3.765 3.765 0 002.528 0m-2.528 0l4.138 3.448m-1.87-5.716l3.448 4.138m-3.448-4.138a3.765 3.765 0 000-2.528" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
          Get Help With Your{' '}
          <span className="text-purple-400">OpenClaw</span> Setup
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Browse documentation, ask the community, or reach out to our support team.
          We are here to help you get the most out of your AI assistant.
        </p>
      </section>

      {/* Cards */}
      <section className="grid sm:grid-cols-3 gap-6 pb-16 sm:pb-24">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card group hover:border-purple-500/50 transition-colors"
          >
            <div className="text-purple-400 mb-4 group-hover:text-fuchsia-400 transition-colors">
              {card.icon}
            </div>
            <h2 className="text-lg font-semibold text-zinc-50 mb-2">{card.title}</h2>
            <p className="text-sm text-zinc-400">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
