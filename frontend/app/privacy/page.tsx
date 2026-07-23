'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 text-[#0F172A]">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E2E8F0] bg-white p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-[#475569]">
          Truth Engine uses Google authentication to securely identify users. We never access or store your private email content. User profile data is stored securely in MongoDB and used only to power your personalized Trust Analysis experience.
        </p>
        <div className="mt-8 space-y-6 text-sm text-[#475569]">
          <p>
            We collect only the data required to manage your session and profile, including your Google UID, name, email, photo URL, and login timestamps. Your login is protected by Firebase Authentication and validated server-side using Firebase Admin.
          </p>
          <p>
            Cookie-based session tokens are used to persist your login securely while keeping your authentication flow safe and compliant. Sensitive secrets are never exposed in client-side code.
          </p>
        </div>
      </div>
    </div>
  );
}
