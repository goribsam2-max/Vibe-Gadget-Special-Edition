import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, MessageCircle, ShoppingCart, User, Layers } from "lucide-react";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/affiliate", icon: Layers, label: "Creator" },
    { to: "/aichat", icon: MessageCircle, label: "Chat" },
    { to: "/cart", icon: ShoppingCart, label: "Cart" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  // Hide BottomNav on product detail pages where the custom action bar takes over
  if (location.pathname.startsWith("/product/")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-zinc-900 z-[100] md:hidden border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex w-full justify-between items-center px-4 h-[65px]">
          {links.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            const IconComponent = link.icon;
            
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex flex-col items-center justify-center flex-1 h-full relative group"
              >
                {isActive && (
                  <div className="absolute top-0 w-8 h-[3px] bg-[#1cdb5e] rounded-b-full"></div>
                )}
                <IconComponent
                  className={`w-5 h-5 mb-1 ${isActive ? "text-[#1cdb5e]" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-semibold ${isActive ? "text-[#1cdb5e]" : "text-zinc-400"}`}>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};

export default BottomNav;
