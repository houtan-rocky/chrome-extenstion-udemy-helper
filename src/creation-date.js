// Udemy API endpoint for course data
// Note: If this doesn't work, you may need to use a backend proxy or different endpoint
const API_URL = 'https://www.udemy.com/api-2.0/courses'

async function getCourseDataFromServer(id) {
	if (!id) {
		throw new Error('Course ID not found')
	}
	
	try {
		const res = await fetch(
			`${API_URL}/${id}/?fields[course]=created,last_update_date,title`,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				credentials: 'same-origin', // Include cookies for authenticated requests
			}
		)
		
		if (!res.ok) {
			// If API requires auth, try to extract from page data as fallback
			if (res.status === 401 || res.status === 403) {
				console.warn('API requires authentication. Trying alternative method...')
				return await tryExtractFromPage(id)
			}
			throw new Error(`HTTP error! status: ${res.status}`)
		}
		
		const data = await res.json()
		return data
	} catch (e) {
		console.warn('Error fetching creation date:', e.message)
		// Try fallback method
		try {
			return await tryExtractFromPage(id)
		} catch (fallbackError) {
			throw e
		}
	}
}

// Fallback: Try to extract course data from the page itself
async function tryExtractFromPage(id) {
	// Look for course data in script tags or data attributes
	const scripts = document.querySelectorAll('script[type="application/json"], script[type="application/ld+json"]')
	for (const script of scripts) {
		try {
			const data = JSON.parse(script.textContent)
			const extracted = extractDatesFromUnknown(data)
			if (extracted) {
				return extracted
			}
		} catch (e) {
			// Continue searching
		}
	}
	
	// Look for data in window object
	if (window.udemy && window.udemy.course) {
		const extracted = extractDatesFromUnknown(window.udemy.course)
		if (extracted) {
			return extracted
		}
	}

	// Meta tags (JSON-LD / schema)
	const metaCreated = document.querySelector('meta[itemprop="datePublished"]')
	const metaUpdated = document.querySelector('meta[itemprop="dateModified"]')
	if (metaCreated || metaUpdated) {
		return {
			created: metaCreated ? metaCreated.getAttribute('content') : null,
			last_update_date: metaUpdated ? metaUpdated.getAttribute('content') : null
		}
	}

	// Visible "Last updated" text on the page
	const lastUpdatedEl = document.querySelector('[data-purpose="last-update-date"]')
	if (lastUpdatedEl) {
		const parsed = parseDateFromText(lastUpdatedEl.textContent)
		if (parsed) {
			return { created: null, last_update_date: parsed }
		}
	}
	
	throw new Error('Could not extract course data from page')
}

function extractDatesFromUnknown(raw) {
	if (!raw) {
		return null
	}

	if (Array.isArray(raw)) {
		for (const item of raw) {
			const extracted = extractDatesFromUnknown(item)
			if (extracted) {
				return extracted
			}
		}
		return null
	}

	if (typeof raw !== 'object') {
		return null
	}

	const created =
		raw.created ||
		raw.published_time ||
		raw.date_published ||
		raw.datePublished ||
		raw.initial_created ||
		raw.dateCreated

	const lastUpdate =
		raw.last_update_date ||
		raw.last_updated ||
		raw.date_modified ||
		raw.dateModified ||
		raw.updated ||
		raw.last_modified

	if (created || lastUpdate) {
		return {
			created: created || null,
			last_update_date: lastUpdate || null,
			title: raw.title || raw.headline || raw.name || null
		}
	}

	return null
}

function parseDateFromText(text) {
	if (!text) {
		return null
	}
	const cleaned = text.replace(/last\s*updated/i, '').trim()
	if (!cleaned) {
		return null
	}
	const parsedDate = new Date(cleaned)
	if (isNaN(parsedDate.getTime())) {
		return null
	}
	return parsedDate.toISOString()
}

function formatDateForDisplay(dateString) {
	if (!dateString) {
		return 'Not available'
	}
	const parsed = new Date(dateString)
	if (isNaN(parsed.getTime())) {
		return 'Not available'
	}
	return parsed.toLocaleDateString()
}

// Create CSS for skeleton/beam loader
function createSkeletonStyles() {
	if (document.getElementById('udemy-creation-date-styles')) {
		return
	}
	
	const style = document.createElement('style')
	style.id = 'udemy-creation-date-styles'
	style.textContent = `
		@keyframes udemy-shimmer {
			0% {
				background-position: -200px 0;
			}
			100% {
				background-position: calc(200px + 100%) 0;
			}
		}
		.udemy-creation-date-skeleton {
			display: inline-block;
			width: 100px;
			height: 1em;
			background: linear-gradient(
				90deg,
				rgba(15, 81, 50, 0.2) 0px,
				rgba(15, 81, 50, 0.4) 40px,
				rgba(15, 81, 50, 0.2) 80px
			);
			background-size: 200px 100%;
			animation: udemy-shimmer 1.5s infinite;
			border-radius: 3px;
			vertical-align: middle;
		}
	`
	document.head.appendChild(style)
}

// Flag to prevent multiple simultaneous executions
let isRendering = false
let retryCount = 0
const MAX_RETRIES = 100 // Max 50 seconds of retries (100 * 500ms)
let domObserver = null

function ensureDomObserver() {
	if (domObserver || typeof MutationObserver === 'undefined') {
		return
	}

	domObserver = new MutationObserver(() => {
		const courseTitle = document.querySelector('[data-purpose="lead-title"]')
		
		if (!courseTitle) {
			return
		}

		const existingBadge = courseTitle.querySelector('.udemy-creation-date')
		const currentlyLoading = !!document.querySelector('.udemy-creation-date-loading')
		
		if (!existingBadge && !currentlyLoading && !isRendering) {
			renderTitle()
		}
	})

	domObserver.observe(document.body, {
		childList: true,
		subtree: true
	})
}

async function renderTitle() {
	// Prevent multiple simultaneous executions
	if (isRendering) {
		return
	}
	
	try {
		const courseTitle = document.querySelector('[data-purpose="lead-title"]')
		
		if (!courseTitle) {
			// Retry after a short delay if element not found yet
			if (retryCount < MAX_RETRIES) {
				retryCount++
				setTimeout(renderTitle, 500)
			}
			return
		}
		
		// Check if we've already added the creation date to avoid duplicates
		if (courseTitle.querySelector('.udemy-creation-date')) {
			return
		}
		
		// Mark as rendering to prevent duplicate calls
		isRendering = true
		
		const id = document.body.getAttribute(`data-clp-course-id`)
		
		if (!id) {
			console.warn('Course ID not found on page')
			isRendering = false
			return
		}
		
		// Create skeleton styles
		createSkeletonStyles()
		ensureDomObserver()
		
		// Create loading indicator with skeleton - show immediately
		const loadingSpan = document.createElement('div')
		loadingSpan.className = 'udemy-creation-date udemy-creation-date-loading'
		loadingSpan.style.cssText = 'color: #0f5132; font-weight: 500; font-size: 0.9em; background-color: #d1e7dd; padding: 6px 10px; border-radius: 6px; display: inline-block; margin-top: 8px; min-width: 200px;'

		const creationRow = document.createElement('div')
		creationRow.style.marginBottom = '4px'
		const creationLabel = document.createElement('span')
		creationLabel.textContent = 'Created: '
		const creationSkeleton = document.createElement('span')
		creationSkeleton.className = 'udemy-creation-date-skeleton'
		creationRow.appendChild(creationLabel)
		creationRow.appendChild(creationSkeleton)

		const updatedRow = document.createElement('div')
		const updatedLabel = document.createElement('span')
		updatedLabel.textContent = 'Updated: '
		const updatedSkeleton = document.createElement('span')
		updatedSkeleton.className = 'udemy-creation-date-skeleton'
		updatedRow.appendChild(updatedLabel)
		updatedRow.appendChild(updatedSkeleton)

		loadingSpan.appendChild(creationRow)
		loadingSpan.appendChild(updatedRow)

		courseTitle.appendChild(document.createElement('br'))
		courseTitle.appendChild(loadingSpan)
		
		// Fetch course data
		const courseData = await getCourseDataFromServer(id)
		
		const lastUpdatedDisplay = formatDateForDisplay(courseData && courseData.last_update_date)
		
		if (!courseData || !courseData.created) {
			console.warn('Course data or creation date not available')
			creationRow.textContent = 'Creation date unavailable'
			updatedRow.textContent = `Updated: ${lastUpdatedDisplay}`
			loadingSpan.style.color = '#856404'
			loadingSpan.style.backgroundColor = '#fff3cd'
			isRendering = false
			return
		}
		
		const creationDateTime = new Date(courseData.created)
		
		if (isNaN(creationDateTime.getTime())) {
			console.warn('Invalid creation date')
			creationRow.textContent = 'Invalid creation date'
			updatedRow.textContent = `Updated: ${lastUpdatedDisplay}`
			loadingSpan.style.color = '#856404'
			loadingSpan.style.backgroundColor = '#fff3cd'
			isRendering = false
			return
		}
		
		const creationDate = creationDateTime.toLocaleDateString()
		
		// Replace skeleton with actual date
		loadingSpan.className = 'udemy-creation-date'
		creationRow.textContent = `Created: ${creationDate}`
		updatedRow.textContent = `Updated: ${lastUpdatedDisplay}`
		loadingSpan.style.color = '#0f5132'
		loadingSpan.style.backgroundColor = '#d1e7dd'
		
		isRendering = false
		
	} catch (error) {
		console.warn('Could not render creation date:', error.message)
		// Update loading indicator to show error
		const loadingSpan = document.querySelector('.udemy-creation-date-loading')
		if (loadingSpan) {
			loadingSpan.textContent = 'Failed to load creation date'
			loadingSpan.style.color = '#856404'
			loadingSpan.style.backgroundColor = '#fff3cd'
		}
		isRendering = false
	}
}

// Start rendering with a small delay to ensure page is stable
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(renderTitle, 500)
	})
} else {
	setTimeout(renderTitle, 500)
}
