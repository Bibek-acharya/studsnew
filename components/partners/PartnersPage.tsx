interface Partner {
  name: string;
  logo: string;
  description: string;
  website?: string;
}

const partners: Partner[] = [
  {
    name: "Sowers Action Nepal",
    logo: "/images/partners/sa_new.jpeg",
    description:
      "Nepal-based organization dedicated to empowering communities through education and skill development initiatives.",
    website: "https://projectshiksha.hundredgroupnepal.org",
  },

  {
    name: "RONB",
    logo: "/images/partners/ronb.jpg",
    description:
      "Network of organizations working together to create meaningful educational opportunities for underserved communities.",
  },
  {
    name: "Ncell",
    logo: "/images/partners/ncell.png",
    description:
      "Leading telecommunications provider in Nepal, supporting digital education initiatives and connectivity for students.",
    website: "https://www.ncell.axiata.com",
  },
  {
    name: "Creating Opportunities",
    logo: "/images/partners/creating.png",
    description:
      "Organization focused on creating educational and professional pathways for youth in Nepal.",
  },
  {
    name: "Dari Club USA",
    logo: "/images/partners/dari-club.jpeg",
    description:
      "US-based organization supporting educational projects and community development in Nepal.",
  },
];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="flex flex-col">
      <div className="mb-5 relative group overflow-hidden rounded-2xl aspect-square bg-gray-50 flex items-center justify-center p-8">
        <img
          src={partner.logo}
          alt={partner.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
      <p className="text-gray-500 text-xs leading-relaxed mb-3 flex-1">
        {partner.description}
      </p>
      {partner.website && (
        <div className="pt-2">
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-600 font-semibold text-xs hover:text-blue-700 transition-colors"
          >
            Visit Website &rarr;
          </a>
        </div>
      )}
    </div>
  );
}

export default function PartnersPage() {
  return (
    <div className="py-4 sm:py-6 lg:py-4 w-full max-w-350 mx-auto flex flex-col gap-10 lg:gap-12 mb-4">
      <section className="bg-brand-blue rounded-md py-16 sm:py-24 px-6 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Our Partners
          </h1>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-2xl mx-auto">
            We collaborate with industry-leading organizations and platforms to
            deliver seamless, integrated, and powerful experiences for our
            users.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {partners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </section>
    </div>
  );
}
