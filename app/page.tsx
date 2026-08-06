import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import HeroScene from "./HeroScene";
import PitchScene from "./PitchScene";
import LibraryScene from "./LibraryScene";
import RecipeScene from "./RecipeScene";
import ShowcaseScene from "./ShowcaseScene";
import PricingScene from "./PricingScene";
import FaqScene from "./FaqScene";

export default function Home() {
  return (
    <div className="v2-site">
      <SiteHeader />
      <HeroScene />
      <PitchScene />
      <LibraryScene />
      <RecipeScene />
      <ShowcaseScene />
      <PricingScene />
      <FaqScene />
      <SiteFooter />
    </div>
  );
}
