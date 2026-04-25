import React from "react";
import { getAdPlacement } from "@/lib/ad-controller";

type CollegeAdItem = {
  title: string;
  location: string;
  rating: string;
  reviews: string;
  programs: string;
  website: string;
  url: string;
  image: string;
};

const adData: {
  monthlySpotlight: CollegeAdItem[];
  mostSearched: CollegeAdItem[];
} = {
  monthlySpotlight: [
    {
      title: "Advance Foundation",
      location: "Lalitpur",
      rating: "4.8",
      reviews: "123",
      programs: "+2, Bachelor, Master",
      website: "advancefoundation.edu.np",
      url: "https://advancefoundation.edu.np",
      image: "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    },
    {
      title: "KIST College",
      location: "Kamalpokhari, Kathmandu",
      rating: "4.6",
      reviews: "245",
      programs: "+2, Bachelor, Master",
      website: "kist.edu.np",
      url: "https://kist.edu.np",
      image: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    },
    {
      title: "Trinity International College",
      location: "Dillibazar, Kathmandu",
      rating: "4.7",
      reviews: "189",
      programs: "+2, Bachelor, Master",
      website: "trinity.edu.np",
      url: "https://www.trinity.edu.np",
      image: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    },
  ],
  mostSearched: [
    {
      title: "Trinity International College",
      location: "Dillibazar, Kathmandu",
      rating: "4.7",
      reviews: "189",
      programs: "+2, Bachelor, Master",
      website: "trinity.edu.np",
      url: "https://www.trinity.edu.np",
      image: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    },
    {
      title: "Advance Foundation",
      location: "Lalitpur",
      rating: "4.8",
      reviews: "123",
      programs: "+2, Bachelor, Master",
      website: "advancefoundation.edu.np",
      url: "https://advancefoundation.edu.np",
      image: "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    },
    {
      title: "KIST College",
      location: "Kamalpokhari, Kathmandu",
      rating: "4.6",
      reviews: "245",
      programs: "+2, Bachelor, Master",
      website: "kist.edu.np",
      url: "https://kist.edu.np",
      image: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    },
  ],
};

const ColumnCard: React.FC<{ item: CollegeAdItem }> = ({ item }) => {
  return (
    <div className="cursor-pointer rounded-[10px] border border-transparent bg-white p-2.5  transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-100 bg-white p-1">
          <img src={item.image} alt={item.title} className="h-full w-full object-contain" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-0 flex items-center gap-1">
            <h3 className="truncate text-[14px] font-bold leading-snug text-gray-900">{item.title}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#0040ff"
              className="shrink-0"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
            </svg>
          </div>

          <div className="mb-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="whitespace-nowrap text-[11.5px] font-normal text-gray-500">{item.location}</span>
            <span className="h-[2.5px] w-[2.5px] rounded-full bg-gray-300"></span>
            <span className="whitespace-nowrap text-[11.5px] font-medium text-gray-700">
              {item.rating}
              <span className="ml-1 font-normal text-gray-500">({item.reviews} reviews)</span>
            </span>
          </div>

          <div className="mb-0.5 truncate text-[11.5px] text-gray-600">{item.programs}</div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-1 text-[11.5px] text-gray-500 transition-colors hover:text-blue-600 hover:underline"
          >
            {item.website}
          </a>
        </div>
      </div>
    </div>
  );
};

const TrendingCollegesAd: React.FC = () => {
  const placement = getAdPlacement("find-college-trending");

  if (!placement.enabled) return null;

  return (
    <div className="w-full max-w-300">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="my-2 rounded-md bg-[radial-gradient(circle_at_center,#0044ff_0%,#0011bb_100%)] p-3 text-white md:p-4 lg:my-4">
          <h3 className="mb-3 text-[17px] font-medium">{placement.headline}</h3>
          <div className="flex flex-col gap-2">
            {adData.monthlySpotlight.map((item) => (
              <ColumnCard key={`spotlight-${item.title}`} item={item} />
            ))}
          </div>
        </div>

        <div className="my-2 rounded-md bg-[radial-gradient(circle_at_center,#0044ff_0%,#0011bb_100%)] p-3 text-white md:p-4 lg:my-4">
          <h3 className="mb-3 text-[17px] font-medium">
            {placement.description || "Most searched"}
          </h3>
          <div className="flex flex-col gap-2">
            {adData.mostSearched.map((item) => (
              <ColumnCard key={`searched-${item.title}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCollegesAd;
