import { Link } from "react-router-dom";

export default function RefundPolicyPage() {
  const lastUpdated = "March 11, 2026";

  return (
    <div className="bg-pattern py-10">
      <div className="container bg-bg-cream-light border border-gray-200 mx-auto px-4 max-w-4xl">
        <div>
          <div className="flex px-5 justify-between items-center">
            <h1
              className="text-4xl md:text-5xl font-bold my-8 text-green"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Refund Policy
            </h1>
            <p className="text-text-secondary md:block hidden text-end mb-8 italic">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-12">
              <p className="text-text-secondary md:hidden block text-end mb-8 italic">
                Last Updated: {lastUpdated}
              </p>
              <section>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Due to the perishable nature of cheese and dairy products,
                  returns are limited.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Eligible Refund Situations
                    </h3>
                    <p className="text-text-secondary mb-2">
                      Refunds may be considered if:
                    </p>
                    <ul className="list-disc pl-5 text-text-secondary space-y-1">
                      <li>The product arrives damaged during transit</li>
                      <li>The product is spoiled upon delivery</li>
                      <li>The wrong item was delivered</li>
                      <li>The product packaging is tampered</li>
                      <li>
                        The product received is significantly different from the
                        order placed
                      </li>
                    </ul>
                    <p className="text-text-secondary mt-4 font-medium">
                      Customers must notify us within 24 hours of receiving the
                      product, along with clear photo or video evidence of the
                      issue.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Non-Refundable Situations
                    </h3>
                    <p className="text-text-secondary mb-2">
                      Refunds cannot be provided for:
                    </p>
                    <ul className="list-disc pl-5 text-text-secondary space-y-1">
                      <li>
                        Incorrect shipping address or contact details provided
                        by the customer
                      </li>
                      <li>
                        Delivery delays caused by third-party logistics partners
                      </li>
                      <li>
                        Change of mind after the order has been dispatched
                      </li>
                      <li>
                        Products that have been partially consumed or opened
                      </li>
                      <li>Requests made after the 24-hour reporting window</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Refund Process
                    </h3>
                    <p className="text-text-secondary mb-2">
                      Once the claim is verified:
                    </p>
                    <ul className="list-disc pl-5 text-text-secondary space-y-1">
                      <li>
                        Our team will review the request and may contact you for
                        additional information
                      </li>
                      <li>
                        Refunds or replacements will be approved based on
                        verification
                      </li>
                      <li>
                        Refunds will be processed within 5–7 business days
                      </li>
                      <li>
                        The amount will be credited to the original payment
                        method
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      Order Cancellation
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Orders may be cancelled before they are dispatched. Once
                      the order has been shipped, cancellations may not be
                      possible due to the perishable nature of the products.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2
                  className="text-2xl font-bold mb-4 text-brand-green"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Shipping Policy
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  For detailed information regarding our shipping regions, delivery timelines (including Pondicherry local delivery and Tamil Nadu / Rest of India shipments), weight-based slab charges, and our cold chain packaging, please visit our dedicated{" "}
                  <Link to="/shipping-policy" className="text-green font-bold hover:underline">
                    Shipping Policy Page
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
