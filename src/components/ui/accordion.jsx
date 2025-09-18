// src/components/ui/accordion.jsx
import React, { useState } from "react"

export function Accordion({ children }) {
  return <div className="border rounded-lg divide-y">{children}</div>
}

export function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="w-full flex justify-between items-center p-3 font-medium text-left"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-3 text-sm text-gray-700">{children}</div>}
    </div>
  )
}
