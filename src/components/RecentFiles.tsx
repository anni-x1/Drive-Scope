"use client";

import { useEffect, useState } from "react";
import { AlertCircle, File, FileImage, FileSpreadsheet, FileText, Folder, LoaderCircle } from "lucide-react";

type DriveFile = {
  driveFileId: string;
  name?: string;
  mimeType?: string;
  size?: number;
  modifiedTime?: string;
  webViewLink?: string;
};

function iconFor(file: DriveFile) {
  if (file.mimeType === "application/vnd.google-apps.folder") return Folder;
  if (file.mimeType?.startsWith("image/")) return FileImage;
  if (file.mimeType?.includes("spreadsheet")) return FileSpreadsheet;
  if (file.mimeType?.includes("document") || file.mimeType?.includes("pdf")) return FileText;
  return File;
}

function formatSize(size?: number) {
  if (size === undefined || !Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export default function RecentFiles() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadFiles() {
      try {
        const response = await fetch("/api/files?limit=5", { cache: "no-store", signal: controller.signal });
        const data: { files?: DriveFile[]; error?: string } = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load recent files.");
        setFiles(Array.isArray(data.files) ? data.files.slice(0, 5) : []);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load recent files.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadFiles();
    return () => controller.abort();
  }, []);

  return (
    <section className="recent-files" aria-labelledby="recent-files-title" aria-busy={loading}>
      <div className="section-heading"><div><h2 id="recent-files-title">Recent files</h2><p>Recently modified files in your Drive</p></div></div>
      {loading ? (
        <p className="recent-files-state" role="status"><LoaderCircle size={16} className="spin" /> Loading recent files…</p>
      ) : error ? (
        <p className="recent-files-state recent-files-error" role="alert"><AlertCircle size={16} /> {error}</p>
      ) : files.length === 0 ? (
        <p className="recent-files-state">No files found. Connect and sync a Google Drive account to see recent files.</p>
      ) : (
        <ul className="recent-files-list">
          {files.map((file) => {
            const Icon = iconFor(file);
            const name = file.name?.trim() || "Untitled file";
            return (
              <li className="recent-file-row" key={file.driveFileId}>
                <span className="recent-file-icon" aria-hidden="true"><Icon size={17} /></span>
                <span className="recent-file-name">
                  {file.webViewLink ? <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} in Google Drive (opens in a new tab)`}>{name}</a> : <span>{name}</span>}
                  <small>{file.mimeType || "Unknown type"}</small>
                </span>
                <time className="recent-file-modified" dateTime={file.modifiedTime || undefined}>{file.modifiedTime && Number.isFinite(Date.parse(file.modifiedTime)) ? new Date(file.modifiedTime).toLocaleDateString() : "—"}</time>
                <span className="recent-file-size">{formatSize(file.size)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
