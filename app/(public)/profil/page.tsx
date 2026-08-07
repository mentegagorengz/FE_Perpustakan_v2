import ProfileHero from "@/components/profil/profile-hero";
import ProfileAbout from "@/components/profil/profile-about";
import ProfileOrganization from "@/components/profil/profile-organization";

export default function ProfilePage() {
  return (
    <div className="bg-cream text-main-text">
      <ProfileHero />
      <main className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <ProfileAbout />
          <ProfileOrganization />
        </div>
      </main>
    </div>
  );
}
