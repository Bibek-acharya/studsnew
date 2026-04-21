"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [currentStatus, setCurrentStatus] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [recentSchoolName, setRecentSchoolName] = useState("");
  const [provinceSee, setProvinceSee] = useState("");
  const [districtSee, setDistrictSee] = useState("");
  const [localLevelSee, setLocalLevelSee] = useState("");
  const [interestedSubjectSee, setInterestedSubjectSee] = useState("");
  const [interestedCitySee, setInterestedCitySee] = useState("");
  const [collegeNameRunning, setCollegeNameRunning] = useState("");
  const [courseRunning, setCourseRunning] = useState("");
  const [collegeTypeRunning, setCollegeTypeRunning] = useState("");
  const [collegeNameGrad, setCollegeNameGrad] = useState("");
  const [courseGrad, setCourseGrad] = useState("");
  const [interestedSubjectGrad, setInterestedSubjectGrad] = useState("");
  const [interestedCityGrad, setInterestedCityGrad] = useState("");
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const [selectedProvinceForDistrict, setSelectedProvinceForDistrict] = useState("");
  const [elective, setElective] = useState("");

  const toggleDropdown = (id: string) => {
    setDropdowns(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== id) newState[key] = false;
      });
      newState[id] = !prev[id];
      return newState;
    });
  };

  const closeAllDropdowns = () => {
    setDropdowns({});
  };

  const handleStatusSelect = (value: string) => {
    setCurrentStatus(value);
    closeAllDropdowns();
  };

  const handleSchoolTypeSelect = (value: string) => {
    setSchoolType(value);
    closeAllDropdowns();
  };

  const handleProvinceSeeSelect = (value: string) => {
    setProvinceSee(value);
    setSelectedProvinceForDistrict(value);
    setDistrictSee("");
    setLocalLevelSee("");
    closeAllDropdowns();
  };

  const handleDistrictSeeSelect = (value: string) => {
    setDistrictSee(value);
    setLocalLevelSee("");
    closeAllDropdowns();
  };

  const handleElectiveSelect = (value: string) => {
    setElective(value);
    closeAllDropdowns();
  };

  const handleCollegeTypeRunningSelect = (value: string) => {
    setCollegeTypeRunning(value);
    closeAllDropdowns();
  };

  const handleSubmit = async () => {
    if (!contactNumber) {
      setPhoneError("Contact number is required");
      return;
    }
    if (!contactNumber.startsWith("9")) {
      setPhoneError("Number must start with 9");
      return;
    }
    if (contactNumber.length !== 10) {
      setPhoneError("Must be 10 digits");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const preferences: any = {
        contact_number: contactNumber,
        current_status: currentStatus,
      };

      if (currentStatus === "see_graduate") {
        preferences.school_type = schoolType;
        preferences.recent_school_name = recentSchoolName;
        preferences.elective = elective;
        preferences.province = provinceSee;
        preferences.district = districtSee;
        preferences.local_level = localLevelSee;
        preferences.interested_subject = interestedSubjectSee;
        preferences.interested_city = interestedCitySee;
      } else if (currentStatus === "plus_two_running") {
        preferences.college_name = collegeNameRunning;
        preferences.course = courseRunning;
        preferences.college_type = collegeTypeRunning;
      } else if (currentStatus === "plus_two_graduate") {
        preferences.college_name = collegeNameGrad;
        preferences.course = courseGrad;
        preferences.interested_bachelor_course = interestedSubjectGrad;
        preferences.interested_city = interestedCityGrad;
      }

      await apiService.savePreferences(
        {
          preference_role: "student",
          preference_flow: "onboarding",
          preferences,
        },
        token
      );

      onClose();
      router.push("/");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStatus) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const isStep1Valid = () => currentStatus !== "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-120 flex items-center justify-center p-4 sm:p-8">
      <div className={`bg-white rounded-xl shadow-2xl w-full p-8 sm:p-12 transform transition-all duration-300 relative ${step === 1 ? 'max-w-md' : 'max-w-3xl'}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 1 && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight text-center">
              Welcome to studsphere
            </h2>
            <p className="text-gray-500 text-[15px] mb-10 leading-relaxed text-center">
              Don't worry, we're not judging—just tailoring your experience!
            </p>

            <div className="w-full mb-8 relative">
              <label className="block text-sm font-medium text-gray-900 mb-2 text-left">
                Currently I am a
              </label>
              
              <div
                className="w-full border border-gray-200 rounded-lg py-3.5 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue"
                onClick={() => toggleDropdown('status')}
              >
                <span className={currentStatus ? 'text-gray-900' : 'text-gray-400'}>
                  {currentStatus === 'see_graduate' ? 'SEE Graduate' : 
                   currentStatus === 'plus_two_running' ? '+2 Running' : 
                   currentStatus === 'plus_two_graduate' ? '+2 Graduate' : 
                   'Select your current status'}
                </span>
                <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['status'] ? 'rotate-45' : ''}`} />
              </div>
              
              {dropdowns['status'] && (
                <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden">
                  <li
                    className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                    onClick={() => handleStatusSelect('see_graduate')}
                  >
                    SEE Graduate
                  </li>
                  <li
                    className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                    onClick={() => handleStatusSelect('plus_two_running')}
                  >
                    +2 Running
                  </li>
                  <li
                    className="px-4 py-3.5 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                    onClick={() => handleStatusSelect('plus_two_graduate')}
                  >
                    +2 Graduate
                  </li>
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStep1Valid() || loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white text-[15px] transition-colors ${
                isStep1Valid() && !loading
                  ? 'bg-brand-blue hover:bg-brand-hover cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full animate-fade-in">
            <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {currentStatus === 'see_graduate' ? 'SEE Graduate Details' :
                 currentStatus === 'plus_two_running' ? '+2 Running Details' :
                 '+2 Graduate Details'}
              </h3>
            </div>

            {currentStatus === 'see_graduate' && (
              <div className="w-full animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="w-full sm:col-span-2">
                    <label htmlFor="recentSchoolName" className="block text-sm font-medium text-gray-900 mb-2">
                      Recent graduate school name
                    </label>
                    <input
                      type="text"
                      id="recentSchoolName"
                      placeholder="Enter school name"
                      value={recentSchoolName}
                      onChange={(e) => setRecentSchoolName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Select school type
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue"
                      onClick={() => toggleDropdown('schoolType')}
                    >
                      <span className={schoolType ? 'text-gray-900' : 'text-gray-400'}>
                        {schoolType === 'government' ? 'Government' : 
                         schoolType === 'private' ? 'Private' : 
                         'E.g., Government or Private'}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['schoolType'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['schoolType'] && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden">
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                          onClick={() => handleSchoolTypeSelect('government')}
                        >
                          Government
                        </li>
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                          onClick={() => handleSchoolTypeSelect('private')}
                        >
                          Private
                        </li>
                      </ul>
                    )}
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Elective
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue"
                      onClick={() => toggleDropdown('elective')}
                    >
                      <span className={elective ? 'text-gray-900' : 'text-gray-400'}>
                        {elective === 'account' ? 'Account' : 
                         elective === 'computer' ? 'Computer' : 
                         elective === 'math' ? 'Math' : 
                         'Select elective'}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['elective'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['elective'] && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden">
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                          onClick={() => handleElectiveSelect('account')}
                        >
                          Account
                        </li>
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                          onClick={() => handleElectiveSelect('computer')}
                        >
                          Computer
                        </li>
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                          onClick={() => handleElectiveSelect('math')}
                        >
                          Math
                        </li>
                      </ul>
                    )}
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Province
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue"
                      onClick={() => toggleDropdown('provinceSee')}
                    >
                      <span className={provinceSee ? 'text-gray-900' : 'text-gray-400'}>
                        {provinceSee || 'Select province'}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['provinceSee'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['provinceSee'] && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden max-h-48 overflow-y-auto">
                        {NEPAL_PROVINCES.map((prov) => (
                          <li
                            key={prov}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                            onClick={() => handleProvinceSeeSelect(prov)}
                          >
                            {prov}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      District
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => provinceSee && toggleDropdown('districtSee')}
                    >
                      <span className={districtSee ? 'text-gray-900' : 'text-gray-400'}>
                        {districtSee || (provinceSee ? 'Select district' : 'Select province first')}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['districtSee'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['districtSee'] && provinceSee && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden max-h-48 overflow-y-auto">
                        {NEPAL_DISTRICTS[provinceSee as keyof typeof NEPAL_DISTRICTS]?.map((dist) => (
                          <li
                            key={dist}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                            onClick={() => handleDistrictSeeSelect(dist)}
                          >
                            {dist}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Local Level
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => districtSee && toggleDropdown('localLevelSee')}
                    >
                      <span className={localLevelSee ? 'text-gray-900' : 'text-gray-400'}>
                        {localLevelSee || (districtSee ? 'Select local level' : 'Select district first')}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['localLevelSee'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['localLevelSee'] && districtSee && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden max-h-48 overflow-y-auto">
                        {NEPAL_LOCAL_BODIES[districtSee as keyof typeof NEPAL_LOCAL_BODIES]?.map((local) => (
                          <li
                            key={local.name}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                            onClick={() => setLocalLevelSee(local.name)}
                          >
                            {local.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="interestedSubjectSee" className="block text-sm font-medium text-gray-900 mb-2">
                      Interested subject/course
                    </label>
                    <input
                      type="text"
                      id="interestedSubjectSee"
                      placeholder="E.g., Science, Management, CTEVT"
                      value={interestedSubjectSee}
                      onChange={(e) => setInterestedSubjectSee(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="interestedCitySee" className="block text-sm font-medium text-gray-900 mb-2">
                      Interested city or district
                    </label>
                    <input
                      type="text"
                      id="interestedCitySee"
                      placeholder="E.g., Kathmandu, Pokhara"
                      value={interestedCitySee}
                      onChange={(e) => setInterestedCitySee(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full sm:col-span-2">
                    <label htmlFor="contactNumberSee" className="block text-sm font-medium text-gray-900 mb-2">
                      Contact number
                    </label>
                    <div className="relative flex items-center w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-medium">+977-</span>
                      </div>
                      <input
                        type="tel"
                        id="contactNumberSee"
                        placeholder="98XXXXXXXX"
                        maxLength={10}
                        value={contactNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '' || (val.startsWith('9') && val.length <= 10)) {
                            setContactNumber(val);
                            setPhoneError('');
                          }
                        }}
                        className={`w-full border rounded-lg py-3 pl-16 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                          phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brand-blue'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStatus === 'plus_two_running' && (
              <div className="w-full animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label htmlFor="contactNumberRunning" className="block text-sm font-medium text-gray-900 mb-2">
                      Contact number
                    </label>
                    <div className="relative flex items-center w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-medium">+977-</span>
                      </div>
                      <input
                        type="tel"
                        id="contactNumberRunning"
                        placeholder="98XXXXXXXX"
                        maxLength={10}
                        value={contactNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '' || (val.startsWith('9') && val.length <= 10)) {
                            setContactNumber(val);
                            setPhoneError('');
                          }
                        }}
                        className={`w-full border rounded-lg py-3 pl-16 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                          phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brand-blue'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="collegeNameRunning" className="block text-sm font-medium text-gray-900 mb-2">
                      Your college name
                    </label>
                    <input
                      type="text"
                      id="collegeNameRunning"
                      placeholder="Enter college name"
                      value={collegeNameRunning}
                      onChange={(e) => setCollegeNameRunning(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="courseRunning" className="block text-sm font-medium text-gray-900 mb-2">
                      Course
                    </label>
                    <input
                      type="text"
                      id="courseRunning"
                      placeholder="E.g., Science, Management, Humanities"
                      value={courseRunning}
                      onChange={(e) => setCourseRunning(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      College type
                    </label>
                    <div
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 flex justify-between items-center cursor-pointer bg-white transition-colors hover:border-brand-blue"
                      onClick={() => toggleDropdown('collegeTypeRunning')}
                    >
                      <span className={collegeTypeRunning ? 'text-gray-900' : 'text-gray-400'}>
                        {collegeTypeRunning === 'government' ? 'Government' : 
                         collegeTypeRunning === 'private' ? 'Private' : 
                         'E.g., Government or Private'}
                      </span>
                      <X className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdowns['collegeTypeRunning'] ? 'rotate-45' : ''}`} />
                    </div>
                    {dropdowns['collegeTypeRunning'] && (
                      <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg flex-col overflow-hidden">
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors"
                          onClick={() => handleCollegeTypeRunningSelect('government')}
                        >
                          Government
                        </li>
                        <li
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 text-[15px] transition-colors border-t border-gray-50"
                          onClick={() => handleCollegeTypeRunningSelect('private')}
                        >
                          Private
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStatus === 'plus_two_graduate' && (
              <div className="w-full animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label htmlFor="contactNumberGrad" className="block text-sm font-medium text-gray-900 mb-2">
                      Contact number
                    </label>
                    <div className="relative flex items-center w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-medium">+977-</span>
                      </div>
                      <input
                        type="tel"
                        id="contactNumberGrad"
                        placeholder="98XXXXXXXX"
                        maxLength={10}
                        value={contactNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '' || (val.startsWith('9') && val.length <= 10)) {
                            setContactNumber(val);
                            setPhoneError('');
                          }
                        }}
                        className={`w-full border rounded-lg py-3 pl-16 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors ${
                          phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-brand-blue'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="collegeNameGrad" className="block text-sm font-medium text-gray-900 mb-2">
                      Recent college name
                    </label>
                    <input
                      type="text"
                      id="collegeNameGrad"
                      placeholder="Enter college name"
                      value={collegeNameGrad}
                      onChange={(e) => setCollegeNameGrad(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="courseGrad" className="block text-sm font-medium text-gray-900 mb-2">
                      Course completed
                    </label>
                    <input
                      type="text"
                      id="courseGrad"
                      placeholder="E.g., Science, Management"
                      value={courseGrad}
                      onChange={(e) => setCourseGrad(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="interestedSubjectGrad" className="block text-sm font-medium text-gray-900 mb-2">
                      Interested Bachelor's course
                    </label>
                    <input
                      type="text"
                      id="interestedSubjectGrad"
                      placeholder="E.g., BIT, BBA, MBBS"
                      value={interestedSubjectGrad}
                      onChange={(e) => setInterestedSubjectGrad(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="interestedCityGrad" className="block text-sm font-medium text-gray-900 mb-2">
                      Interested city or country
                    </label>
                    <input
                      type="text"
                      id="interestedCityGrad"
                      placeholder="E.g., Kathmandu, USA, Australia"
                      value={interestedCityGrad}
                      onChange={(e) => setInterestedCityGrad(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-brand-blue transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="w-full flex justify-end gap-4 mt-10">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-white bg-gray-900 hover:bg-brand-blue cursor-pointer text-[15px] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3.5 rounded-lg font-bold text-white bg-brand-blue hover:bg-brand-hover cursor-pointer text-[15px] transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;