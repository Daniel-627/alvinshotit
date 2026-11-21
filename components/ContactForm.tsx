"use client";

import { useState } from "react";

export default function ContactForm({ email, whatsapp, service }: { email?: string; whatsapp?: string; service?: string }) {
  const [f, setF] = useState({ name: "", type: service || "", date: "", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const text = `Hi Alvin, I'm ${f.name}. I'd like to book: ${f.type}${f.date ? ` on ${f.date}` : ""}.\n\n${f.message}`;

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <input className="field" placeholder="Your name" value={f.name} onChange={set("name")} required />
      <input className="field" placeholder="What are we shooting? (portrait, wedding, event…)" value={f.type} onChange={set("type")} />
      <input className="field" placeholder="Date, if you have one" value={f.date} onChange={set("date")} />
      <textarea className="field min-h-40" placeholder="Tell me more" value={f.message} onChange={set("message")} />
      <div className="flex flex-wrap gap-3 pt-2">
        {whatsapp && <a className="btn" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Send on WhatsApp</a>}
        {email && <a className="btn-ghost" href={`mailto:${email}?subject=${encodeURIComponent("Booking enquiry")}&body=${encodeURIComponent(text)}`}>Send by email</a>}
        {!whatsapp && !email && <p className="text-sm text-mute">Add an email or WhatsApp number in Sanity Studio → Site settings to enable sending.</p>}
      </div>
    </form>
  );
}
