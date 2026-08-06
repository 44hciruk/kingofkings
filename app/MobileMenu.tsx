"use client";

import { useRef } from "react";

const links = [
  ["TICKET", "#ticket"],
  ["PLAYERS", "#players"],
  ["DETAILS", "#detail"],
];

export default function MobileMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => menuRef.current?.removeAttribute("open");

  return (
    <details className="v-mobile-menu" ref={menuRef} onKeyDown={(event) => event.key === "Escape" && closeMenu()}>
      <summary aria-label="メニューを開閉"><span /><span /><span /></summary>
      <nav aria-label="スマートフォンメニュー">
        {links.map(([label, href]) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
      </nav>
    </details>
  );
}
