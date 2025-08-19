import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
      <div className="container text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">
          Ready to Modernize Your Clinic?
        </h2>
        <p className="mb-8 text-lg">
          Start managing appointments, patients, and staff more intelligently — today.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ rounded: "xl", size: "lg" }),
            "bg-white text-blue-600 hover:bg-blue-50"
          )}
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  );
}
