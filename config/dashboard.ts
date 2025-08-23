import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/messages", icon: "bot", title: "AI Chat" },
      { href: "/dashboard/patients", icon: "user", title: "Patients", authorizeOnly: [UserRole.ADMIN, UserRole.NURSE, UserRole.DOCTOR] },
      { href: "/dashboard/appointments", icon: "calendar", title: "Appointments" },
      { href: "/dashboard/chats", icon: "messages", title: "Chats" },
      { href: "/dashboard/staffs", icon: "users", title: "Staffs" },
      { href: "/dashboard/pharmacy", icon: "store", title: "Pharmacy" },


      // { href: "/dashboard/charts", 
      //   icon: "lineChart", 
      //   title: "Charts" 
      // },
      // {
      //   href: "/admin/orders",
      //   icon: "package",
      //   title: "Orders",
      //   badge: 2,
      //   authorizeOnly: UserRole.ADMIN,
      // },
      {
        href: "#/dashboard/posts",
        icon: "post",
        title: "User Posts",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
];
