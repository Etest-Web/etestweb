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
    "w-full rounded-md border border-input bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring";

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-lg border border-border bg-card p-8 text-card-foreground shadow-lg">
          <h1 className="mb-1 text-2xl font-bold">
            Let&apos;s set up your profile
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            {step === 1
              ? "Tell us how you&apos;ll use Glypha."
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
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
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
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
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
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
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
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
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
                              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                        className="shrink-0 rounded-md border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Add
                      </button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => toggleSkill(s)}
                              aria-label={`Remove ${s}`}
                              className="transition-colors hover:text-primary/70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
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
                className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
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
                <p className="text-center text-xs text-muted-foreground">
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
        "flex w-full items-center gap-4 rounded-md border p-4 text-left transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "border-border hover:bg-accent"
      )}
    >
      <span className="flex-shrink-0 text-2xl">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{subtitle}</span>
      </span>
      <span
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-border"
        )}
      >
        {selected && (
          <Check className="h-3.5 w-3.5 text-primary-foreground" />
        )}
      </span>
    </button>
  );
}

function StepBadge({ role, onBack }: { role: Role; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
        {role === "designer" ? "🎨 Designer" : "🛠️ Client"}
      </span>
      <button
        type="button"
        onClick={onBack}
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Change role
      </button>
    </div>
  );
}
