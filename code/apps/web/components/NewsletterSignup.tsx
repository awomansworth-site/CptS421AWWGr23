"use client";

import { useState, useRef } from "react";

type State = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showName, setShowName] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, name: name.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
        setName("");
      } else {
        setState("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again later.");
    }
  }

  if (state === "success") {
    return (
      <section className="w-full py-10 px-4">
        <div
          className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg border border-orange-100 p-8 text-center"
          style={{ animation: "fadeSlideIn 0.5s ease both" }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#004080] mb-2">You&apos;re subscribed!</h2>
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-400 mt-3">
            We&apos;ll keep you updated with stories, events, and news from A Woman&apos;s Worth.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-4">
      <div
        className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg border border-orange-100 overflow-hidden"
        style={{ animation: "fadeSlideIn 0.45s ease both" }}
      >
        {/* Accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(to right, #f7941D, #F79520)" }}
        />

        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#004080] mb-1">Stay Updated</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Get stories, events, and updates from A Woman&apos;s Worth directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="Your email address"
                required
                disabled={state === "submitting"}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-all
                  focus:ring-2 focus:ring-[#f7941D] focus:border-[#f7941D]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  ${state === "error" ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}
              />
              <button
                type="submit"
                disabled={state === "submitting"}
                className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed
                  hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f7941D, #F79520)",
                  boxShadow: "0 4px 14px rgba(247,148,29,0.35)",
                }}
              >
                {state === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>

            {/* Optional name field toggle */}
            {!showName ? (
              <button
                type="button"
                onClick={() => setShowName(true)}
                className="mt-3 text-xs text-gray-400 hover:text-[#f7941D] transition-colors underline-offset-2 hover:underline"
              >
                + Add your name (optional)
              </button>
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                disabled={state === "submitting"}
                className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none
                  focus:ring-2 focus:ring-[#f7941D] focus:border-[#f7941D]
                  disabled:opacity-60 transition-all"
                style={{ animation: "fadeSlideIn 0.3s ease both" }}
              />
            )}

            {/* Feedback message */}
            {state === "error" && message && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
