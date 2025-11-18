// Udemy API endpoint for course data
// Note: If this doesn't work, you may need to use a backend proxy or different endpoint
const API_URL = 'https://www.udemy.com/api-2.0/courses'

async function getCourseDataFromServer(id) {
	if (!id) {
		throw new Error('Course ID not found')
	}
	
	try {
		const res = await fetch(
			`${API_URL}/${id}/?fields[course]=created,title`,
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
	const scripts = document.querySelectorAll('script[type="application/json"]')
	for (const script of scripts) {
		try {
			const data = JSON.parse(script.textContent)
			if (data && data.created) {
				return { created: data.created }
			}
		} catch (e) {
			// Continue searching
		}
	}
	
	// Look for data in window object
	if (window.udemy && window.udemy.course && window.udemy.course.created) {
		return { created: window.udemy.course.created }
	}
	
	throw new Error('Could not extract course data from page')
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
const MAX_RETRIES = 50 // Max 5 seconds of retries (50 * 100ms)

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
				setTimeout(renderTitle, 100)
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
		
		// Create loading indicator with skeleton - show immediately
		const loadingSpan = document.createElement('span')
		loadingSpan.className = 'udemy-creation-date udemy-creation-date-loading'
		loadingSpan.style.cssText = 'color: #0f5132; font-weight: 500; font-size: 0.9em; background-color: #d1e7dd; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;'
		
		const labelText = document.createTextNode('Real Creation Date: ')
		const skeleton = document.createElement('span')
		skeleton.className = 'udemy-creation-date-skeleton'
		
		loadingSpan.appendChild(labelText)
		loadingSpan.appendChild(skeleton)
		
		courseTitle.appendChild(document.createElement('br'))
		courseTitle.appendChild(loadingSpan)
		
		// Fetch course data
		const courseData = await getCourseDataFromServer(id)
		
		if (!courseData || !courseData.created) {
			console.warn('Course data or creation date not available')
			loadingSpan.textContent = 'Creation date unavailable'
			loadingSpan.style.color = '#856404'
			loadingSpan.style.backgroundColor = '#fff3cd'
			isRendering = false
			return
		}
		
		const creationDateTime = new Date(courseData.created)
		
		if (isNaN(creationDateTime.getTime())) {
			console.warn('Invalid creation date')
			loadingSpan.textContent = 'Invalid creation date'
			loadingSpan.style.color = '#856404'
			loadingSpan.style.backgroundColor = '#fff3cd'
			isRendering = false
			return
		}
		
		const creationDate = creationDateTime.toLocaleDateString()
		
		// Replace skeleton with actual date
		loadingSpan.className = 'udemy-creation-date'
		loadingSpan.innerHTML = '' // Clear skeleton
		loadingSpan.textContent = `Real Creation Date: ${creationDate}`
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
		setTimeout(renderTitle, 300)
	})
} else {
	setTimeout(renderTitle, 300)
}
