export default function Section({ title, children, action }) {
  return (
    <section className="mt-7 md:mt-9">
      <h2 className="px-4 md:px-8 text-[21px] md:text-2xl font-bold mb-3 md:mb-4 flex items-center justify-between">
        <span>{title}</span>
        {action}
      </h2>
      {children}
    </section>
  )
}

export function HScroll({ children }) {
  return <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 pb-1 -mx-0">{children}</div>
}
