import { BrainCircuit, FileOutput, FileText, MoveRight } from "lucide-react";
import { ReactNode } from "react";

type Step = {
  icons: ReactNode;
  lable: string;
  description: string;
};

const step: Step[] = [
  {
    icons: <FileText size={64} strokeWidth={1.5} />,
    lable: "Upload PDF",
    description: "Simply drag and drop your pdf document or click to upload",
  },
  {
    icons: <BrainCircuit size={64} strokeWidth={1.5} />,
    lable: "AI Analysis",
    description: "Our advance AI process and analyzes your document",
  },
  {
    icons: <FileOutput size={64} strokeWidth={1.5} />,
    lable: "Get Summary",
    description: "Recevie a clear, concise summary of your document",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden ">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:pt-12">
        <div className="text-center mb-16">
          <h2 className="font-bold text-xl uppercase mb-4 text-rose-500">
            How it works
          </h2>
          <h3 className="font-bold text-3xl max-w-2xl mx-auto">
            Transform any PDF into an easy-to-digest summary in three simple
            steps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {step.map((item, idx) => (
            <div key={idx} className="relative flex items-streach">
              <StepItem key={idx} {...item} />
              {idx < step.length - 1 && (
                <div key={item.description} className="hidden absolute md:block top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <MoveRight
                    className="text-rose-400"
                    size={32}
                    strokeWidth={1}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepItem({ icons, lable, description }: Step) {
  return (
    <div className="relative flex flex-col items-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-rose-500/50 transition-colors duration-300 group w-full h-full cursor-pointer">
      <div className="flex items-center justify-center h-24 w-24 mb-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent group-hover:from-rose-500/30 transition-colors text-rose-500">
        {icons}
      </div>
      <h4 className="text-center font-bold text-xl m">{lable}</h4>
      <p className="text-center text-gray-600 text-sm flex-1">{description}</p>
    </div>
  );
}
