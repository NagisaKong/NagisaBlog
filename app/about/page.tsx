import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "A CS student interested in cybersecurity, networking, and systems.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">About Me</h1>
        <p className="text-zinc-400">CS student · Security enthusiast · Builder</p>
      </div>

      <section className="space-y-4 text-zinc-300 leading-7">
        <p>
          Hi! I&apos;m Nagisa, a computer science student with a deep interest in
          <strong className="text-zinc-200"> cybersecurity</strong> and{" "}
          <strong className="text-zinc-200">networking</strong>. I love exploring how things work under the hood, whether it&apos;s dissecting network protocols, analyzing malware samples, or building small tools to automate tedious tasks. I&apos;m passionate about learning and sharing knowledge, which is why I started this blog.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Cybersecurity",
            "Networking",
            "Systems Programming",
            "Machine Learning",
            "Linux",
            "Packet Analysis",
            "Reverse Engineering",
            "PHP",
            "C++",
            "Python",
            "JAVA",
            "Open Source",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-400"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
