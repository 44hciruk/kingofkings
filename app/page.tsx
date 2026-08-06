import SiteFooter from "./SiteFooter";
import HeroSection from "./HeroSection";
import PitchSection from "./PitchSection";
import LibrarySection from "./LibrarySection";
import RecipeSection from "./RecipeSection";
import CloseSection from "./CloseSection";
import FaqSection from "./FaqSection";

export default function Home() {
  return (
    <div className="v2-site">
      <HeroSection />
      <PitchSection />
      <LibrarySection />
      <RecipeSection />
      <CloseSection />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
