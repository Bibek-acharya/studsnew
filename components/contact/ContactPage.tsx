"use client";

import React, { useState } from "react";

type ToastState = {
  id: number;
  title: string;
  message: string;
  exiting: boolean;
};

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const socialLinks = [
  { icon: "fa-facebook-f", label: "Facebook", url: "https://www.facebook.com/share/1CEcyRH9ZZ/" },
  { icon: "fa-instagram", label: "Instagram", url:"https://www.instagram.com/stud.sphere?igsh=NDM5Z29nc2ZqMmc=" },
  { icon: "fa-tiktok", label: "TikTok", url: "https://www.tiktok.com/@stud.sphere?_r=1&_t=ZS-95OYyC0vodM" },
  { icon: "fa-whatsapp", label: "WhatsApp", url: "https://wa.me/9779800000000" },
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dismissToast = (id: number) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, exiting: true } : toast,
      ),
    );

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  const showToast = (title: string, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, exiting: false }]);
    window.setTimeout(() => dismissToast(id), 4000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast("Success!", "Your quote request has been sent successfully.");
    setFormData(initialFormData);
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }

          .contact-toast-enter {
            animation: slideIn 0.3s ease-out forwards;
          }

          .contact-toast-exit {
            animation: slideOut 0.3s ease-in forwards;
          }
        `}
      </style>

      <div className="min-h-screen bg-white text-gray-800 antialiased">
        <header className="w-full py-12 text-center md:py-16">
          <h1 className="mb-3 text-3xl font-bold text-black md:text-4xl">
            Contact Us
          </h1>
         
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <section className="lg:col-span-2">
              <h2 className="mb-8 text-2xl font-bold text-gray-900">
                Get your free quote Today
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField label="Your Name" required>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex.Jagdish Dhami"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors placeholder-gray-400 focus:border-[#1c64f2] focus:outline-none focus:ring-1 focus:ring-[#1c64f2]"
                    />
                  </FormField>

                  <FormField label="Email" required>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jagdishdhami@200"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors placeholder-gray-400 focus:border-[#1c64f2] focus:outline-none focus:ring-1 focus:ring-[#1c64f2]"
                    />
                  </FormField>

                  <FormField label="Phone" required>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977-9809890000"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors placeholder-gray-400 focus:border-[#1c64f2] focus:outline-none focus:ring-1 focus:ring-[#1c64f2]"
                    />
                  </FormField>
                </div>

                <FormField label="Your Message">
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="enter here..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors placeholder-gray-400 focus:border-[#1c64f2] focus:outline-none focus:ring-1 focus:ring-[#1c64f2]"
                  />
                </FormField>

                <div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#1c64f2] px-8 py-3 font-medium text-white transition-colors hover:bg-[#1655ce] focus:outline-none focus:ring-2 focus:ring-[#1c64f2] focus:ring-offset-2"
                  >
                    Send Now
                  </button>
                </div>
              </form>
            </section>

            <aside className="lg:col-span-1">
              <div className="flex h-full flex-col space-y-8 rounded-xl bg-[#1c64f2] p-8 text-white shadow-lg lg:p-10">
                <InfoBlock title="Address">
                  <p className="text-sm leading-relaxed text-white/90">
                   Sallyan House, Baghbajar <br/> 
                   Kathmandu, Nepal
                  </p>
                </InfoBlock>

                <InfoBlock title="Contact">
                  <p className="mb-1 text-sm leading-relaxed text-white/90">
                    Tel : 01-456746 , 01-985647
                  </p>
                  <p className="text-sm leading-relaxed text-white/90">
                    Email: info@stusphere.com
                  </p>
                </InfoBlock>

                <InfoBlock title="Open Time">
                  <p className="mb-1 text-sm leading-relaxed text-white/90">
                    9:00 AM - 6:00 PM
                  </p>
                  
                </InfoBlock>

                <div className="mt-auto pt-4">
                  <h3 className="mb-4 text-xl font-semibold">Stay Connected</h3>
                  <div className="flex space-x-3">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.url}
                        aria-label={item.label}
                        target="_blank"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1c64f2] shadow-sm transition-colors hover:bg-gray-100"
                      >
                        <i className={`fa-brands ${item.icon} text-sm`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 h-96 w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2677.2224901076906!2d85.31917056414895!3d27.705348891431424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19004565cdeb%3A0xffa5eb3bc0b79d47!2sSallyan%20House!5e0!3m2!1sen!2snp!4v1775739754359!5m2!1sen!2snp"
              title="Location Map"
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </main>

        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex max-w-sm items-start gap-3 rounded border-l-4 border-[#1c64f2] bg-white px-4 py-3 shadow-lg ${
                toast.exiting ? "contact-toast-exit" : "contact-toast-enter"
              }`}
            >
              <div className="mt-0.5 text-[#1c64f2]">
                <i className="fa-solid fa-circle-check text-lg"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="ml-auto text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Dismiss notification"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required = false, children }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-gray-900">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const InfoBlock: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <h3 className="mb-3 text-xl font-semibold">{title}</h3>
    {children}
  </div>
);

export default ContactPage;
