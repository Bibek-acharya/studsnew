"use client";

import { useState, useMemo, useEffect } from "react";
import {
  apiService,
  type EducationEntryItem,
  getImageUrl,
} from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Globe,
  DollarSign,
  FileText,
  Upload,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  GraduationCap,
  Building2,
} from "lucide-react";
import {
  NEPAL_PROVINCES,
  NEPAL_DISTRICTS,
  NEPAL_LOCAL_BODIES,
} from "@/lib/location-data";

interface EducationEntry {
  id: number;
  level: string;
  institutionName: string;
  boardUniversity: string;
  country: string;
  stream: string;
  startYear: string;
  endYear: string;
  gradingSystem: string;
  grade: string;
}

export default function ProfileSection() {
  const { user, setUser } = useAuth();
  const [profileTab, setProfileTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [rawPreferences, setRawPreferences] = useState<Record<string, any>>({});
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [profileAddress, setProfileAddress] = useState("");
  const [completion, setCompletion] = useState(0);

  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    alternatePhone: "",
    province: "",
    district: "",
    localLevel: "",
    bio: "",
  });

  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [budgetFunding, setBudgetFunding] = useState({
    tuitionBudgetRange: "",
    livingExpenseBudget: "",
    fundingSources: [] as string[],
    willingLoan: "yes",
    scholarshipRequired: "yes",
    scholarshipType: "Merit Based",
    preferredField: "",
    targetLevel: "",
  });

  interface ProfileDocument {
    id: number;
    file_name: string;
    file_size: number;
    type: string;
    mime_type: string;
    url: string;
    created_at: string;
  }

  const [profileDocuments, setProfileDocuments] = useState<ProfileDocument[]>(
    [],
  );
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleEducationAdd = () => {
    const newEntry: EducationEntry = {
      id: -Date.now(),
      level: "",
      institutionName: "",
      boardUniversity: "",
      country: "",
      stream: "",
      startYear: "",
      endYear: "",
      gradingSystem: "GPA",
      grade: "",
    };
    setEducation([...education, newEntry]);
  };

  const handleEducationRemove = async (id: number) => {
    if (id > 0) {
      try {
        await apiService.deleteEducationEntry(id);
      } catch (err: any) {
        setError(err.message || "Failed to delete education entry");
        return;
      }
    }
    setEducation(education.filter((e) => e.id !== id));
  };

  const handleEducationChange = (
    id: number,
    field: keyof EducationEntry,
    value: string,
  ) => {
    setEducation(
      education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDoc(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = file.type.startsWith("image/") ? "image" : "document";
        const res = await apiService.uploadProfileDocument(file, type);
        if (res.data) {
          setProfileDocuments((prev) => [...prev, res.data]);
        }
      }
      setToast({ message: "Documents uploaded successfully", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to upload document",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await apiService.deleteProfileDocument(docId);
      setProfileDocuments((prev) => prev.filter((d) => d.id !== docId));
      setToast({ message: "Document deleted", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ message: "Failed to delete document", type: "error" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await apiService.updateProfile({
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        middle_name: personalData.middleName || undefined,
        phone: personalData.phone,
        alternate_phone: personalData.alternatePhone || undefined,
        date_of_birth: personalData.dateOfBirth,
        gender: personalData.gender,
        nationality: personalData.nationality,
        address: JSON.stringify({
          province: personalData.province,
          district: personalData.district,
          localLevel: personalData.localLevel,
        }),
        bio: personalData.bio,
      });

      const updatedEducation = await Promise.all(
        education.map(async (entry) => {
          const payload = {
            level: entry.level,
            institution_name: entry.institutionName,
            board_university: entry.boardUniversity,
            country: entry.country,
            stream: entry.stream,
            start_year: entry.startYear,
            end_year: entry.endYear,
            grading_system: entry.gradingSystem,
            grade: entry.grade,
          };
          if (entry.id > 0) {
            await apiService.updateEducationEntry(entry.id, payload);
            return entry;
          } else {
            const res = await apiService.createEducationEntry(payload);
            return { ...entry, id: res.data.id };
          }
        }),
      );
      setEducation(updatedEducation);

      await apiService.savePreferences(
        {
          preference_role: "student",
          preference_flow: "profile",
          preferences: {
            target_level: budgetFunding.targetLevel,
            preferred_field: budgetFunding.preferredField,
            tuition_budget_range: budgetFunding.tuitionBudgetRange,
            living_expense_budget: budgetFunding.livingExpenseBudget,
            funding_sources: budgetFunding.fundingSources,
            willing_loan: budgetFunding.willingLoan,
            scholarship_required: budgetFunding.scholarshipRequired,
            scholarship_type: budgetFunding.scholarshipType,
          },
        },
        "",
      );

      if (selectedImageFile) {
        try {
          const uploadRes =
            await apiService.uploadProfilePicture(selectedImageFile);
          if (uploadRes.data?.image_url) {
            setProfileImage(getImageUrl(uploadRes.data.image_url));
            if (user) {
              setUser({ ...user, image_url: uploadRes.data.image_url });
            }
          }
          setSelectedImageFile(null);
        } catch (uploadErr: any) {
          setToast({
            message:
              "Profile saved but image upload failed: " +
              (uploadErr.message || "Unknown error"),
            type: "error",
          });
          setTimeout(() => setToast(null), 5000);
        }
      }

      setEditMode(false);
      setToast({ message: "Profile saved", type: "success" });
      setTimeout(() => setToast(null), 3000);

      const [refreshedProfile, refreshedStats] = await Promise.all([
        apiService.getProfile().catch(() => null),
        apiService.getDashboardStats().catch(() => null),
      ]);
      if (refreshedStats?.data?.profile_completion !== undefined) {
        setCompletion(refreshedStats.data.profile_completion);
      }
      if (refreshedProfile?.data) {
        const p = refreshedProfile.data;
        setPersonalData((prev) => ({
          ...prev,
          firstName: p.first_name || prev.firstName,
          lastName: p.last_name || prev.lastName,
          middleName: p.middle_name || prev.middleName,
          phone: p.phone || prev.phone,
          alternatePhone: p.alternate_phone || prev.alternatePhone,
          dateOfBirth: p.date_of_birth || prev.dateOfBirth,
          gender: p.gender || prev.gender,
          nationality: p.nationality || prev.nationality,
          bio: p.bio ?? prev.bio,
        }));
      }
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to save profile",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileRes, educationRes, statsRes] = await Promise.all([
          apiService.getProfile(),
          apiService.getEducationEntries(),
          apiService.getDashboardStats().catch(() => null),
        ]);

        if (statsRes?.data?.profile_completion !== undefined) {
          setCompletion(statsRes.data.profile_completion);
        }

        const profile = profileRes.data;
        let province = "",
          district = "",
          localLevel = "";
        if (profile.address) {
          try {
            const parsed = JSON.parse(profile.address);
            province = parsed.province || "";
            district = parsed.district || "";
            localLevel = parsed.localLevel || "";
          } catch {}
        }

        const prefs = profile.preferences?.preferences || {};

        setOnboardingCompleted(!!profile.preferences?.onboarding_completed);
        setProfileAddress(profile.address || "");

        setPersonalData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          middleName: profile.middle_name || "",
          dateOfBirth: profile.date_of_birth || "",
          gender: profile.gender || "",
          nationality: profile.nationality || "",
          email: profile.email || "",
          phone: profile.phone || prefs.contact_number || "",
          alternatePhone: profile.alternate_phone || "",
          province,
          district,
          localLevel,
          bio: profile.bio || "",
        });

        if (educationRes.data) {
          setEducation(
            educationRes.data.map((entry: EducationEntryItem) => ({
              id: entry.id,
              level: entry.level,
              institutionName: entry.institution_name,
              boardUniversity: entry.board_university,
              country: entry.country,
              stream: entry.stream,
              startYear: entry.start_year,
              endYear: entry.end_year,
              gradingSystem: entry.grading_system,
              grade: entry.grade,
            })),
          );
        }

        setRawPreferences(prefs);
        setBudgetFunding({
          targetLevel:
            prefs.target_level || prefs.course || prefs.education_level || "",
          preferredField:
            prefs.preferred_field || prefs.course || prefs.field || "",
          tuitionBudgetRange:
            prefs.tuition_budget_range ||
            prefs.budget_range ||
            prefs.budget ||
            "",
          livingExpenseBudget: prefs.living_expense_budget || "",
          fundingSources: prefs.funding_sources || [],
          willingLoan: prefs.willing_loan || "yes",
          scholarshipRequired:
            prefs.scholarship_required || prefs.scholarship || "No",
          scholarshipType: prefs.scholarship_type || "Merit Based",
        });

        if (profile.image_url) {
          setProfileImage(getImageUrl(profile.image_url));
        }

        setSelectedProvince(province || "");
        setSelectedDistrict(district || "");

        // Fetch documents
        try {
          const docRes = await apiService.getProfileDocuments();
          setProfileDocuments(docRes.data || []);
        } catch {
          // backend endpoint may not exist yet - silent fail
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const localBodies = useMemo(() => {
    return (
      NEPAL_LOCAL_BODIES[selectedDistrict as keyof typeof NEPAL_LOCAL_BODIES] ||
      []
    );
  }, [selectedDistrict]);

  // completion is set from backend dashboard stats in fetchProfileData

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-md border border-slate-200 text-center animate-pulse">
            <div className="w-24 h-24 rounded-full mx-auto bg-slate-200" />
            <div className="h-5 bg-slate-200 rounded mt-4 w-3/4 mx-auto" />
            <div className="h-4 bg-slate-200 rounded mt-2 w-1/2 mx-auto" />
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-md border border-slate-200 min-h-[600px] animate-pulse p-6">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading profile</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-md border border-slate-200 text-center">
          <div className="relative inline-block">
            {profileImage ? (
              <img
                src={profileImage}
                className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50 object-cover"
                alt="Profile"
              />
            ) : (
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50"
                alt="Profile"
              />
            )}
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <Upload className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">
            {personalData.firstName} {personalData.middleName}{" "}
            {personalData.lastName}
          </h2>
          <p className="text-sm text-slate-500">Student Profile</p>

          <div className="mt-6 text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Profile Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-brand-blue h-2 rounded-full"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>

          {(budgetFunding.targetLevel ||
            budgetFunding.preferredField ||
            budgetFunding.tuitionBudgetRange) && (
            <div className="mt-6 text-left border-t border-slate-100 pt-4">
              <h3 className="text-xs font-semibold text-slate-500 mb-3">
                Preferences
              </h3>
              <div className="space-y-3">
                {budgetFunding.targetLevel && (
                  <div>
                    <p className="text-xs text-slate-500">Target Level</p>
                    <p className="text-sm font-medium text-slate-800">
                      {budgetFunding.targetLevel}
                    </p>
                  </div>
                )}
                {budgetFunding.preferredField && (
                  <div>
                    <p className="text-xs text-slate-500">Preferred Field</p>
                    <p className="text-sm font-medium text-slate-800">
                      {budgetFunding.preferredField}
                    </p>
                  </div>
                )}
                {budgetFunding.tuitionBudgetRange && (
                  <div>
                    <p className="text-xs text-slate-500">Tuition Budget</p>
                    <p className="text-sm font-medium text-slate-800">
                      {budgetFunding.tuitionBudgetRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white rounded-md border border-slate-200 min-h-[600px]">
          <div className="border-b border-slate-100 overflow-x-auto">
            <div className="flex px-6 justify-between items-center">
              <nav className="flex gap-6 min-w-max">
                {[
                  { id: "personal", label: "Personal Details", icon: User },
                  {
                    id: "education",
                    label: "Education History",
                    icon: GraduationCap,
                  },
                  { id: "budget", label: "Budget & Funding", icon: DollarSign },
                  { id: "documents", label: "Documents", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id)}
                    className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${
                      profileTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                disabled={saving}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  editMode
                    ? "bg-brand-blue text-white hover:bg-blue-700"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4" />{" "}
                    {saving ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {profileTab === "personal" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Info
                  </h3>
                  <div className="space-y-4">
                    {/* Name Row - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          First Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={personalData.firstName}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Middle Name (Optional)
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={personalData.middleName}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                middleName: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.middleName || "-"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Last Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={personalData.lastName}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Date of Birth
                        </label>
                        {editMode ? (
                          <input
                            type="date"
                            value={personalData.dateOfBirth}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                dateOfBirth: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.dateOfBirth}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Gender
                        </label>
                        {editMode ? (
                          <select
                            value={personalData.gender}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                gender: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.gender}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Nationality
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={personalData.nationality}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                nationality: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.nationality}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    {/* Email - read only */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                        {personalData.email}
                      </p>
                    </div>

                    {/* Phone Row - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={personalData.phone}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Alternate Phone
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={personalData.alternatePhone}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                alternatePhone: e.target.value,
                              })
                            }
                            placeholder="Optional"
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.alternatePhone || "-"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location Row - 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Province
                        </label>
                        {editMode ? (
                          <select
                            value={selectedProvince}
                            onChange={(e) => {
                              setSelectedProvince(e.target.value);
                              const districts =
                                NEPAL_DISTRICTS[
                                  e.target.value as keyof typeof NEPAL_DISTRICTS
                                ];
                              setPersonalData({
                                ...personalData,
                                province: e.target.value,
                                district: districts?.[0] || "",
                                localLevel: "",
                              });
                              setSelectedDistrict(districts?.[0] || "");
                            }}
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            {NEPAL_PROVINCES.map((prov) => (
                              <option key={prov} value={prov}>
                                {prov}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.province}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          District
                        </label>
                        {editMode ? (
                          <select
                            value={selectedDistrict}
                            onChange={(e) => {
                              setSelectedDistrict(e.target.value);
                              setPersonalData({
                                ...personalData,
                                district: e.target.value,
                                localLevel: "",
                              });
                            }}
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            {(
                              NEPAL_DISTRICTS[
                                selectedProvince as keyof typeof NEPAL_DISTRICTS
                              ] || []
                            ).map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.district}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Local Level
                        </label>
                        {editMode ? (
                          <select
                            value={personalData.localLevel}
                            onChange={(e) =>
                              setPersonalData({
                                ...personalData,
                                localLevel: e.target.value,
                              })
                            }
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="">Select Local Level</option>
                            {localBodies.map((body: { name: string }) => (
                              <option key={body.name} value={body.name}>
                                {body.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                            {personalData.localLevel}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Info (collapsible) */}
                    <details className="mt-4">
                      <summary className="text-sm font-semibold text-slate-600 cursor-pointer hover:text-slate-800 select-none">
                        Additional Info
                      </summary>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Bio
                          </label>
                          {editMode ? (
                            <textarea
                              value={personalData.bio}
                              onChange={(e) =>
                                setPersonalData({
                                  ...personalData,
                                  bio: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {personalData.bio || "-"}
                            </p>
                          )}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {profileTab === "education" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Education History
                  </h3>
                  {editMode && (
                    <button
                      onClick={handleEducationAdd}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {education.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="border border-slate-200 rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold text-slate-500">
                          Entry {index + 1}
                        </span>
                        {editMode && (
                          <button
                            onClick={() => handleEducationRemove(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Level
                          </label>
                          {editMode ? (
                            <select
                              value={entry.level}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "level",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            >
                              <option value="">Select Level</option>
                              <option>SEE</option>
                              <option>+2</option>
                              <option>A Level</option>
                              <option>Diploma</option>
                              <option>Bachelor</option>
                            </select>
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.level}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Institution Name
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.institutionName}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "institutionName",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.institutionName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Board/University
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.boardUniversity}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "boardUniversity",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.boardUniversity}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Country
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.country}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "country",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.country}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Field/Stream
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.stream}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "stream",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.stream}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Start Year
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.startYear}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "startYear",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.startYear}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            End Year
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.endYear}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "endYear",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.endYear}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            Grading System
                          </label>
                          {editMode ? (
                            <select
                              value={entry.gradingSystem}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "gradingSystem",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            >
                              <option>GPA</option>
                              <option>Percentage</option>
                            </select>
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.gradingSystem}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">
                            GPA / Percentage
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={entry.grade}
                              onChange={(e) =>
                                handleEducationChange(
                                  entry.id,
                                  "grade",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                              {entry.grade}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profileTab === "budget" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Budget & Funding
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tuition Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Tuition Budget Range (Per Year)
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.tuitionBudgetRange}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              tuitionBudgetRange: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="">Select Range</option>
                          <option value="<50000">Under Rs. 50,000</option>
                          <option value="50000-200000">
                            Rs. 50,000 - 2,00,000
                          </option>
                          <option value="200000-500000">
                            Rs. 2,00,000 - 5,00,000
                          </option>
                          <option value="500000-1000000">
                            Rs. 5,00,000 - 10,00,000
                          </option>
                          <option value=">1000000">Above Rs. 10,00,000</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.tuitionBudgetRange || "-"}
                        </p>
                      )}
                    </div>

                    {/* Living Expense Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Monthly Living Expense Budget
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.livingExpenseBudget}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              livingExpenseBudget: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="">Select Range</option>
                          <option value="<5000">Under Rs. 5,000</option>
                          <option value="5000-15000">Rs. 5,000 - 15,000</option>
                          <option value="15000-30000">
                            Rs. 15,000 - 30,000
                          </option>
                          <option value=">30000">Above Rs. 30,000</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.livingExpenseBudget || "-"}
                        </p>
                      )}
                    </div>

                    {/* Funding Sources */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Funding Sources (select all that apply)
                      </label>
                      {editMode ? (
                        <div className="flex flex-wrap gap-3">
                          {[
                            "Family Support",
                            "Education Loan",
                            "Scholarship",
                            "Work-Study",
                            "Personal Savings",
                          ].map((source) => (
                            <label
                              key={source}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={budgetFunding.fundingSources.includes(
                                  source,
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setBudgetFunding({
                                      ...budgetFunding,
                                      fundingSources: [
                                        ...budgetFunding.fundingSources,
                                        source,
                                      ],
                                    });
                                  } else {
                                    setBudgetFunding({
                                      ...budgetFunding,
                                      fundingSources:
                                        budgetFunding.fundingSources.filter(
                                          (s) => s !== source,
                                        ),
                                    });
                                  }
                                }}
                                className="rounded border-slate-300"
                              />
                              {source}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.fundingSources.join(", ") || "-"}
                        </p>
                      )}
                    </div>

                    {/* Willing to take loan */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Willing to take education loan?
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.willingLoan}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              willingLoan: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="maybe">
                            Maybe, depending on terms
                          </option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.willingLoan}
                        </p>
                      )}
                    </div>

                    {/* Scholarship Required */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Scholarship Required?
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.scholarshipRequired}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              scholarshipRequired: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.scholarshipRequired}
                        </p>
                      )}
                    </div>

                    {/* Scholarship Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Preferred Scholarship Type
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.scholarshipType}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              scholarshipType: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option>Merit Based</option>
                          <option>Need Based</option>
                          <option>Sports</option>
                          <option>Minority</option>
                          <option>Any</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.scholarshipType}
                        </p>
                      )}
                    </div>

                    {/* Target Level (keep from original) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Target Level
                      </label>
                      {editMode ? (
                        <select
                          value={budgetFunding.targetLevel}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              targetLevel: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="">Select</option>
                          <option>+2</option>
                          <option>A-Level</option>
                          <option>Diploma</option>
                          <option>Bachelor</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.targetLevel}
                        </p>
                      )}
                    </div>

                    {/* Preferred Field (keep from original) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Preferred Field
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={budgetFunding.preferredField}
                          onChange={(e) =>
                            setBudgetFunding({
                              ...budgetFunding,
                              preferredField: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                          {budgetFunding.preferredField || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {Object.keys(rawPreferences).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Additional Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(rawPreferences)
                        .filter(
                          ([key]) =>
                            ![
                              "target_level",
                              "preferred_field",
                              "tuition_budget_range",
                              "living_expense_budget",
                              "funding_sources",
                              "willing_loan",
                              "scholarship_required",
                              "scholarship_type",
                              "onboarding_completed",
                              "course",
                              "field",
                              "education_level",
                              "budget",
                              "budget_range",
                              "scholarship",
                              "contact_number",
                            ].includes(key),
                        )
                        .map(([key, value]) => {
                          const displayVal = String(value)
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ");
                          return (
                            <div
                              key={key}
                              className="border border-slate-200 rounded-md p-4"
                            >
                              <p className="text-xs font-semibold text-slate-500 mb-1 capitalize">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm font-medium text-slate-800">
                                {displayVal}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {profileTab === "documents" && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Documents
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Upload and manage your academic documents, certificates, and
                  other files.
                </p>

                {/* Upload Area */}
                {editMode && (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center mb-6 hover:border-blue-300 transition-colors">
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 mb-1">
                      Upload academic documents
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      PDF, JPG, PNG (max 10MB each)
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer transition-colors">
                      {uploadingDoc ? "Uploading..." : "Choose Files"}
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        disabled={uploadingDoc}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Document List */}
                {docsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : profileDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">
                      No documents uploaded yet.
                    </p>
                    {editMode && (
                      <p className="text-xs text-slate-400 mt-1">
                        Click the upload area above to add documents.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {doc.file_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(doc.file_size)} •{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
