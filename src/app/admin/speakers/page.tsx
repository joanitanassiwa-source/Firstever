import { prisma } from "@/lib/prisma";
import { SpeakerAdmin } from "./SpeakerAdmin";

export default async function SpeakersAdminPage() {
  const speakers = await prisma.speaker.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <div className="dash__head">
        <p className="dash__eyebrow">Admin</p>
        <h1 className="dash__h1">Speakers.</h1>
        <p className="dash__lede">
          The seeded lineup is illustrative. Replace these with confirmed speakers as they're announced —
          changes appear on the public site immediately.
        </p>
      </div>
      <SpeakerAdmin speakers={speakers} />
    </>
  );
}
