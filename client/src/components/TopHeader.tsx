import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Navigation, Loader2, RotateCw, AlertCircle, X } from "lucide-react";

interface UserLocation {
  area: string;
  district: string;
  state: string;
  pincode: string;
}

// Reverse geocode REAL coordinates only - never returns fake / placeholder data
async function fetchRealLocation(latitude: number, longitude: number): Promise<UserLocation | null> {
  // 1. Try Photon (OpenStreetMap data with exact locality & postal codes)
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties || {};
        const area = props.district || props.locality || props.suburb || props.street || props.name || "";
        const district = props.city || props.county || props.district || "";
        const state = props.state || "";
        const rawPin = (props.postcode || "").replace(/\D/g, "");

        if (district && rawPin.length === 6) {
          return {
            area: area || district,
            district,
            state,
            pincode: rawPin,
          };
        }
      }
    }
  } catch (err) {
    console.warn("Photon reverse geocode error:", err);
  }

  // 2. Try BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const area = data.locality || "";
      const district = data.city || data.localityInfo?.administrative?.[3]?.name || data.locality || "";
      const state = data.principalSubdivision || "";
      let pincode = (data.postcode || "").replace(/\D/g, "");

      // If BigDataCloud has no pincode, check postal API for the real area/district
      if ((!pincode || pincode.length !== 6) && (area || district)) {
        try {
          const poRes = await fetch(
            `https://api.postalpincode.in/postoffice/${encodeURIComponent(area || district)}`
          );
          const poData = await poRes.json();
          if (Array.isArray(poData) && poData[0]?.Status === "Success" && poData[0]?.PostOffice?.length > 0) {
            pincode = poData[0].PostOffice[0].Pincode;
          }
        } catch (e) {
          console.warn("Postal API lookup error:", e);
        }
      }

      if (district && pincode && pincode.length === 6) {
        return {
          area: area || district,
          district,
          state,
          pincode,
        };
      }
    }
  } catch (err) {
    console.warn("BigDataCloud error:", err);
  }

  return null;
}

export default function TopHeader() {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    try {
      localStorage.removeItem("lepondy_user_location");
      const saved = localStorage.getItem("lepondy_real_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.pincode && parsed?.district) return parsed;
      }
    } catch (e) {
      console.error("Error reading saved location", e);
    }
    return null;
  });

  const [isLocating, setIsLocating] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  // Directly ask user for GPS permission regardless of previous selections
  const detectLocation = (clearPrevious = false) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by browser");
      return;
    }

    if (clearPrevious) {
      localStorage.removeItem("lepondy_real_location");
      setLocation(null);
    }

    setIsLocating(true);
    setShowPermissionGuide(false);

    // Using maximumAge: 0 forces the browser to request fresh location without cached results
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const realLoc = await fetchRealLocation(latitude, longitude);
          if (realLoc) {
            setLocation(realLoc);
            localStorage.setItem("lepondy_real_location", JSON.stringify(realLoc));
          }
        } catch (err) {
          console.error("Error fetching real location:", err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Location permission denied or error:", error.code, error.message);
        setIsLocating(false);
        // If the user's browser blocked it previously, show the quick 1-click unlock guide
        if (error.code === error.PERMISSION_DENIED) {
          setShowPermissionGuide(true);
        }
      },
      {
        maximumAge: 0,
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  };

  // Automatically trigger browser permission prompt when user opens the website
  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#FAB519] py-3 via-[#fadea0] to-[#FAB519] bg-[length:200%_100%] animate-shimmer shadow-sm text-text-primary">
      {/* Sparkle/Glitter Effects overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.webp')] opacity-30 mix-blend-overlay pointer-events-none" />

      <div className="mx-auto px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 relative z-10">
        {/* Left: Real Location OR Auto-fill with GPS Button */}
        <div className="relative flex items-center">
          {location ? (
            <div className="flex items-center gap-1.5 text-[14px] text-brand-green font-medium">
              <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 text-brand-green">
                <MapPin size={13} />
              </div>
              <div className="flex items-center gap-1 leading-tight flex-wrap">
                <span className="font-bold text-brand-green/80">Deliver to:</span>
                <span className="font-medium text-brand-green">
                  {location.area && location.area !== location.district ? `${location.area}, ` : ""}
                  {location.district}, {location.state} - {location.pincode}
                </span>
                <button
                  type="button"
                  onClick={() => detectLocation(true)}
                  disabled={isLocating}
                  title="Refresh location with GPS"
                  className="ml-1 p-0.5 text-brand-green/70 hover:text-brand-green hover:bg-black/5 rounded transition-all cursor-pointer"
                >
                  <RotateCw size={11} className={isLocating ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => detectLocation(true)}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-green/10 hover:bg-brand-green hover:text-white text-brand-green text-xs font-bold transition-all border border-brand-green/30 shadow-xs cursor-pointer group"
              title="Click to request GPS location permission"
            >
              {isLocating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-brand-green group-hover:text-white" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation size={13} className="text-brand-green group-hover:text-white transition-transform group-hover:scale-110" />
                  <span>Auto-fill with GPS</span>
                </>
              )}
            </button>
          )}

          {/* Helper bubble if permission is blocked in browser settings */}
          {showPermissionGuide && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-amber-200 rounded-xl shadow-xl z-50 w-72 text-left animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-amber-800 flex items-center gap-1 text-[11px]">
                  <AlertCircle size={13} className="text-amber-600 shrink-0" />
                  Location Blocked in Browser
                </span>
                <button
                  type="button"
                  onClick={() => setShowPermissionGuide(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="text-text-secondary text-[11px] mb-2 leading-relaxed">
                To allow location access:
              </p>
              <ol className="text-[11px] text-text-primary space-y-1 list-decimal pl-4 mb-2.5 font-medium">
                <li>Click the <strong>padlock 🔒 / tune icon</strong> in your browser URL bar</li>
                <li>Set <strong>Location</strong> to <strong>Allow</strong></li>
              </ol>
              <button
                type="button"
                onClick={() => detectLocation(true)}
                className="w-full py-1 px-2.5 bg-brand-green text-white font-bold rounded-lg text-center hover:bg-brand-green-dark transition-all text-xs cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Right: Contact Information */}
        <div className="flex items-center text-brand-green gap-3 sm:gap-4 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-brand-green shrink-0" />
            <a href="tel:+918438892532" className="hover:underline font-semibold">
              +91 84388 92532
            </a>
            <span className="text-brand-green/40 hidden sm:inline">,</span>
            <a href="tel:+917200504628" className="hover:underline font-semibold hidden sm:inline">
              +91 72005 04628
            </a>
          </div>
          <div className="text-brand-green/30 hidden sm:block">|</div>
          <a
            href="mailto:vp.expansions@hopemarket.in"
            className="hidden md:flex items-center gap-1.5 hover:underline"
          >
            <Mail size={14} className="text-brand-green shrink-0" />
            <span>vp.expansions@hopemarket.in</span>
          </a>
        </div>
      </div>

      {/* CSS Animation for Gradient Shimmer */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
