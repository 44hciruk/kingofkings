import { brand } from "./vantaCloneContent";

// Reference's own nav is minimal: a small centered muted wordmark, always
// visible, with no menu links or CTA button in the chrome itself. The
// "Edition — Buy" pill is a separate floating element that fades in during
// the Hero reveal and persists afterward (see HeroScene); it is not part of
// this header.
export default function SiteHeader() {
  return <div className="v2-header">{brand.name}</div>;
}
