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
    name: "Lisa Thompson",
    role: "Customer Success Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" }
    ]
  },
  {
    name: "Laura Davis",
    role: "COO",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-solid fa-globe", url: "#" }
    ]
  },
  {
    name: "Tom White",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-solid fa-globe", url: "#" }
    ]
  },
  {
    name: "James Wilson",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" }
    ]
  },
  {
    name: "Sarah Williams",
    role: "Director of Sales",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-brands fa-facebook", url: "#" },
      { icon: "fa-brands fa-instagram", url: "#" }
    ]
  },
  {
    name: "David Miller",
    role: "Lead Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-solid fa-globe", url: "#" }
    ]
  },
  {
    name: "Emily Johnson",
    role: "Marketing",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-brands fa-instagram", url: "#" }
    ]
  },
  {
    name: "Jillie Bernard",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    socials: [
      { icon: "fa-brands fa-linkedin", url: "#" },
      { icon: "fa-brands fa-twitter", url: "#" },
      { icon: "fa-solid fa-globe", url: "#" }
    ]
  }
];

function SocialIcon({ icon, url }: Social) {
  return (
    <a
      href={url}
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
      <p className="text-blue-600 font-medium text-sm mb-3 uppercase tracking-wide">{member.role}</p>
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
      <section className="bg-brand-blue rounded-md py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Our Team
          </h1>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-2xl mx-auto">
            A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake.
          </p>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
