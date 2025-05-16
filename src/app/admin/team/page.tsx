"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// Types
type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string;
  superpowers: string[];
  sort_order: number;
};

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    image: null as File | null,
    superpowers: "",
    sort_order: 0,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setTeam(data || []);
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as any;
    if (name === "image" && files && files[0]) {
      setForm((f) => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleEdit(member: TeamMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      image: null,
      superpowers: member.superpowers.join("\n"),
      sort_order: member.sort_order,
    });
    setPreview(member.image_url);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", role: "", image: null, superpowers: "", sort_order: 0 });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let image_url = preview;
    if (form.image) {
      // Upload image via the /api/upload route (server-side, bypasses RLS)
      const formDataToSend = new FormData();
      formDataToSend.append('file', form.image);
      formDataToSend.append('bucket', 'team-images');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        setError(errorData.error || 'Failed to upload image');
        setLoading(false);
        return;
      }

      const uploadData = await uploadResponse.json();
      image_url = uploadData.url;
    }
    const memberData = {
      name: form.name,
      role: form.role,
      image_url: image_url!,
      superpowers: form.superpowers.split("\n").filter((s) => s.trim()),
      sort_order: Number(form.sort_order),
    };
    let res;
    if (editingId) {
      res = await supabase.from("team_members").update(memberData).eq("id", editingId);
    } else {
      res = await supabase.from("team_members").insert([memberData]);
    }
    if (res.error) setError(res.error.message);
    else {
      fetchTeam();
      resetForm();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this team member?")) return;
    setLoading(true);
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchTeam();
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Team Members Admin</h1>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl shadow mb-8">
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleInput} className="w-full p-2 rounded bg-gray-800 text-white" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Role/Title</label>
          <input name="role" value={form.role} onChange={handleInput} className="w-full p-2 rounded bg-gray-800 text-white" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Image</label>
          <input name="image" type="file" accept="image/*" ref={fileInputRef} onChange={handleInput} className="w-full p-2 rounded bg-gray-800 text-white" />
          {preview && (
            <div className="mt-2"><Image src={preview} alt="Preview" width={100} height={140} className="rounded" /></div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1">What I Bring (one per line)</label>
          <textarea name="superpowers" value={form.superpowers} onChange={handleInput} rows={3} className="w-full p-2 rounded bg-gray-800 text-white" placeholder="e.g. Web Design\nDevelopment" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Sort Order</label>
          <input name="sort_order" type="number" value={form.sort_order} onChange={handleInput} className="w-full p-2 rounded bg-gray-800 text-white" />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold" disabled={loading}>{editingId ? "Update" : "Add"} Member</button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">Cancel</button>}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
      {loading && <div>Loading...</div>}
      <div className="grid gap-6">
        {team.map((member) => (
          <div key={member.id} className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl">
            <Image src={member.image_url} alt={member.name} width={60} height={90} className="rounded" />
            <div className="flex-1">
              <div className="font-bold text-white">{member.name}</div>
              <div className="text-red-300 text-sm">{member.role}</div>
              <ul className="list-disc pl-4 text-gray-300 text-sm mt-1">
                {member.superpowers.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <button onClick={() => handleEdit(member)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2">Edit</button>
            <button onClick={() => handleDelete(member.id)} className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
