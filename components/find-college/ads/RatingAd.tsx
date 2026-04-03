import React, { useState } from 'react';

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Excellent"
};

const RatingAd: React.FC = () => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTags, setActiveTags] = useState<Record<string, boolean>>({});
  
  const handleMouseEnter = (index: number) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);
  
  const handleClick = (index: number) => {
    setCurrentRating(index);
    setIsModalOpen(true);
    setActiveTags({});
  };

  const getTagsForRating = (rating: number) => {
    if (rating <= 3) {
      return ['Incorrect', 'Irrelevant', 'Insufficient', 'Confusing', 'Hard to use'];
    }
    return ['Helpful', 'Clear', 'Accurate', 'Easy to understand', 'Great Design'];
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev => ({ ...prev, [tag]: !prev[tag] }));
  };

  const displayRating = hoverRating > 0 ? hoverRating : currentRating;

  return (
    <>
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 w-full p-5 md:p-6 flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8 transition-all my-2 lg:my-4">
        <div className="shrink-0 flex justify-center">
            <img 
                src="https://i.pinimg.com/1200x/31/bb/5b/31bb5b12e99840c5a1571878f30b69ef.jpg" 
                alt="Feedback Illustration" 
                className="w-32 md:w-44 h-auto object-contain rounded-xl"
            />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-xl md:text-[22px] font-bold text-[#1E3A8A] tracking-tight mb-1 sm:whitespace-nowrap">
                Your opinion matters to us!
            </h2>
            
            <p className="text-[15px] text-[#4A5568] mb-4">
                Rate your experience using this page so far.
            </p>

            <div className="flex items-center gap-1.5 md:gap-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <svg 
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                    className={`w-9 h-9 md:w-10 md:h-10 cursor-pointer stroke-2 transition-transform duration-200 active:scale-90 ${displayRating >= index ? 'fill-[#FFC107] text-[#FFC107] scale-110' : 'fill-transparent text-[#1E3A8A]'}`}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
            </div>
            
            <p className={`mt-2 text-[13px] font-semibold h-5 transition-opacity text-[#1E3A8A] ${displayRating > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {displayRating > 0 ? ratingLabels[displayRating] : "Hover Status"}
            </p>
        </div>
      </div>

      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 transition-opacity ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsModalOpen(false)}>
        <div className={`bg-white rounded-[20px] shadow-2xl max-w-[480px] w-full p-8 relative transition-transform duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your opinion matters to us!</h3>
                <p className="text-[15px] text-gray-600">We will use this feedback to improve your experience.</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((index) => (
                <svg 
                  key={index}
                  className={`w-10 h-10 stroke-2 ${currentRating >= index ? 'fill-[#FFC107] text-[#FFC107]' : 'fill-transparent text-[#1E3A8A]'}`} 
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ))}
            </div>
            
            <p className="text-center text-[15px] text-gray-500 font-medium mb-6">
                You rated {ratingLabels[currentRating]}
            </p>

            <hr className="border-t border-dashed border-gray-300 my-5" />

            <div className="mb-5">
                <p className="text-[15px] font-medium text-gray-800 mb-3">
                  {currentRating <= 3 ? "What went wrong?" : "What did you like most?"}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {getTagsForRating(currentRating).map((tag, idx) => (
                    <button 
                      key={idx}
                      onClick={() => toggleTag(tag)}
                      className={`border rounded-full px-4 py-1.5 text-sm transition-colors ${activeTags[tag] ? 'bg-[#f3f4f6] border-[#9ca3af] text-[#374151]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                      {tag}
                    </button>
                  ))}
                </div>
            </div>

            <hr className="border-t border-dashed border-gray-300 my-5" />

            <div>
                <p className="text-[15px] font-medium text-gray-800 mb-3">Please provide your feedback so that we can improve your experience.</p>
                <textarea 
                    className="w-full border border-gray-300 rounded-[12px] p-3 text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] resize-none h-24" 
                    placeholder="Write here..."
                ></textarea>
            </div>

            <button 
              onClick={() => {
                alert("Thank you for your feedback!");
                setIsModalOpen(false);
              }}
              className="bg-[#1E3A8A] hover:bg-[#152860] text-white font-semibold py-2.5 px-10 rounded-full mt-8 mx-auto block transition-colors shadow-sm">
                Submit
            </button>
        </div>
      </div>
    </>
  );
};

export default RatingAd;
