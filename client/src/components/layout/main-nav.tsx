import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

interface NavItem {
  title: string;
  href: string;
}

const items: NavItem[] = [
  {
    title: "Games",
    href: "/games",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Profile",
    href: "/profile",
  },
];

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal",
                  location.pathname === item.href && "bg-accent"
                )}
              >
                {item.title}
              </Button>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
