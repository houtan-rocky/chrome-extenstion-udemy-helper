# Chrome Web Store - Privacy Practices Justifications

## 1. Host Permission Justification (https://*.udemy.com/*)

**Justification:**
This extension requires access to Udemy.com domains to fetch course creation date information from Udemy's public API. The extension only accesses course metadata (specifically the creation date) from the Udemy API endpoint (https://www.udemy.com/api-2.0/courses) when users visit Udemy course pages. This permission is essential for the extension's core functionality of displaying real creation dates on course pages. The extension does not access any other websites or domains, and does not collect or transmit any personal user data.

## 2. Remote Code Justification

**Justification:**
This extension does not use remote code execution. All code is bundled locally within the extension package. The extension only makes API calls to Udemy's public API endpoints to fetch course metadata (creation dates), which is standard data fetching and does not constitute remote code execution. All JavaScript code runs locally in the user's browser as part of the extension package.

## 3. Tabs Permission Justification

**Justification:**
The extension requires the "tabs" permission to read the URL of the currently active tab. This is necessary to:
- Detect when the user is viewing a Udemy course page
- Extract the course ID from the URL
- Display the appropriate course information in the extension popup
- Only activate on Udemy course pages (https://*.udemy.com/course/*)

The extension does not modify tabs, create new tabs, or access tab content beyond reading the URL. It only uses this permission to identify the current page and provide relevant course information.

## 4. Single Purpose Description

**Single Purpose:**
This extension has a single, focused purpose: to display the real creation date of Udemy courses directly on course pages. The extension automatically detects Udemy course pages and shows the original creation date (not just the last update date) to help users make informed learning decisions. All features serve this single purpose:
- Content script that displays creation dates on course pages
- Popup interface that shows course creation date information
- API calls to fetch course metadata from Udemy

The extension does not perform any other functions beyond displaying course creation dates.

## 5. Data Usage Certification

**Data Usage Compliance:**

I certify that this extension's data usage complies with Chrome Web Store Developer Program Policies:

**Data Collection:**
- This extension does NOT collect, store, or transmit any personal user data
- No user accounts, login credentials, or personal information is accessed
- No browsing history or behavior is tracked
- No analytics or telemetry data is collected

**Data Access:**
- The extension only accesses publicly available course metadata (creation dates) from Udemy's API
- Only course IDs and creation dates are fetched - no user-specific data
- All API calls are made directly from the user's browser to Udemy's servers
- No data is sent to third-party servers or services

**Data Storage:**
- No data is stored locally or remotely
- No cookies or local storage is used for tracking
- All data fetching happens in real-time and is not persisted

**User Privacy:**
- The extension operates entirely locally in the user's browser
- No external servers or services are used
- No user identification or tracking mechanisms are implemented
- Users can disable or uninstall the extension at any time

**Compliance:**
- Complies with Chrome Web Store User Data Privacy policy
- Complies with Google's Developer Program Policies
- No sensitive or restricted data is accessed
- All permissions are used only for the stated single purpose

---

## Quick Copy-Paste Versions

### Host Permission (for Privacy Practices tab):
```
This extension requires access to Udemy.com domains to fetch course creation date information from Udemy's public API. The extension only accesses course metadata (creation dates) from the Udemy API when users visit Udemy course pages. This is essential for displaying real creation dates on course pages. The extension does not access any other websites and does not collect or transmit any personal user data.
```

### Remote Code (for Privacy Practices tab):
```
This extension does not use remote code execution. All code is bundled locally within the extension package. The extension only makes API calls to Udemy's public API to fetch course metadata (creation dates), which is standard data fetching and does not constitute remote code execution. All JavaScript code runs locally in the user's browser.
```

### Tabs Permission (for Privacy Practices tab):
```
The extension requires the "tabs" permission to read the URL of the currently active tab. This is necessary to detect when the user is viewing a Udemy course page, extract the course ID from the URL, and display the appropriate course information in the extension popup. The extension does not modify tabs, create new tabs, or access tab content beyond reading the URL.
```

### Single Purpose (for Privacy Practices tab):
```
This extension has a single, focused purpose: to display the real creation date of Udemy courses directly on course pages. The extension automatically detects Udemy course pages and shows the original creation date to help users make informed learning decisions. All features serve this single purpose - displaying course creation dates.
```

