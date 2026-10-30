import type { ReactNode } from "react";

const lastUpdated = "October 30, 2026";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
      {title}
    </h2>
    {children}
  </section>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-text-secondary leading-relaxed">{children}</p>
);

const List = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc pl-5 text-text-secondary space-y-2 leading-relaxed">{children}</ul>
);

const Term = ({ label, children }: { label: string; children: ReactNode }) => (
  <li>
    <strong className="font-semibold text-text-primary">{label}:</strong> {children}
  </li>
);

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
            <p className="text-text-secondary md:block hidden text-end mb-8 italic">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-10">
              <p className="text-text-secondary md:hidden block text-end italic">
                Last Updated: {lastUpdated}
              </p>

              <Section title="1. General Policy Overview">
                <Paragraph>
                  Le Pondicherry Cheese takes pride in delivering handcrafted, premium artisanal cheeses produced
                  under strict food safety and hygiene standards.
                </Paragraph>
                <Paragraph>
                  Because our dairy items are highly perishable and require continuous temperature-controlled storage
                  (cold-chain management), we do not accept physical returns once an order has been successfully
                  delivered.
                </Paragraph>
                <Paragraph>
                  Once a shipment leaves our temperature-controlled facility and is received by the customer, we can
                  no longer guarantee the integrity of the cold chain, and the products cannot be restocked or resold
                  under applicable food safety standards.
                </Paragraph>
              </Section>

              <Section title="2. Scope & Applicable Exceptions">
                <Paragraph>
                  Physical returns are not accepted under normal circumstances; however, we recognize that issues may
                  occasionally arise during packing or transit. We consider claims eligible for resolution exclusively
                  under the following approved circumstances:
                </Paragraph>
                <List>
                  <Term label="Damaged or Tampered Packaging">
                    The outer shipping box or inner vacuum seal arrived torn, punctured, or compromised upon delivery.
                  </Term>
                  <Term label="Incorrect Product Delivered">
                    The items delivered do not correspond to the items invoiced or ordered.
                  </Term>
                  <Term label="Missing Items">
                    An item ordered and paid for was omitted from the consignment.
                  </Term>
                  <Term label="Quality Defects upon Arrival">
                    The product exhibits spoilage, contamination, or quality failure immediately upon arrival (not
                    attributable to improper post-delivery handling).
                  </Term>
                </List>
              </Section>

              <Section title="3. Mandatory Claim Submission & Verification Process">
                <Paragraph>
                  To file a valid claim for an approved exception, customers must adhere strictly to the following
                  process:
                </Paragraph>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">3.1. Reporting Window</h3>
                  <Paragraph>
                    Any claim regarding damaged, incorrect, or missing products must be reported to our customer
                    service desk within <strong className="text-text-primary">24 hours of delivery confirmation</strong>.
                    Due to the short shelf life and sensitive handling requirements of fresh dairy, complaints logged
                    after 24 hours cannot be validated or approved.
                  </Paragraph>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">3.2. Mandatory Evidentiary Proof</h3>
                  <Paragraph>
                    Customers will be required to submit clear, high-resolution visual evidence before any claim can be
                    reviewed, including:
                  </Paragraph>
                  <List>
                    <li>
                      Clear photos/videos of the outer shipping box showing the courier label, batch number, and
                      airway bill (AWB).
                    </li>
                    <li>Detailed photos/videos of the primary product packaging and the specific defect or damage.</li>
                    <li>
                      Unboxing videos are strongly recommended and may be requested in instances of reported shortages
                      or transit tampering.
                    </li>
                  </List>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-text-primary">
                    3.3. Product Collection for Quality Verification
                  </h3>
                  <Paragraph>
                    In select cases particularly where food quality, taste abnormalities, or foreign contamination are
                    reported Le Pondicherry Cheese reserves the right to arrange a physical collection/pickup of the
                    batch sample through our logistics partners.
                  </Paragraph>
                  <List>
                    <li>
                      The customer must retain the product, its original wrapping, and maintain refrigeration until the
                      retrieval window concludes.
                    </li>
                    <li>
                      Retrieved samples undergo internal batch testing and laboratory evaluation by our quality
                      assurance team to determine the root cause.
                    </li>
                  </List>
                </div>
              </Section>

              <Section title="4. Resolution Mechanism (No Physical Return Required)">
                <Paragraph>Where a claim is evaluated and officially approved:</Paragraph>
                <List>
                  <Term label="Resolution Without Physical Return">
                    In the majority of verified cases (such as crushed parcels or incorrect items where collection is
                    unnecessary), a replacement or refund will be processed directly without requiring the customer to
                    physically ship the perishable item back to our facility.
                  </Term>
                  <Term label="Replacement">
                    At the customer’s preference and subject to inventory availability, a fresh replacement batch will
                    be dispatched via express cold-chain logistics at no additional cost.
                  </Term>
                  <Term label="Refund / Store Credit">
                    If a replacement is unavailable or declined, a full refund for the affected item will be processed
                    back to the original method of payment, or credited as store balance within 5–7 business days of
                    claim validation.
                  </Term>
                </List>
              </Section>

              <Section title="5. Non-Eligible Scenarios">
                <Paragraph>
                  Claims, replacements, and refunds will be strictly denied under the following conditions:
                </Paragraph>
                <List>
                  <Term label="Delayed Reporting">
                    Claims reported after the 24-hour delivery window has expired.
                  </Term>
                  <Term label="Improper Storage Post-Delivery">
                    Spoilage, melting, mold development, or degradation caused by failure to refrigerate the cheese
                    immediately upon receipt.
                  </Term>
                  <Term label="Delivery Failures Caused by Customer">
                    Failed delivery attempts resulting from an incorrect shipping address, unresponsive contact
                    numbers, or refusal to accept the delivery during the agreed delivery slot.
                  </Term>
                  <Term label="Subjective Preferences">
                    Change of mind, personal taste preferences, aroma sensitivity characteristic of specific artisanal
                    styles, or mild visual variations typical of handmade artisanal cheeses.
                  </Term>
                  <Term label="Partially Consumed Items">
                    Claims raised after more than 10% of the product has been consumed, altered, or cooked.
                  </Term>
                </List>
              </Section>

              <Section title="6. Discretion and Final Reservation of Rights">
                <Paragraph>
                  Le Pondicherry Cheese reserves the sole and absolute right to deny, reject, or modify any return,
                  replacement, or refund request that fails to satisfy the criteria, evidentiary standards, and
                  timelines outlined in this policy. Any pattern of fraudulent claims, repeated unverified complaints,
                  or policy abuse will result in the immediate suspension of the associated customer account.
                </Paragraph>
              </Section>

              <Section title="7. Customer Support & Claims Contact">
                <Paragraph>
                  For all claims, disputes, or order inquiries, please reach out to our team with your Order ID,
                  tracking details, and photo/video evidence:
                </Paragraph>
                <List>
                  <Term label="Email">
                    <a href="mailto:vp.expansions@hopemarket.in" className="text-brand-green hover:underline">
                      vp.expansions@hopemarket.in
                    </a>
                  </Term>
                  <Term label="Customer Support Line / WhatsApp">
                    <a href="tel:+918438892532" className="text-brand-green hover:underline">
                      +91 84388 92532
                    </a>
                    ,{" "}
                    <a href="tel:+917200504628" className="text-brand-green hover:underline">
                      +91 72005 04628
                    </a>
                  </Term>
                  <Term label="Operational Hours">Monday to Saturday, 11:00 AM – 05:00 PM IST</Term>
                </List>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
