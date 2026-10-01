"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, X } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
      } catch (err) {
        console.error("Upload error:", err);
        setError(getErrorMessage(err, "Failed to upload image"));
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
        className={`relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/40 hover:border-muted-foreground/30"
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
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Drop your image here or click to browse
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                JPG, PNG, or WebP up to {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3">
          <X className="h-4 w-4 flex-shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string, category: string) => Promise<void> | void;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ImageUploadModalProps) {
  const [category, setCategory] = useState("");
  const [uploadedStorageId, setUploadedStorageId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    } catch (err) {
      setError(getErrorMessage(err, "Failed to upload"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedStorageId || !category || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onUpload(uploadedStorageId, category);
      setUploadedStorageId(null);
      setCategory("");
      onClose();
    } catch {
      // Failure already surfaced to the user; keep the modal open.
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-border bg-popover p-6 text-popover-foreground">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold">Add Portfolio Item</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {!uploadedStorageId ? (
            <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-primary/50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Click to upload image</p>
                    <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, or WebP up to 10MB</p>
                  </div>
                </div>
              )}
            </label>
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-md bg-muted/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-md border border-input bg-transparent px-4 text-foreground outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50"
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
            <Button
              onClick={() => void handleSubmit()}
              disabled={!uploadedStorageId || !category || submitting}
              className="h-12 flex-1"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
              )}
              {submitting ? "Adding..." : "Add to Portfolio"}
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6"
              onClick={() => {
                setUploadedStorageId(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}