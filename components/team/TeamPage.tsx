import React from "react";

interface Social {
  icon: string;
  url: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  socials: Social[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Jagdish Dhami",
    role: "Founder & CEO",
    image: "/founders/jagdish.jpeg",
    socials: [
      {
        icon: "fa-brands fa-linkedin",
        url: "https://www.linkedin.com/in/jagdish-dhami-4aa10527a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
    ],
  },
  {
    name: "Santosh Bohara",
    role: "Co-Founder",
    image: "/founders/santosh.jpeg",
    socials: [
      {
        icon: "fa-brands fa-linkedin",
        url: "https://www.linkedin.com/in/santosh-bohara-b0152b351",
      },
    ],
  },
  {
    name: "Badal Gupta",
    role: "Co-Founder ",
    image: "/founders/badal.jpeg",
    socials: [
      {
        icon: "fa-brands fa-linkedin",
        url: "https://www.linkedin.com/in/om-gupta-1a1832274",
      },
    ],
  },
  {
    name: "Spandan Acharya",
    role: "Content Writer",
    image: "/founders/spandan.jpeg",
    socials: [],
  },
  {
    name: "Kanchan Pradhan",
    role: "Content Creator",
    image: "/founders/kanchan.jpeg",
    socials: [],
  },
];

function SocialIcon({ icon, url }: Social) {
  return (
    <a
      href={url}
      target="_blank"
      className="text-gray-400 hover:text-gray-800 text-lg transition-colors duration-200 hover:-translate-y-0.5 inline-block"
    >
      <i className={icon} />
    </a>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col">
      <div className="mb-5 relative group overflow-hidden rounded-2xl aspect-square">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
      <p className="text-blue-600 font-medium text-sm mb-3 tracking-wide">
        {member.role}
      </p>
      <div className="flex items-center gap-4 pt-2">
        {member.socials.map((social, i) => (
          <SocialIcon key={i} icon={social.icon} url={social.url} />
        ))}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto flex flex-col gap-10 lg:gap-12 mb-4">
      <section className="bg-brand-blue rounded-md py-16 sm:py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Our Team
          </h1>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-2xl mx-auto">
            A diverse group of passionate professionals, each bringing unique
            skills and experiences to drive innovation and excellence in every
            project we undertake.
          </p>
        </div>
      </section>
      <section className="px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
