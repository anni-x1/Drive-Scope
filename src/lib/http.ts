import { NextResponse } from "next/server";
export function errorResponse(error: unknown) { const message = error instanceof Error ? error.message : "Unexpected server error"; return NextResponse.json({ error: message }, { status: 500 }); }
