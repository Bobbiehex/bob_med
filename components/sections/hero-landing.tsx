import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-background dark:to-muted/30">
      <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          Manage Your{" "}
          <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
            Clinic Smarter
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          An <b>AI-powered intelligent clinic management system</b> using 
          reinforcement learning to streamline appointments, patient records, 
          and staff scheduling — all in one place.
        </p>

        <div className="flex justify-center space-x-2">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "gap-2 px-5 text-[15px]"
            )}
          >
            <span>Get Started</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({
                variant: "outline",
                rounded: "xl",
                size: "lg",
              }),
              "px-4 text-[15px]"
            )}
          >
            <span>Login</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
