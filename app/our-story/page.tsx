import Link from "next/link";

export const metadata = {
  title: "Our Story | StudSphere",
  description:
    "Discover the story behind StudSphere — Nepal's AI-powered education ecosystem built by students, for students.",
};

const storyBlocks = [
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Who We Are",
    text: "StudSphere is an AI-powered education ecosystem built by students, for students. We believe that every student deserves easy access to reliable educational information, guidance, and opportunities without having to search across countless websites and social media pages. Our goal is to simplify the educational journey by bringing everything students need into one smart and trusted platform.",
  },
  {
    icon: "fa-solid fa-rocket",
    title: "How It Began",
    text: "Founded by bachelor's students Jagdish Dhami, Santosh Bohara, and Badal Gupta, StudSphere was created after experiencing firsthand the challenges students face when searching for colleges, scholarships, entrance exams, internships, events, career guidance, and study resources. We envisioned a platform that not only provides accurate information but also uses artificial intelligence to deliver personalized recommendations and instant support tailored to each student's needs.",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Our Commitment",
    text: "At StudSphere, we are committed to empowering students at every stage of their academic journey. Whether you're exploring colleges, preparing for entrance exams, searching for scholarships, discovering internships, planning to study abroad, or seeking career advice, StudSphere is designed to be your trusted companion. Through innovation, transparency, and a student-first approach, we aim to build Nepal's most comprehensive education ecosystem and create a future where every student can make informed decisions with confidence.",
  },
];


export default function OurStoryPage() {
  return (
    <div className="py-4 sm:py-6 lg:py-6 w-full max-w-350 mx-auto flex flex-col gap-16 lg:gap-20 mb-6">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-brand-blue rounded-2xl py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/[0.03]" />

        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5">
            Our Story
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            A diverse group of passionate professionals, each bringing unique
            skills and experiences to drive innovation and excellence in every
            project we undertake.
          </p>
        </div>
      </section>

      {/* ==================== OUR STORY BLOCKS ==================== */}
      <section className="px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {storyBlocks.map((block, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:-translate-y-1 hover:border-blue-500/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                <i className={`${block.icon} text-brand-blue text-xl`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {block.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {block.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== JOIN OUR MISSION ==================== */}
      <section className="px-4 sm:px-6 md:px-8">
        <div className="relative bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl py-14 md:py-18 px-6 text-center overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-[-30px] left-[-30px] w-28 h-28 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-sm md:text-base text-blue-200 max-w-lg mx-auto mb-8">
              Be part of Nepal&apos;s most comprehensive education ecosystem.
              Let&apos;s shape the future of learning together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-block bg-white text-brand-blue font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
