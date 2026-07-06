export default function ReturnPolicyPage() {
  return (
    <div className="bg-pattern py-10">
      <div className="container bg-bg-cream-light border border-gray-200 mx-auto px-4 max-w-4xl">
        <div>
          <div className="flex px-5 justify-between items-center">
            <h1
              className="text-4xl md:text-5xl font-bold my-8 text-green"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Return Policy
            </h1>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-12">
              <section>
                <p className="text-text-secondary leading-relaxed mb-6">
                  As our products are perishable and require controlled storage conditions, we generally do not accept physical returns         
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="text-text-secondary mb-2">
                      However, in approved cases (such as damaged or incorrect products):
                    </p>
                    <ul className="list-disc pl-5 text-text-secondary space-y-1">
                      <li>Customers may be requested to share additional proof (photos/videos)</li>
                      <li>In certain cases, the product may be collected for quality verification</li>
                      <li>Replacement or refund will be processed without requiring a return, wherever applicable</li>
                    </ul>
                    <p className="text-text-secondary mt-4 font-medium">
                      We reserve the right to deny returns or claims that do not meet the above conditions.
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
