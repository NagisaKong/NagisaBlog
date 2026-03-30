export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    title: "ARP Spoof Detector",
    description:
      "A passive network monitoring tool that detects ARP spoofing/poisoning attacks in real time using Scapy. Sends desktop alerts when suspicious ARP replies are observed.",
    tags: ["Python", "Scapy", "Networking", "Security"],
    github: "https://github.com/yourname/arp-spoof-detector",
    featured: true,
  },
  {
    title: "Port Scanner",
    description:
      "Multi-threaded TCP/UDP port scanner with service fingerprinting and JSON output support. Built as a learning project to understand socket programming.",
    tags: ["Python", "Networking", "CLI"],
    github: "https://github.com/yourname/port-scanner",
    featured: false,
  },
  {
    title: "CTF Writeup Site",
    description:
      "A collection of Capture The Flag challenge writeups covering web exploitation, binary exploitation, cryptography, and forensics.",
    tags: ["CTF", "Security", "Next.js"],
    demo: "https://ctf.yoursite.dev",
    featured: true,
  },
];
