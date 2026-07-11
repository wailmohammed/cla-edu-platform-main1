import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdNetwork {
  name: string;
  enabled: boolean;
  priority: number;
  publisherId?: string;
  slotId?: string;
}

interface AdNetworkManagerProps {
  userId?: number;
  onAdLoaded?: (network: string) => void;
}

export default function AdNetworkManager({
  userId,
  onAdLoaded,
}: AdNetworkManagerProps) {
  const { user } = useAuth();
  const [adNetworks, setAdNetworks] = useState<AdNetwork[]>([
    {
      name: "Google AdSense",
      enabled: true,
      priority: 1,
      publisherId: "ca-pub-YOUR_PUBLISHER_ID",
      slotId: "1234567890",
    },
    {
      name: "Mediavine",
      enabled: true,
      priority: 2,
      publisherId: "YOUR_MEDIAVINE_ID",
    },
    {
      name: "AdThrive",
      enabled: true,
      priority: 3,
      publisherId: "YOUR_ADTHRIVE_ID",
    },
    {
      name: "Propeller Ads",
      enabled: true,
      priority: 4,
      publisherId: "YOUR_PROPELLER_ID",
    },
  ]);

  const [currentNetwork, setCurrentNetwork] = useState<string>("Google AdSense");
  const [impressions, setImpressions] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // Only show ads for free tier users
  const isFreeUser = user?.subscriptionTier === "free";

  useEffect(() => {
    if (!isFreeUser) return;

    // Load ad networks based on priority
    const sortedNetworks = [...adNetworks].sort((a, b) => a.priority - b.priority);

    sortedNetworks.forEach((network) => {
      if (network.enabled) {
        loadAdNetwork(network.name);
      }
    });
  }, [isFreeUser, adNetworks]);

  const loadAdNetwork = (networkName: string) => {
    switch (networkName) {
      case "Google AdSense":
        loadGoogleAdSense();
        break;
      case "Mediavine":
        loadMediavine();
        break;
      case "AdThrive":
        loadAdThrive();
        break;
      case "Propeller Ads":
        loadPropellerAds();
        break;
    }
  };

  const loadGoogleAdSense = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    script.onload = () => {
      setCurrentNetwork("Google AdSense");
      if (onAdLoaded) onAdLoaded("Google AdSense");
    };
  };

  const loadMediavine = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.mediavine.com/api/v1/ads/YOUR_MEDIAVINE_ID/init.js";
    document.head.appendChild(script);

    script.onload = () => {
      setCurrentNetwork("Mediavine");
      if (onAdLoaded) onAdLoaded("Mediavine");
    };
  };

  const loadAdThrive = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://d.adthrive.com/ase.js";
    script.setAttribute("data-key", "YOUR_ADTHRIVE_ID");
    document.head.appendChild(script);

    script.onload = () => {
      setCurrentNetwork("AdThrive");
      if (onAdLoaded) onAdLoaded("AdThrive");
    };
  };

  const loadPropellerAds = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://cdn.propellerads.com/loader.js";
    script.setAttribute("data-propeller", "YOUR_PROPELLER_ID");
    document.head.appendChild(script);

    script.onload = () => {
      setCurrentNetwork("Propeller Ads");
      if (onAdLoaded) onAdLoaded("Propeller Ads");
    };
  };

  const trackAdImpression = () => {
    setImpressions((prev) => prev + 1);
    // Send to analytics
    console.log(`Ad impression tracked for ${currentNetwork}`);
  };

  const trackAdClick = () => {
    setClicks((prev) => prev + 1);
    // Send to analytics
    console.log(`Ad click tracked for ${currentNetwork}`);
  };

  if (!isFreeUser) {
    return null; // No ads for premium users
  }

  return (
    <div className="ad-network-manager">
      {/* Ad Networks Status */}
      <div className="ad-networks-status p-4 bg-gray-50 rounded-lg mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Active Ad Networks
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {adNetworks.map((network) => (
            <div
              key={network.name}
              className={`p-2 rounded text-xs font-medium ${
                network.enabled
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1 bg-current"></span>
              {network.name}
            </div>
          ))}
        </div>
      </div>

      {/* Ad Performance Metrics */}
      <div className="ad-metrics grid grid-cols-3 gap-2 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{impressions}</p>
          <p className="text-xs text-gray-600">Impressions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{clicks}</p>
          <p className="text-xs text-gray-600">Clicks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">${revenue.toFixed(2)}</p>
          <p className="text-xs text-gray-600">Revenue</p>
        </div>
      </div>

      {/* Hidden tracking pixels */}
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt=""
        onLoad={trackAdImpression}
        style={{ display: "none" }}
      />
    </div>
  );
}
