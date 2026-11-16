import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { Account, DriveFile } from "@/models/Drive";

const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    await connectDb();

    const accountFilter = { userId };
    const filesFilter = { userId, trashed: false };
    const indexedFilesFilter = { ...filesFilter, mimeType: { $ne: FOLDER_MIME_TYPE } };
    const foldersFilter = { ...filesFilter, mimeType: FOLDER_MIME_TYPE };

    const [accounts, indexedFiles, folders, recentlyModified] = await Promise.all([
      Account.countDocuments(accountFilter),
      DriveFile.countDocuments(indexedFilesFilter),
      DriveFile.countDocuments(foldersFilter),
      DriveFile.find(indexedFilesFilter)
        .sort({ modifiedTime: -1, _id: -1 })
        .limit(5)
        .select("driveFileId name mimeType size modifiedTime accountId webViewLink")
        .lean(),
    ]);

    return NextResponse.json({ accounts, indexedFiles, folders, recentlyModified });
  } catch {
    return NextResponse.json({ error: "Unable to load overview data." }, { status: 500 });
  }
}
