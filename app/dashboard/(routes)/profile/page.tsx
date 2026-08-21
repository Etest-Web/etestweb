"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { User, MapPin, Briefcase, Plus, X, Upload, Link as LinkIcon, Trash2, Grid3X3 } from "lucide-react";
import Image from "next/image";
import { ImageUploadModal } from "@/components/reusable/ImageUpload";
import { getErrorMessage } from "@/lib/utils";

const SKILL_CATEGORIES = [
  "UI/UX Design",
  "Web Development",
  "Branding",
  "Logo Design",
  "Mobile App Design",
  "Print Design",
  "Motion Graphics",
  "Illustration",
  "3D Design",
  "Digital Marketing",
  "Copywriting",
  "Video Editing",
];

export default function ProfilePage() {
  const user = useQuery(api.users.getCurrentUser);
  const myProfile = useQuery(api.profiles.getCurrentUserProfile);
  const myPortfolio = useQuery(api.portfolio.getMyPortfolio);
  const createOrUpdateProfile = useMutation(api.profiles.createOrUpdateProfile);
  const addSkill = useMutation(api.profiles.addSkill);
  const removeSkill = useMutation(api.profiles.removeSkill);
  const updatePresence = useMutation(api.profiles.updatePresence);
  const addPortfolioItem = useMutation(api.portfolio.addPortfolioItem);
  const removePortfolioItem = useMutation(api.portfolio.removePortfolioItem);

  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    city: "",
    country: "",
    portfolioUrl: "",
    role: "designer" as "designer" | "client",
  });
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geolocation state
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (myProfile) {
      setFormData({
        name: myProfile.name ?? "",
        bio: myProfile.bio ?? "",
        city: myProfile.location.city ?? "",
        country: myProfile.location.country ?? "",
        portfolioUrl: myProfile.portfolioUrl ?? "",
        role: myProfile.role ?? "designer",
      });
    }
  }, [myProfile]);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err);
          // Default to London if geolocation fails
          setLocation({ lat: 51.5074, lng: -0.1278 });
        }
      );
    }
  }, []);

  // Update presence when component mounts/unmounts
  useEffect(() => {
    updatePresence({ isOnline: true });
    return () => {
      updatePresence({ isOnline: false });
    };
  }, []);

  const handleSave = async () => {
    if (!location) {
      setError("Location access is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createOrUpdateProfile({
        ...formData,
        skills: myProfile?.skills ?? [],
        lat: location.lat,
        lng: location.lng,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to save profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    await addSkill({ skill: newSkill.trim() });
    setNewSkill("");
  };

  const handleRemoveSkill = async (skill: string) => {
    await removeSkill({ skill });
  };

  if (!user) {
    return <div className="p-8 text-white/60">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile & Portfolio</h1>
          <p className="text-white/60">
            Manage your professional information and showcase your work
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Basic Information</h2>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Tell us about yourself and your expertise..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {formData.role === "designer" && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, portfolioUrl: e.target.value })
                      }
                      className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Name</p>
                  <p className="text-white font-medium">{myProfile?.name ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Bio</p>
                  <p className="text-white">{myProfile?.bio ?? "Not set"}</p>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {myProfile?.location.city ?? "Unknown"}, {myProfile?.location.country ?? "Unknown"}
                  </span>
                </div>
                {myProfile?.portfolioUrl && (
                  <div className="flex items-center gap-2 text-primary">
                    <LinkIcon className="w-4 h-4" />
                    <a href={myProfile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>
            )}

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-12 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 h-12 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Skills */}
          {user.role === "designer" && (
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-white">Skills & Expertise</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {myProfile?.skills && myProfile.skills.length > 0 ? (
                  myProfile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-white/60">No skills added yet</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a skill</option>
                    {SKILL_CATEGORIES.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkill}
                    className="h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Preview Card */}
        <div className="space-y-6">
          <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Profile Preview</h3>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {myProfile?.name ?? "Your Name"}
              </h4>
              <p className="text-sm text-white/60 capitalize mb-2">
                {myProfile?.role ?? user.role}
              </p>
              <div className="flex items-center justify-center gap-1 text-yellow-400 mb-4">
                <StarIcon className="w-5 h-5" />
                <span className="font-bold">
                  {myProfile?.averageRating ?? "New"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4" />
                <span>{myProfile?.location.city ?? "City"}, {myProfile?.location.country ?? "Country"}</span>
              </div>
              {myProfile?.isOnline && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online Now
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Availability</h3>
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  myProfile?.isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              />
              <span className="text-white/80">
                {myProfile?.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            {myProfile?.lastSeen && (
              <p className="text-sm text-white/60 mt-2">
                Last seen: {new Date(myProfile.lastSeen).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Gallery Section */}
      {user.role === "designer" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Grid3X3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Portfolio Gallery</h2>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {myPortfolio && myPortfolio.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myPortfolio.map((item: Doc<"portfolioItems">) => (
                <div
                  key={item._id}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-[#1a1610] border border-white/10"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.category}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-medium truncate">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removePortfolioItem({ itemId: item._id as Id<"portfolioItems"> })}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center">
              <Grid3X3 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No portfolio items yet</h3>
              <p className="text-white/60 mb-4">Showcase your best work to attract clients</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Add Your First Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={async (imageUrl, category) => {
          await addPortfolioItem({ imageUrl, category });
        }}
      />
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
