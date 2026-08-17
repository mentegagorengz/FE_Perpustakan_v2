import Link from "next/link";
import { BookOpen, Users, FileText, FlaskConical } from "lucide-react";

const services = [
  { label: "Koleksi", desc: "Telusuri katalog buku", href: "/koleksi", icon: BookOpen },
  { label: "Koleksi daring", desc: "Akses sumber elektronik", href: "/koleksidaring", icon: Users },
  { label: "Warta", desc: "Baca informasi perpustakaan", href: "/artikel", icon: FileText },
  { label: "Profil Perpustakaan", desc: "Kenali layanan perpustakaan", href: "/profil", icon: FlaskConical },
];

export default function ServiceNav() {
  return (
    <section className="container mx-auto max-w-5xl px-6 py-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {services.map(({ label, desc, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center rounded-sm border border-main-border bg-cream-soft p-6 text-center shadow-[var(--shadow-card)] hover:bg-surface"
          >
            <Icon aria-hidden="true" className="mb-3 text-secondary" size={28} strokeWidth={1.5} />
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-sm text-main-text-muted">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
