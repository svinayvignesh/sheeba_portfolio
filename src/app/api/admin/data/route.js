import { cookies } from "next/headers";
import { getPortfolioData, savePortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  return auth?.value === "authenticated";
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = getPortfolioData();
  return Response.json(data);
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    savePortfolioData(data);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed to save data" }, { status: 500 });
  }
}
