import { Icons } from "@/components/shared/icons";

const features = [
  {
    icon: <Icons.calendar className="size-6 text-blue-500" />,
    title: "Smart Appointment Scheduling",
    description: "AI-powered optimization to reduce wait times and maximize clinic efficiency."
  },
  {
    icon: <Icons.user className="size-6 text-green-500" />,
    title: "Patient Records",
    description: "Secure, cloud-based storage for patient history, prescriptions, and diagnostics."
  },
  {
    icon: <Icons.barChart className="size-6 text-purple-500" />,
    title: "Real-Time Analytics",
    description: "Insights into patient flow, staff utilization, and operational performance."
  }
];

export default function FeaturesLanding() {
  return (
    <section className="py-12 sm:py-20 bg-white dark:bg-background">
      <div className="container text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-10">
          Why Choose Our System?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg shadow-sm border bg-muted/10 hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
