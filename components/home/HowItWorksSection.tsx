import { BrainCircuit, FileOutput, FileText, MoveRight } from "lucide-react";
import { ReactNode } from "react";

type Step = {
  icons: ReactNode;
  label: string;
  description: string;
};

const steps: Step[] = [
  {
    icons: <FileText size={64} strokeWidth={1.5} />,
    label: "Upload PDF",
    description: "Simply drag and drop your PDF document or click to upload",
  },
  {
    icons: <BrainCircuit size={64} strokeWidth={1.5} />,
    label: "AI Analysis",
    description: "Our advanced AI processes and analyzes your document",
  },
  {
    icons: <FileOutput size={64} strokeWidth={1.5} />,
    label: "Get Summary",
    description: "Receive a clear, concise summary of your document",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative isolate bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-normal uppercase tracking-wide text-rose-600">
            How it works
          </p>
          <h2 className="font-display mt-4 text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl">
            Transform any PDF into an easy-to-digest summary in three simple steps
          </h2>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item, idx) => (
            <div key={item.label} className="relative">
              <StepItem {...item} />
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <MoveRight className="text-rose-300" size={32} strokeWidth={1} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ icons, label, description }: Step) {
  return (
    <div className="utility-card flex h-full flex-col items-center p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-utility-card bg-rose-50 text-rose-600">
        {icons}
      </div>
      <h4 className="mt-6 text-xl font-600 text-rose-950">{label}</h4>
      <p className="mt-2 text-base leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}