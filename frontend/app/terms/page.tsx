'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 text-[#0F172A]">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E2E8F0] bg-white p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-4xl font-extrabold">Terms of Service</h1>
        <p className="mt-4 text-sm leading-7 text-[#475569]">
          By using Truth Engine, you agree to access the platform through Google authentication only. This service is provided for digital trust analysis and cybersecurity insights across websites, emails, documents, images, QR codes, and voice content.
        </p>
        <div className="mt-8 space-y-6 text-sm text-[#475569]">
          <p>
            Users are responsible for the data they submit for analysis. Truth Engine does not provide legal or professional advice. Our AI-driven assessments are intended for informational purposes and should be used as part of a broader security workflow.
          </p>
          <p>
            We reserve the right to update these terms and your continued use of the platform constitutes acceptance of any changes. Your authentication data is handled securely and can be revoked at any time through your Google account or by logging out.
          </p>
        </div>
      </div>
    </div>
  );
}
