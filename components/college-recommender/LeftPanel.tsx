// "use client";

// import React from "react";
// import Image from "next/image";

// interface LeftPanelProps {
//   step: number;
//   stepImages: Record<number, string>;
// }

// export default function LeftPanel({ step, stepImages }: LeftPanelProps) {
//   return (
//     <div className='hidden h-full items-center justify-start bg-white lg:flex lg:w-1/2'>
//       <div className='relative z-10 w-full max-w-80 lg:max-w-125 flex items-center justify-center h-full'>
//         <Image
//           src={stepImages[step] || '/foucs.svg'}
//           alt="Step illustration"
//           width={500}
//           height={500}
//           className="h-auto w-full max-w-80 object-contain transition-all duration-500"
//         />
//       </div>
//     </div>
//   );
// }