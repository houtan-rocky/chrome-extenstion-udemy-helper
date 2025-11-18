console.log("Background script - Udemy Course Insights");

// Service worker for Udemy Course Insights extension
// This runs in the background and can handle extension events

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Udemy Course Insights installed", details);
});

