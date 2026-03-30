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
          Hi! I&apos;m HAL, a computer science student with a deep interest in
          <strong className="text-zinc-200"> cybersecurity</strong> and{" "}
          <strong className="text-zinc-200">networking</strong>. I spend a lot of time reading
          RFCs, breaking things in CTF challenges, and building tools to better understand how
          systems work at a low level.
        </p>
        <p>
          This blog is where I document what I learn — ARP spoofing, network protocols,
          penetration testing concepts, and whatever rabbit holes I fall into each week. I write
          for my future self and for anyone who finds value in detailed technical notes.
        </p>
        <p>
          When I&apos;m not hacking on projects, I&apos;m contributing to open-source, playing
          CTFs, or experimenting with homelab setups.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Cybersecurity",
            "Networking",
            "CTF Challenges",
            "Linux",
            "Python",
            "Packet Analysis",
            "Reverse Engineering",
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

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Contact</h2>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li>
            GitHub:{" "}
            <a
              href="https://github.com/yourname"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
            >
              @yourname
            </a>
          </li>
          <li>
            Email:{" "}
            <a href="mailto:you@example.com" className="text-emerald-400 hover:text-emerald-300">
              you@example.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
