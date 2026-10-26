import PartyRoom from "../PartyRoom";

export default async function PartyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PartyRoom code={code} />;
}
