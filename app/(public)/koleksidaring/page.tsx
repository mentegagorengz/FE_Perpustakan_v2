"use client";

import { collectionSections } from "@/constants/CollectionSections";
import { ExternalLink } from "lucide-react";

export default function KoleksiDaringPage() {
  return (
    <div className="bg-cream min-h-screen py-10">
      <section id="koleksi-daring" className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h1 className="text-4xl md:text-5xl text-main-text mb-3">Koleksi Daring</h1>
              <p className="text-main-text/60 max-w-md mx-auto text-sm sm:text-base">Jelajahi database dan sumber literatur digital dari berbagai penyedia.</p>
            </div>

            {collectionSections.map((section, index) => (
              <div key={index} className="mb-16">
                <h2 className="text-2xl text-main-text pb-2 mb-6 border-b border-main-border">{section.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {section.collections.map((collection, idx) => (
                    <CollectionCard key={idx} title={collection.title} link={collection.link} />
                  ))}
                </div>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
};

function CollectionCard({ title, link }: { title: string; link: string }) {
  return <a
    href={link}
    target="_blank"
    rel="noreferrer"
    className="group flex w-full flex-col items-center text-center rounded-sm border border-main-border bg-cream-soft p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-raised)]"
  >
    <div className="h-24 w-full rounded-sm bg-surface" aria-hidden="true" />
    <h3 className="font-display text-lg text-main-text mt-4 transition-colors group-hover:text-secondary">{title}</h3>
    <span className="mt-2 flex items-center gap-1.5 text-sm text-secondary">
      Kunjungi
      <ExternalLink aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-0.5" />
    </span>
  </a>;
}
