
import LogoLoop from "./LogoLoop";
import { SiFigma, SiOpenai } from "react-icons/si";
import { TbWorldWww } from "react-icons/tb";
import Image from "next/image";

const techLogos = [
  {
    node: <Image src="/skills/premiere.svg" alt="Adobe Premiere Pro" width={56} height={56} className="w-full h-full object-contain" />,
    title: "Adobe Premiere Pro",
    href: "https://www.adobe.com/products/premiere.html",
    hoverColor: "#9999FF",
  },
  {
    node: <Image src="/skills/aftereffects.svg" alt="Adobe After Effects" width={56} height={56} className="w-full h-full object-contain" />,
    title: "Adobe After Effects",
    href: "https://www.adobe.com/products/aftereffects.html",
    hoverColor: "#9999FF",
  },
  {
    node: <Image src="/skills/blender.svg" alt="Blender" width={56} height={56} className="w-full h-full object-contain" />,
    title: "Blender",
    href: "https://www.blender.org",
    hoverColor: "#F5792A",
  },
  {
    node: <TbWorldWww />,
    title: "Full Stack Web Development",
    href: "https://developer.mozilla.org",
    hoverColor: "#00D9FF",
  },
  {
    node: <SiFigma />,
    title: "Figma",
    href: "https://www.figma.com",
    hoverColor: "#F24E1E",
  },
  {
    node: <SiOpenai />,
    title: "Artificial Intelligence",
    href: "https://openai.com",
    hoverColor: "#10A37F",
  },
  {
    node: <Image src="/skills/flstudio.png" alt="FL Studio" width={56} height={56} className="w-full h-full object-contain" />,
    title: "FL Studio",
    href: "https://www.image-line.com/fl-studio/",
    hoverColor: "#F87D1B",
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="w-full bg-[#0d0d0d] text-white"
    >
      {/* Skills Heading */}
      <div className="w-full pt-4 pb-8 md:pt-6 md:pb-10 border-y border-white/10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center">
          Skills
        </h2>
      </div>

      {/* Technology Logo Carousel */}
      <div className="w-full pt-4 pb-6 md:pt-5 md:pb-8">
        <div className="w-full overflow-hidden">
          <LogoLoop
            logos={techLogos}
            speed={50}
            direction="left"
            logoHeight={56}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            labels="hover"
            muted={0}
            fadeOut={false}
            intro={false}
            ariaLabel="Technologies and tools"
          />
        </div>
      </div>
    </section>
  );
}

