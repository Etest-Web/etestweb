"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (storageId: string, url: string) => void;
  accept?: string;
  maxSize?: number;
}

export function ImageUpload({
  onUploadComplete,
  accept = "image/jpeg,image/png,image/webp",
  maxSize = 10 * 1024 * 1024,
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.portfolio.generateUploadUrl);

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);

      if (!accept.split(",").some((type) => file.type.includes(type.replace("image/", "")))) {
        setError("Only JPG, PNG, and WebP images are allowed");
        return;
      }

      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return;
      }

      setUploading(true);

      try {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await response.json();

        onUploadComplete(storageId, storageId);
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err?.message ?? "Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [accept, maxSize, generateUploadUrl, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div className="w-full">
      <label
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-white/10 hover:border-white/20 bg-white/5"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">
                Drop your image here or click to browse
              </p>
              <p className="text-white/60 text-sm mt-1">
                JPG, PNG, or WebP up to {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string, category: string) => void;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ImageUploadModalProps) {
  const [category, setCategory] = useState("");
  const [uploadedStorageId, setUploadedStorageId] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.portfolio.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = await response.json();
      setUploadedStorageId(storageId);
    } catch (err: any) {
      setError(err?.message ?? "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (uploadedStorageId && category) {
      onUpload(uploadedStorageId, category);
      setUploadedStorageId(null);
      setCategory("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1610] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add Portfolio Item</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="space-y-4">
          {!uploadedStorageId ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-white/5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/60 text-sm">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Click to upload image</p>
                    <p className="text-white/60 text-sm mt-1">JPG, PNG, or WebP up to 10MB</p>
                  </div>
                </div>
              )}
            </label>
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/60 text-sm">Image uploaded successfully</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select a category</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Branding">Branding</option>
              <option value="Logo Design">Logo Design</option>
              <option value="Illustration">Illustration</option>
              <option value="Motion Graphics">Motion Graphics</option>
              <option value="Print Design">Print Design</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={!uploadedStorageId || !category}
              className="flex-1 h-12 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Add to Portfolio
            </button>
            <button
              onClick={() => {
                setUploadedStorageId(null);
              }}
              className="px-6 h-12 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}