import Link from "next/link";

export const metadata = {
  title: "About / Contact - Lampoon XYZ",
  description: "About Lampoon XYZ political satire startup.",
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 800, padding: 24 }}>
      <h1>About / Contact</h1>
      <p>
        Lampoon XYZ is a new startup company featuring funny videos and aricles using political satire for entertainment purposes.
      </p>
      <p>
        This site is operated by <strong>Lampoon XYZ</strong>. For inquiries, reach out via email at <a href="mailto:mike@lampoon.xyz">mike@lampoon.xyz</a>.
      </p>
      <p>
        <strong>Address:</strong> Alexandria, Virginia
      </p>
      <p>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}
