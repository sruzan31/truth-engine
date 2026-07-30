'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 text-[#0F172A]">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E2E8F0] bg-white p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-[#475569]">
          Truth Engine is designed with a privacy-first architecture. We never access or store your private email content, personal credentials, or unneeded personal data. Scan data is processed securely and used only to power your Trust Analysis experience.
        </p>
        <div className="mt-8 space-y-6 text-sm text-[#475569]">
          <p>
            We process only the target inputs submitted for verification (URLs, text, email headers, files, QR codes, or voice clips). Platform operations run in zero-retention or localized database modes depending on system configuration.
          </p>
          <p>
            Sensitive secrets and API keys are strictly managed on the server side and never exposed in client-side code.
          </p>
        </div>
      </div>
    </div>
  );
}

