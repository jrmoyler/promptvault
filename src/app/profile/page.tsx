"use client";

import { useState, useEffect, type FormEvent } from "react";
import TopBar from "@/components/layout/TopBar";
import { useAppStore, useUser, useFavorites, useUserUploads } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "bg-surface2 border border-[rgba(99,102,241,0.10)] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/15 transition-all";

export default function ProfilePage() {
  const user = useUser();
  const saveUser = useAppStore((s) => s.saveUser);
  const showToast = useAppStore((s) => s.showToast);
  const favorites = useFavorites();
  const uploads = useUserUploads();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "TM";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name is required", true);
      return;
    }
    saveUser({ name: name.trim(), email: email.trim(), role: role.trim() });
    setSaved(true);
    showToast("Profile saved!");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="flex flex-col min-h-full">
      <TopBar title="My Profile" showSearch={false} />

      <div className="flex-1 px-3 sm:px-6 py-5 sm:py-8 max-w-2xl w-full mx-auto">
        {/* Avatar + stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-surface border border-[rgba(99,102,241,0.08)] rounded-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent-gradient flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 shadow-glow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-xl text-text-primary truncate tracking-tight">
              {name || "Team Member"}
            </h2>
            <p className="text-muted text-sm truncate">{email || "—"}</p>
            <p className="text-accent text-xs mt-0.5">{role || "Pro Access"}</p>
          </div>
          <div className="flex gap-6 sm:gap-4 text-center mt-2 sm:mt-0 sm:ml-auto">
            <div>
              <div className="font-bold text-xl text-gold">{favorites.length}</div>
              <div className="text-muted text-[11px]">Favorites</div>
            </div>
            <div>
              <div className="font-bold text-xl text-accent2">{uploads.length}</div>
              <div className="text-muted text-[11px]">Uploads</div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-surface border border-[rgba(99,102,241,0.08)] rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-text-primary mb-5 tracking-tight">
            Edit Profile
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Full Name <span className="text-accent3 ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Role / Team
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Engineer, Marketing Lead"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className={cn(
                  "w-36 font-semibold text-sm py-2.5 rounded-xl transition-all duration-150 cursor-pointer",
                  saved
                    ? "bg-accent2/15 text-accent2 border border-accent2/25"
                    : "bg-accent hover:bg-accent-bright text-white"
                )}
              >
                {saved ? "Saved" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* User uploads list */}
        {uploads.length > 0 && (
          <div className="mt-6 bg-surface border border-[rgba(99,102,241,0.08)] rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-text-primary mb-4 tracking-tight">
              My Uploads ({uploads.length})
            </h3>
            <div className="flex flex-col gap-2">
              {uploads.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface2 border border-[rgba(99,102,241,0.06)]"
                >
                  <span className="text-accent2 text-sm">✦</span>
                  <span className="text-text-primary text-sm font-medium flex-1 truncate">
                    {p.title}
                  </span>
                  <span className="text-muted text-xs capitalize flex-shrink-0">
                    {p.cat.replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
