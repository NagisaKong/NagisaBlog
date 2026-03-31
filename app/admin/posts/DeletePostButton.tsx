"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeletePostButton({ id, title }: { id: number; title: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setOpen(false);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded px-2 py-1 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-800 transition-colors">
        Delete
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 [&>button]:text-zinc-400 [&>button]:hover:text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Delete post?</DialogTitle>
          <DialogDescription className="text-zinc-400">
            &ldquo;{title}&rdquo; will be permanently deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-transparent">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
