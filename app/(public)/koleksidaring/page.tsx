"use client";

import React from "react";
import { collectionSections } from "@/constants/CollectionSections";
import { useCollections } from "@/hooks/useCollections";
import { ExternalLink } from "lucide-react";

interface CollectionCardProps {
  title: string;
  onAction: () => void;
}

const KoleksiDaringPage: React.FC = () => {
  const { handleExternalLink } = useCollections();

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
                    <CollectionCard key={idx} {...collection} onAction={() => handleExternalLink(collection.link)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
};

const CollectionCard: React.FC<CollectionCardProps> = ({ title, onAction }) => (
  <button
    type="button"
    onClick={onAction}
    className="group flex w-full flex-col items-center text-center rounded-lg border border-main-border bg-cream-soft p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-raised)]"
  >
    <div className="h-24 w-full rounded-md bg-surface" aria-hidden="true" />
    <h3 className="font-display text-lg text-main-text mt-4 transition-colors group-hover:text-secondary">{title}</h3>
    <span className="mt-2 flex items-center gap-1.5 text-sm text-secondary">
      Kunjungi
      <ExternalLink aria-hidden="true" size={14} className="transition-transform group-hover:translate-x-0.5" />
    </span>
  </button>
);

export default KoleksiDaringPage;
