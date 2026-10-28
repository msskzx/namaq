import type { Metadata } from "next";
import PartyRoom from "../PartyRoom";
import { SITE_IMAGE, SITE_NAME } from "@/lib/siteMeta";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const title = `مسابقة جماعية في ${SITE_NAME}`;
  const description = `انضم إلى المسابقة بالرمز ${code}`;
  return { title, description, openGraph: { siteName: SITE_NAME, title, description, locale: "ar", type: "website", images: [SITE_IMAGE] } };
}

export default async function PartyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PartyRoom code={code} />;
}
