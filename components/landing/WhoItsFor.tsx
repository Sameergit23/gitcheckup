import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const AUDIENCES = [
  {
    title: "Students & hackathons",
    body: "Make your repos judge-ready before you submit: a clear README and a demo link that loads.",
    strip: "bg-pink",
  },
  {
    title: "Freelancers",
    body: "Clients click your links. Make sure every one of them works before they do.",
    strip: "bg-yellow",
  },
  {
    title: "Job seekers",
    body: "Recruiters skim READMEs in seconds. Make those seconds count.",
    strip: "bg-mint",
  },
];

export function WhoItsFor() {
  return (
    <section
      aria-labelledby="who-heading"
      className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeading id="who-heading" eyebrow="Who it's for">
        Anyone whose GitHub gets looked at.
      </SectionHeading>

      <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal as="li" key={a.title} delay={i * 120} className="card flex flex-col">
            <h3 className={`border-b-3 border-ink px-5 py-4 font-display text-xl uppercase leading-tight ${a.strip}`}>
              {a.title}
            </h3>
            <p className="p-5">{a.body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
