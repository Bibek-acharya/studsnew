import React from 'react';

const nepalLocations = [
    { name: "Kathmandu", count: 854 },
    { name: "Lalitpur", count: 420 },
    { name: "Pokhara", count: 315 },
    { name: "Bhaktapur", count: 280 },
    { name: "Chitwan", count: 195 },
    { name: "Biratnagar", count: 150 },
    { name: "Dharan", count: 110 },
    { name: "Bagmati Province", count: 1650 },
    { name: "Gandaki Province", count: 480 },
    { name: "Koshi Province", count: 320 }
];

const LocationAd: React.FC = () => {
  return (
    <div className="bg-[#eefbf4] p-8 md:p-10 rounded-md w-full  border border-green-100 my-2 lg:my-4 flex flex-col justify-center">
      <h2 className="text-xl md:text-2xl font-semibold text-green-900 mb-8 tracking-tight text-center md:text-left">
        Most preferred locations for B.E. / B.Tech
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {nepalLocations.map((location, idx) => (
          <div key={idx} className="bg-white px-5 py-2.5 rounded-full  text-[15px] cursor-pointer border border-green-50 flex items-center hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(22,101,52,0.1),0_2px_4px_-1px_rgba(22,101,52,0.06)] transition-all duration-200 ease-in-out">
            <span className="text-gray-800 font-medium mr-1.5">{location.name}</span>
            <span className="text-gray-400">({location.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationAd;
