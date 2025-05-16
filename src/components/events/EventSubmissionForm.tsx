"use client";

import { useState } from "react";

interface EventFormData {
  name: string;
  phone: string;
  email: string;
  details: string;
}

export default function EventSubmissionForm() {
  const [form, setForm] = useState<EventFormData>({
    name: "",
    phone: "",
    email: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.details) {
      setError("All fields are required.");
      return false;
    }
    // Simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    // Simple phone validation
    if (!/^\+?[0-9\-\s]{7,15}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Failed to submit event.");
      }
      setSuccess("Event submitted successfully! Thank you.");
      setForm({ name: "", phone: "", email: "", details: "" });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-7 w-full"
      style={{ background: 'none', boxShadow: 'none', border: 'none', padding: 0, maxWidth: '100%', height: '100%' }}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-red-300 tracking-wide">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60 focus:outline-none transition"
          placeholder="Your full name"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-semibold text-red-300 tracking-wide">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={form.phone}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60 focus:outline-none transition"
          placeholder="(702) 555-1234"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-red-300 tracking-wide">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60 focus:outline-none transition"
          placeholder="you@email.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="details" className="text-sm font-semibold text-red-300 tracking-wide">Event Details</label>
        <textarea
          name="details"
          id="details"
          value={form.details}
          onChange={handleChange}
          rows={4}
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60 focus:outline-none transition"
          placeholder="Tell us about your event, location, date, and anything else!"
          required
        ></textarea>
      </div>
      {error && <div className="text-red-400 text-sm font-semibold bg-red-950/40 border border-red-900/30 rounded-lg px-4 py-2">{error}</div>}
      {success && <div className="text-green-400 text-sm font-semibold bg-green-950/30 border border-green-900/30 rounded-lg px-4 py-2">{success}</div>}
      <button
        type="submit"
        className="block w-full py-4 px-4 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 tracking-wide uppercase mx-auto"
        style={{ minHeight: 56, fontSize: '1.15rem', marginTop: 8, letterSpacing: '0.05em', maxWidth: '100%' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Event"}
      </button>
    </form>
  );
}
