"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "client" | "designer";

const COMMON_SKILLS = [
  "Logo Design",
  "Brand Identity",
  "YouTube Thumbnail",
  "Social Media",
  "UI/UX",
  "Illustration",
  "Poster Design",
  "Packaging",
];

export function Onboarding() {
  const { user: clerkUser } = useUser();
  const { success, error } = useToast();
  const createProfile = useMutation(api.profiles.createOrUpdateProfile);

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState(
    clerkUser?.fullName ?? clerkUser?.username ?? ""
  );
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const step = role === null ? 1 : 2;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const canSubmit =
    name.trim().length > 0 &&
    city.trim().length > 0 &&
    country.trim().length > 0 &&
    (role !== "designer" || skills.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await createProfile({
        role,
        name: name.trim(),
        bio: role === "designer" ? bio : undefined,
        skills: role === "designer" ? skills : [],
        city: city.trim(),
        country: country.trim(),
        lat: 0,
        lng: 0,
      });
      success(
        role === "designer"
          ? "Welcome, designer! Your profile is ready."
          : "Your profile is ready. Start posting jobs.",
        "You can refine your details anytime from Profile."
      );
    } catch (err) {
      error(
        "Could not create your profile",
        err instanceof Error ? err.message : "Please try again."
      );
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary/60 focus:bg-white/[0.06] transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-[#1a1610] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-bold text-white mb-1">
            Let&apos;s set up your profile
          </h1>
          <p className="text-white/60 mb-6 text-sm">
            {step === 1
              ? "Tell us how you&apos;ll use Etest."
              : "A few details to get you started."}
          </p>

          {step === 1 ? (
            <div className="space-y-3">
              <RoleOption
                title="I&apos;m a client"
                subtitle="Post jobs and hire designers"
                icon="🛠️"
                selected={role === "client"}
                onClick={() => setRole("client")}
              />
              <RoleOption
                title="I&apos;m a designer"
                subtitle="Find work and grow your portfolio"
                icon="🎨"
                selected={role === "designer"}
                onClick={() => setRole("designer")}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role && (
                <StepBadge role={role} onBack={() => setRole(null)} />
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Full name
                </label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    City
                  </label>
                  <input
                    className={inputClass}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lagos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Country
                  </label>
                  <input
                    className={inputClass}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Nigeria"
                    required
                  />
                </div>
              </div>

              {role === "designer" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {COMMON_SKILLS.map((s) => {
                        const active = skills.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => toggleSkill(s)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                              active
                                ? "bg-primary text-black border-primary"
                                : "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                            )}
                          >
                            {active ? "✓ " : ""}
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSkill();
                          }
                        }}
                        placeholder="Add a custom skill and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="shrink-0 px-4 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSkill(s)}
                              aria-label={`Remove ${s}`}
                              className="hover:text-white transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      className={cn(inputClass, "min-h-24 resize-y")}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short intro about your work and style"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Spinner className="w-4 h-4" /> Setting up…
                  </>
                ) : (
                  <>Finish setup</>
                )}
              </button>
              {role === "designer" && skills.length === 0 && (
                <p className="text-xs text-white/50 text-center">
                  Add at least one skill to continue.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleOption({
  title,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/10"
          : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
      )}
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold text-white">{title}</span>
        <span className="block text-sm text-white/60">{subtitle}</span>
      </span>
      <span
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
          selected ? "border-primary bg-primary" : "border-white/25"
        )}
      >
        {selected && <Check className="w-3.5 h-3.5 text-black" />}
      </span>
    </button>
  );
}

function StepBadge({ role, onBack }: { role: Role; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium capitalize">
        {role === "designer" ? "🎨 Designer" : "🛠️ Client"}
      </span>
      <button
        type="button"
        onClick={onBack}
        className="text-xs text-white/50 hover:text-white transition-colors"
      >
        Change role
      </button>
    </div>
  );
}
