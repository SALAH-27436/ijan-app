// src/components/ui/card.jsx
import React from "react"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm p-4 ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={`mb-2 font-semibold ${className || ""}`}>{children}</div>
}

export function CardContent({ className, children }) {
  return <div className={`text-sm text-gray-700 ${className || ""}`}>{children}</div>
}

export function CardFooter({ className, children }) {
  return <div className={`mt-2 ${className || ""}`}>{children}</div>
}
