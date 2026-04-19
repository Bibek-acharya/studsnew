'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Laptop,
  LifeBuoy,
  Lock,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'

type TabId = 'security' | 'notifications' | 'help' | 'danger'

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'help', label: 'Help & Support', icon: LifeBuoy },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<TabId>('security')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    twoFactor: true,
    profileVisibility: 'friends',
    compactSidebar: false,
    applicationUpdates: true,
    messagesFromColleges: true,
    scholarshipAlerts: true,
    systemNotifications: true,
    emailDigest: false,
    timezone: 'Pacific Time (PT)',
    dateFormat: 'MM/DD/YYYY',
  })
  const [activeModal, setActiveModal] = useState<null | 'contact' | 'report'>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [reportArea, setReportArea] = useState('Dashboard')
  const [reportMessage, setReportMessage] = useState('')

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 3000)
  }

  const openModal = (modal: 'contact' | 'report') => {
    setActiveModal(modal)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const submitHelpForm = (modal: 'contact' | 'report') => {
    closeModal()
    if (modal === 'contact') {
      setContactSubject('')
      setContactMessage('')
      showToast('Message sent to support successfully!')
    } else {
      setReportArea('Dashboard')
      setReportMessage('')
      showToast('Bug report submitted successfully!')
    }
  }

  return (
    <div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit mt-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-primary'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="Create new password" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Update Password
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">Enable 2FA</p>
                  <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                </div>
                <label className="relative inline-block w-11 h-6">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={() => toggleSetting('twoFactor')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-600" /> Login Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">MacBook Pro 16&quot; <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">Active now</span></p>
                      <p className="text-sm text-slate-500">San Francisco, CA • Chrome</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">iPhone 13 Pro</p>
                      <p className="text-sm text-slate-500">San Francisco, CA • Safari • 2 hours ago</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full border border-red-500 text-red-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                Logout from all devices
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> Notification Preferences
              </h3>
              <div className="space-y-0 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">Application Updates</p>
                    <p className="text-sm text-slate-500">Get notified when your application status changes.</p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.applicationUpdates}
                      onChange={() => toggleSetting('applicationUpdates')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">Messages from Colleges</p>
                    <p className="text-sm text-slate-500">Receive alerts when an institution contacts you.</p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.messagesFromColleges}
                      onChange={() => toggleSetting('messagesFromColleges')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">Scholarship Alerts</p>
                    <p className="text-sm text-slate-500">New matching scholarships and deadlines.</p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.scholarshipAlerts}
                      onChange={() => toggleSetting('scholarshipAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">System Notifications</p>
                    <p className="text-sm text-slate-500">Platform updates, maintenance, and security alerts.</p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.systemNotifications}
                      onChange={() => toggleSetting('systemNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">Email Notifications</p>
                    <p className="text-sm text-slate-500">Send a daily digest of unread notifications to email.</p>
                  </div>
                  <label className="relative inline-block w-11 h-6">
                    <input
                      type="checkbox"
                      checked={settings.emailDigest}
                      onChange={() => toggleSetting('emailDigest')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 rounded-xl shadow-sm mt-4 flex justify-end">
              <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-600" /> Help & Support
              </h3>
              <p className="text-slate-500 mb-6">Need assistance? Our support team is here to help you.</p>
              
              <div className="space-y-0">
                <HelpItem
                  icon={MessageCircle}
                  title="Contact Support"
                  description="Talk to a representative"
                  onClick={() => openModal('contact')}
                />
                <HelpItem
                  icon={BookOpen}
                  title="FAQ"
                  description="Find answers to common questions"
                  href="/user/dashboard/faq"
                />
                <HelpItem
                  icon={AlertTriangle}
                  title="Report a Problem"
                  description="Let us know if something is broken"
                  onClick={() => openModal('report')}
                  isLast
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6">
              <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h3>
              <p className="text-slate-500 mb-6">Proceed with caution. Actions taken here cannot be undone easily.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-800">Deactivate Account</p>
                    <p className="text-sm text-slate-500">Temporarily hide your profile and data.</p>
                  </div>
                  <button className="border border-red-500 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                    Deactivate
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-red-200">
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-slate-500">Permanently remove your account and all data.</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'contact' && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">Contact Support</h3>
              <p className="text-sm text-slate-500 text-center mb-6">Send us a message and we&apos;ll reply to your email.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full min-h-30 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => submitHelpForm('contact')}
                  className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'report' && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">Report a Problem</h3>
              <p className="text-sm text-slate-500 text-center mb-6">Found a bug or issue? Let us know so we can fix it.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Problem Area</label>
                  <select
                    value={reportArea}
                    onChange={(e) => setReportArea(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option>Dashboard</option>
                    <option>Settings</option>
                    <option>Profile</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Please describe how to reproduce the bug..."
                    className="w-full min-h-30 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => submitHelpForm('report')}
                  className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-2xl">
            <div className="flex items-center gap-3 text-sm text-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </form>
    </div>
  )
}

function HelpItem({ icon: Icon, title, description, href, onClick, isLast }: { icon: LucideIcon; title: string; description: string; href?: string; onClick?: () => void; isLast?: boolean }) {
  const content = (
    <div className={`w-full py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors rounded-lg ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  )
}
