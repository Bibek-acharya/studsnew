'use client'

import { useState, useMemo } from 'react'
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
  Flag,
  Eye
} from 'lucide-react'
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from '@/lib/location-data'

interface EducationEntry {
  id: number
  level: string
  institutionName: string
  boardUniversity: string
  country: string
  stream: string
  startYear: string
  endYear: string
  gradingSystem: string
  grade: string
}

const initialEducation: EducationEntry[] = [
  {
    id: 1,
    level: '+2',
    institutionName: 'St. Xavier College',
    boardUniversity: 'NEB',
    country: 'Nepal',
    stream: 'Science',
    startYear: '2020',
    endYear: '2022',
    gradingSystem: 'GPA',
    grade: '3.8'
  }
]

export default function ProfileSection() {
  const [profileTab, setProfileTab] = useState('personal')
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  
  const [personalData, setPersonalData] = useState({
    firstName: 'Alex',
    lastName: 'Student',
    middleName: '',
    dateOfBirth: '2002-05-15',
    gender: 'Male',
    nationality: 'Nepalese',
    email: 'alex@university.edu',
    phone: '+977-9841234567',
    alternatePhone: '',
    province: 'Bagmati',
    district: 'Kathmandu',
    localLevel: 'Kathmandu Metropolitan',
    bio: ''
  })

  const [education, setEducation] = useState<EducationEntry[]>(initialEducation)
  const [preferredStudy, setPreferredStudy] = useState({
    targetLevel: 'Bachelor',
    preferredField: 'Computer Science',
    preferredSpecialization: 'Artificial Intelligence',
    preferredProvince: 'Bagmati',
    preferredDistrict: 'Kathmandu',
    budgetRange: '500000-1000000',
    scholarshipRequired: 'Yes',
    scholarshipType: 'Merit Based'
  })

  const [documents, setDocuments] = useState({
    seeMarksheet: null,
    plus2Marksheet: null,
    bachelorTranscript: null,
    certificates: [] as File[],
    citizenship: null,
    sop: null,
    recommendationLetter: null,
    cv: null
  })

  const handleEducationAdd = () => {
    const newEntry: EducationEntry = {
      id: Date.now(),
      level: '',
      institutionName: '',
      boardUniversity: '',
      country: '',
      stream: '',
      startYear: '',
      endYear: '',
      gradingSystem: 'GPA',
      grade: ''
    }
    setEducation([...education, newEntry])
  }

  const handleEducationRemove = (id: number) => {
    setEducation(education.filter(e => e.id !== id))
  }

  const handleEducationChange = (id: number, field: keyof EducationEntry, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const handleSave = () => {
    setEditMode(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [selectedProvince, setSelectedProvince] = useState(personalData.province || 'Bagmati Province')
  const [selectedDistrict, setSelectedDistrict] = useState(personalData.district || 'Kathmandu')
  
  const localBodies = useMemo(() => {
    return NEPAL_LOCAL_BODIES[selectedDistrict as keyof typeof NEPAL_LOCAL_BODIES] || []
  }, [selectedDistrict])

  const calculateCompletion = () => {
    let filled = 0
    const total = 18
    
    if (personalData.firstName) filled++
    if (personalData.lastName) filled++
    if (personalData.dateOfBirth) filled++
    if (personalData.gender) filled++
    if (personalData.nationality) filled++
    if (personalData.email) filled++
    if (personalData.phone) filled++
    if (personalData.province) filled++
    if (personalData.district) filled++
    if (personalData.localLevel) filled++
    if (personalData.bio) filled++
    
    if (education.length > 0 && education[0].level) filled++
    if (education.length > 0 && education[0].institutionName) filled++
    if (education.length > 0 && education[0].boardUniversity) filled++
    if (education.length > 0 && education[0].stream) filled++
    if (education.length > 0 && education[0].grade) filled++
    
    if (preferredStudy.preferredField) filled++
    if (preferredStudy.budgetRange) filled++
    
    return Math.round((filled / total) * 100)
  }

  const completion = calculateCompletion()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-md border border-slate-200 text-center">
          <div className="relative inline-block">
            {profileImage ? (
              <img src={profileImage} className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50 object-cover" alt="Profile" />
            ) : (
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-24 h-24 rounded-full mx-auto border-4 border-slate-50" alt="Profile" />
            )}
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <Upload className="w-3 h-3" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">{personalData.firstName} {personalData.middleName} {personalData.lastName}</h2>
          <p className="text-sm text-slate-500">Student Profile</p>
          
          <div className="mt-6 text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Profile Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${completion}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md border border-slate-200 mt-6">
          <h4 className="font-bold text-slate-800 mb-3">Bio</h4>
          {editMode ? (
            <div>
              <textarea
                value={personalData.bio}
                onChange={(e) => setPersonalData({...personalData, bio: e.target.value})}
                maxLength={500}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${personalData.bio?.length === 500 ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="Tell us about yourself..."
              />
              {personalData.bio?.length === 500 && (
                <p className="text-xs text-red-500 mt-1">Character limit reached</p>
              )}
            </div>
          ) : (
            <div>
              <div className="text-sm text-slate-600 whitespace-pre-wrap">
                {personalData.bio || 'No bio added yet. Click Edit to add your bio.'}
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
                  { id: 'personal', label: 'Personal Details', icon: User },
                  { id: 'education', label: 'Education History', icon: GraduationCap },
                  { id: 'preferred', label: 'Preferred Study', icon: Flag },
                  { id: 'documents', label: 'Documents', icon: FileText }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id)}
                    className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${
                      profileTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  editMode 
                    ? 'bg-brand-blue text-white hover:bg-blue-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
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
            {profileTab === 'personal' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={personalData.firstName}
                          onChange={(e) => setPersonalData({...personalData, firstName: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Middle Name (Optional)</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={personalData.middleName}
                          onChange={(e) => setPersonalData({...personalData, middleName: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.middleName || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={personalData.lastName}
                          onChange={(e) => setPersonalData({...personalData, lastName: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Date of Birth</label>
                      {editMode ? (
                        <input 
                          type="date" 
                          value={personalData.dateOfBirth}
                          onChange={(e) => setPersonalData({...personalData, dateOfBirth: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        />
                      ) : (
<p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.dateOfBirth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                      {editMode ? (
                        <select 
                          value={personalData.gender}
                          onChange={(e) => setPersonalData({...personalData, gender: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Nationality</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={personalData.nationality}
                          onChange={(e) => setPersonalData({...personalData, nationality: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.nationality}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Contact Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                      {editMode ? (
                        <input 
                          type="email" 
                          value={personalData.email}
                          onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                      {editMode ? (
                        <input 
                          type="tel" 
                          value={personalData.phone}
                          onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Alternate Phone</label>
                      {editMode ? (
                        <input 
                          type="tel" 
                          value={personalData.alternatePhone}
                          onChange={(e) => setPersonalData({...personalData, alternatePhone: e.target.value})}
                          placeholder="Optional"
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.alternatePhone || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Province</label>
                      {editMode ? (
                        <select 
                          value={selectedProvince}
                          onChange={(e) => {
                            setSelectedProvince(e.target.value)
                            const districts = NEPAL_DISTRICTS[e.target.value as keyof typeof NEPAL_DISTRICTS]
                            setPersonalData({
                              ...personalData, 
                              province: e.target.value,
                              district: districts?.[0] || '',
                              localLevel: ''
                            })
                            setSelectedDistrict(districts?.[0] || '')
                          }}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        >
                          {NEPAL_PROVINCES.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.province}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">District</label>
                      {editMode ? (
                        <select 
                          value={selectedDistrict}
                          onChange={(e) => {
                            setSelectedDistrict(e.target.value)
                            setPersonalData({
                              ...personalData,
                              district: e.target.value,
                              localLevel: ''
                            })
                          }}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        >
                          {(NEPAL_DISTRICTS[selectedProvince as keyof typeof NEPAL_DISTRICTS] || []).map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.district}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Local Level</label>
                      {editMode ? (
                        <select 
                          value={personalData.localLevel}
                          onChange={(e) => setPersonalData({...personalData, localLevel: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        >
                          <option value="">Select Local Level</option>
                          {localBodies.map((body: { name: string }) => (
                            <option key={body.name} value={body.name}>{body.name}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{personalData.localLevel}</p>
                      )}
                    </div>
                  </div>

                  </div>

                
              </div>
            )}

            {profileTab === 'education' && (
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
                    <div key={entry.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold text-slate-500">Entry {index + 1}</span>
                        {editMode && (
                          <button 
                            onClick={() => handleEducationRemove(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Level</label>
                          {editMode ? (
                            <select 
                              value={entry.level}
                              onChange={(e) => handleEducationChange(entry.id, 'level', e.target.value)}
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
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.level}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Institution Name</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.institutionName}
                              onChange={(e) => handleEducationChange(entry.id, 'institutionName', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.institutionName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Board/University</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.boardUniversity}
                              onChange={(e) => handleEducationChange(entry.id, 'boardUniversity', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.boardUniversity}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Country</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.country}
                              onChange={(e) => handleEducationChange(entry.id, 'country', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.country}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Field/Stream</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.stream}
                              onChange={(e) => handleEducationChange(entry.id, 'stream', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.stream}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Start Year</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.startYear}
                              onChange={(e) => handleEducationChange(entry.id, 'startYear', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.startYear}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">End Year</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.endYear}
                              onChange={(e) => handleEducationChange(entry.id, 'endYear', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.endYear}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Grading System</label>
                          {editMode ? (
                            <select 
                              value={entry.gradingSystem}
                              onChange={(e) => handleEducationChange(entry.id, 'gradingSystem', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            >
                              <option>GPA</option>
                              <option>Percentage</option>
                            </select>
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.gradingSystem}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">GPA / Percentage</label>
                          {editMode ? (
                            <input 
                              type="text" 
                              value={entry.grade}
                              onChange={(e) => handleEducationChange(entry.id, 'grade', e.target.value)}
                              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                            />
                          ) : (
                            <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{entry.grade}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profileTab === 'preferred' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Study Goal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Target Level</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.targetLevel}
                          onChange={(e) => setPreferredStudy({...preferredStudy, targetLevel: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          <option>+2</option>
                          <option>A-Level</option>
                          <option>Diploma</option>
                          <option>Bachelor</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.targetLevel}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Field</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={preferredStudy.preferredField}
                          onChange={(e) => setPreferredStudy({...preferredStudy, preferredField: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.preferredField}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Specialization (Optional)</label>
                      {editMode ? (
                        <input 
                          type="text" 
                          value={preferredStudy.preferredSpecialization}
                          onChange={(e) => setPreferredStudy({...preferredStudy, preferredSpecialization: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.preferredSpecialization}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location Preference
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Province</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.preferredProvince}
                          onChange={(e) => setPreferredStudy({
                            ...preferredStudy, 
                            preferredProvince: e.target.value,
                            preferredDistrict: NEPAL_DISTRICTS[e.target.value as keyof typeof NEPAL_DISTRICTS]?.[0] || ''
                          })}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          {NEPAL_PROVINCES.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.preferredProvince}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred District</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.preferredDistrict}
                          onChange={(e) => setPreferredStudy({...preferredStudy, preferredDistrict: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          {(NEPAL_DISTRICTS[preferredStudy.preferredProvince as keyof typeof NEPAL_DISTRICTS] || []).map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.preferredDistrict}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Budget & Funding
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Budget Range (per year)</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.budgetRange}
                          onChange={(e) => setPreferredStudy({...preferredStudy, budgetRange: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          <option value="0-500000">Rs. 0 - 500,000</option>
                          <option value="500000-1000000">Rs. 500,000 - 1,000,000</option>
                          <option value="1000000-2000000">Rs. 1,000,000 - 2,000,000</option>
                          <option value="2000000+">Rs. 2,000,000+</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">Rs. {preferredStudy.budgetRange.replace('-', ' - Rs. ')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Scholarship Required</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.scholarshipRequired}
                          onChange={(e) => setPreferredStudy({...preferredStudy, scholarshipRequired: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.scholarshipRequired}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Scholarship Type</label>
                      {editMode ? (
                        <select 
                          value={preferredStudy.scholarshipType}
                          onChange={(e) => setPreferredStudy({...preferredStudy, scholarshipType: e.target.value})}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" 
                        >
                          <option>Merit Based</option>
                          <option>Need Based</option>
                          <option>Either</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">{preferredStudy.scholarshipType}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'documents' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Academic Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'seeMarksheet', label: 'SEE Marksheet', uploaded: true },
                      { key: 'plus2Marksheet', label: '+2 Marksheet', uploaded: true },
                      { key: 'bachelorTranscript', label: 'Bachelor Transcript', uploaded: false },
                      { key: 'certificates', label: 'Certificates', uploaded: true }
                    ].map(doc => (
                      <div key={doc.key} className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${doc.uploaded ? 'bg-green-50 text-green-500' : 'bg-slate-100 text-slate-400'}`}>
                          {doc.uploaded ? <Award className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-800">{doc.label}</h4>
                          <p className="text-xs text-slate-500">{doc.uploaded ? 'Uploaded' : 'Not uploaded'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.uploaded && (
                            <button className="text-slate-600 hover:text-slate-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {editMode && (
                            <button className="text-blue-600 hover:text-blue-800">
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Identity Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 text-slate-400 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-800">Citizenship / National ID</h4>
                        <p className="text-xs text-slate-500">Not uploaded</p>
                      </div>
                      {editMode && (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Supporting Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'sop', label: 'Statement of Purpose (SOP)', uploaded: false },
                      { key: 'recommendationLetter', label: 'Recommendation Letter', uploaded: false },
                      { key: 'cv', label: 'CV/Resume', uploaded: true }
                    ].map(doc => (
                      <div key={doc.key} className="border border-slate-200 rounded-lg p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${doc.uploaded ? 'bg-green-50 text-green-500' : 'bg-slate-100 text-slate-400'}`}>
                          {doc.uploaded ? <Award className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-800">{doc.label}</h4>
                          <p className="text-xs text-slate-500">{doc.uploaded ? 'Uploaded' : 'Not uploaded'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.uploaded && (
                            <button className="text-slate-600 hover:text-slate-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {editMode && (
                            <button className="text-blue-600 hover:text-blue-800">
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}