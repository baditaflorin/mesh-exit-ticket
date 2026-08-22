import { useState } from "react";
import {
  useBeforeUnload,
  useSharedCollection,
  type MeshConfig,
  type YRoom,
} from "@baditaflorin/mesh-common";
type Props = { room: YRoom | null; config: MeshConfig };
type Ticket = { id: string; text: string; by: string };
export function Feature({ room, config }: Props) {
  const tickets = useSharedCollection<Ticket>(room, "exit-tickets", {
    validate: (item) =>
      item.text.trim().length > 0 && item.text.length <= 280 && item.by.length <= 80,
  });
  const [draft, setDraft] = useState("");
  useBeforeUnload(Boolean(draft.trim()));
  const submit = () => {
    const text = draft.trim();
    if (text) {
      tickets.add({
        id: `${room?.peerId ?? "local"}-${Date.now()}`,
        text,
        by: room?.peerId?.slice(0, 8) ?? "local",
      });
      setDraft("");
    }
  };
  return (
    <main className="feature-placeholder">
      <p className="feature-status">
        {room ? `${room.peerCount} peer(s) reflecting` : "Connecting…"}
      </p>
      <h1>{config.appName}</h1>
      <p>
        Leave one bounded takeaway before the session closes. A warning protects a draft that has
        not been submitted.
      </p>
      <label>
        Your takeaway{" "}
        <textarea
          value={draft}
          maxLength={280}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
      <button onClick={submit}>Share takeaway</button>
      <p>{280 - draft.length} characters left</p>
      <ol aria-live="polite">
        {tickets.items.map((ticket) => (
          <li key={ticket.id}>{ticket.text}</li>
        ))}
      </ol>
    </main>
  );
}
