// Shared public analytics configuration for SplitsPro.
// Measurement IDs are public identifiers, not API secrets.
// Add the Microsoft Clarity project ID from clarity.microsoft.com > Settings > Setup.
window.SPLITSPRO_ANALYTICS_CONFIG = {
  ga4MeasurementId: "G-4QG9BF6FT0",
  clarityProjectId: "",
  // Populated from Google Ads > Goals > Conversions > Calls from website.
  // Left disabled until the verified conversion ID and label are provided.
  googleAdsWebsiteCalls: {
    conversionId: "",
    conversionLabel: "",
    phoneNumber: "0414 698 435"
  }
};
