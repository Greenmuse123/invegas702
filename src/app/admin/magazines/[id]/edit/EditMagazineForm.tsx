"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Magazine {
  id: string;
  title: string;
  description: string;
  published_at: string | null;
  image_url: string | null;
  status: "draft" | "published";
}

interface EditMagazineFormProps {
  magazine: Magazine;
}

export default function EditMagazineForm({ magazine }: EditMagazineFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(magazine.title);
  const [description, setDescription] = useState(magazine.description);
  const [publishedAt, setPublishedAt] = useState(
    magazine.published_at ? magazine.published_at.split("T")[0] : ""
  );
  const [status, setStatus] = useState<"draft" | "published">(
    magazine.status || "draft"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/magazines/${magazine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          published_at: publishedAt,
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update magazine");
      }
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Published At</label>
        <input
          type="date"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Magazine updated!</div>}
      <button
        type="submit"
        className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
