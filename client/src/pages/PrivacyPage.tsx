export default function PrivacyPage() {
  const lastUpdated = "March 11, 2026";

  return (
    <div className="min-h-screen bg-pattern py-10">
      <div className="container mx-auto px-4 border border-gray-200 bg-white max-w-4xl">
        <div>
          <h1
            className="text-4xl md:text-5xl font-bold my-8 text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
            <p className="text-text-secondary mb-8 italic">
              Last Updated: {lastUpdated}
            </p>

            <div className="space-y-12">
              <section>
                <h2
                  className="text-2xl font-bold mb-4 text-brand-green"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  2. Privacy Policy
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6 text-justify">
                  At Le Pondicherry Cheese, we value your privacy and are
                  committed to protecting your personal data. This policy
                  outlines how we collect, use, and safeguard your information
                  when you use our services.
                </p>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-bg-cream-light rounded-lg border border-gray-50">
                      <h3 className="font-bold text-text-primary mb-3">
                        Information We Collect
                      </h3>
                      <ul className="text-sm text-text-secondary space-y-2">
                        <li>• Name</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Shipping and billing address</li>
                        <li>• Payment information</li>
                        <li>• Website browsing data</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-bg-cream-light rounded-lg border border-gray-50">
                      <h3 className="font-bold text-text-primary mb-3">
                        How We Use Your Information
                      </h3>
                      <ul className="text-sm text-text-secondary space-y-2">
                        <li>• Process and deliver orders</li>
                        <li>• Provide customer support</li>
                        <li>• Send order updates</li>
                        <li>• Improve website performance</li>
                        <li>
                          • Share promotional offers and updates (if subscribed)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Data Protection
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-justify mb-4">
                      We implement appropriate security measures to protect your
                      personal information. Your data will never be sold to
                      third parties.
                    </p>
                    <p className="text-text-secondary mb-2 font-medium">
                      Information may only be shared with:
                    </p>
                    <ul className="list-disc pl-5 text-text-secondary space-y-1">
                      <li>Payment gateways</li>
                      <li>Shipping and logistics partners</li>
                      <li>Legal authorities when required by law.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Cookies
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-justify">
                      Our website may use cookies to enhance user experience and
                      analyze website traffic. You can disable cookies through
                      your browser settings.
                    </p>
                  </div>

                  <div className="p-6 bg-[#2C5530] text-white rounded-lg text-center">
                    <p className="text-sm opacity-90 italic">
                      For any questions regarding your data or to request data
                      deletion, please contact our support team.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
