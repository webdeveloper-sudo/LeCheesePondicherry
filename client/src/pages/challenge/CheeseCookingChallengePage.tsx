"use client";

import { useEffect } from "react";
import ChallengeHero from "./components/ChallengeHero";
import ChallengeOverview from "./components/ChallengeOverview";
import ChallengeFlow from "./components/ChallengeFlow";
import ReachPeriodSection from "./components/ReachPeriodSection";
import RecipeInspiration from "./components/RecipeInspiration";
import PrizeSection from "./components/PrizeSection";
import LeaderboardPreview from "./components/LeaderboardPreview";
import EntryForm from "./components/EntryForm";
import EntryChecklist from "./components/EntryChecklist";
import ChallengeFAQ from "./components/ChallengeFAQ";
import TermsAndConditions from "./components/TermsAndConditions";
import FinalCTA from "./components/FinalCTA";

export default function CheeseCookingChallengePage() {
  // Set SEO title & meta description on mount
  useEffect(() => {
    document.title = "Le Pondicherry Cheese Cooking Challenge | Win an Electric Scooter";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Create your cheesy recipe, post your Instagram Reel and compete for an Electric Scooter in the Le Pondicherry Cheese Cooking Challenge."
    );

    // Scroll to top on load unless there is a hash
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = window.location.hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] antialiased selection:bg-[#FAB519] selection:text-[#1A1A1A]">
      {/* 1. Hero Section */}
      <ChallengeHero />

      {/* 2. Concept Introduction */}
      <ChallengeOverview />

      {/* 3. How It Works (5-step flow) */}
      <ChallengeFlow />

      {/* 4. 21-Day Reach Mechanic */}
      <ReachPeriodSection />

      {/* 5. Recipe Inspiration */}
      <RecipeInspiration />

      {/* 6. Prize Section (Electric Scooter) */}
      <PrizeSection />

      {/* 7. Leaderboard Preview */}
      <LeaderboardPreview />

      {/* 8. Challenge Entry Form */}
      <EntryForm />

      {/* 9. Pre-flight Verification Checklist */}
      <EntryChecklist />

      {/* 10. Frequently Asked Questions */}
      <ChallengeFAQ />

      {/* 11. Official Terms & Conditions */}
      <TermsAndConditions />

      {/* 12. Final High-Conversion CTA */}
      <FinalCTA />
    </div>
  );
}
