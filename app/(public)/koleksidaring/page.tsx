"use client";

import React from "react";
import Image from "next/image";
import { collectionSections } from "@/constants/CollectionSections";
import { useCollections } from "@/hooks/useCollections";

interface CollectionCardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  onAction: () => void;
}

const KoleksiDaringPage: React.FC = () => {
  const { handleExternalLink } = useCollections();

  return (
    <div className="bg-cream min-h-screen py-10">
      <main>
        <section id="koleksi-daring" className="py-12">
          <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-extrabold text-main-text mb-10">Koleksi Daring</h3>

            {collectionSections.map((section, index) => (
              <div key={index} className="mb-16">
                <h4 className="text-2xl font-semibold text-main-text border-b-4 border-secondary inline-block pb-2 mb-6">{section.title}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {section.collections.map((collection, idx) => (
                    <CollectionCard key={idx} {...collection} onAction={() => handleExternalLink(collection.link)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const CollectionCard: React.FC<CollectionCardProps> = ({ imgSrc, imgAlt, title, onAction }) => (
  <button onClick={onAction} className="bg-cream-soft shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 block w-full text-center border border-main-border">
    <div className="relative w-full h-24 flex justify-center items-center">
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={120}
        height={80}
        className="object-contain p-2"
        // Menggunakan placeholder jika gambar belum ada
        onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
      />
    </div>
    <h4 className="text-lg font-bold text-main-text mt-4">{title}</h4>
  </button>
);

export default KoleksiDaringPage;
