"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="border-b border-accent/10 bg-accent-light/5">
      <div className="px-6 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="text-accent hover:text-accent-dark transition-colors"
              >
                Home
              </Link>
            </li>

            {paths.map((path, index) => {
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;

              return (
                <li key={path} className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-accent/50 mx-1" />
                  {isLast ? (
                    <span className="capitalize text-accent font-medium">
                      {path.replace(/-/g, " ")}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="capitalize text-accent/70 hover:text-accent transition-colors"
                    >
                      {path.replace(/-/g, " ")}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
