// GigOS Survey Sync - Content Script
// Runs on survey.com job listing pages

function scrapeJobs() {
  const jobs = []

  // Survey.com job cards - adjust selectors if layout differs
  const cards = document.querySelectorAll(
    '[class*="job-card"], [class*="assignment"], [class*="opportunity"], ' +
    '[data-testid*="job"], [data-testid*="assignment"], ' +
    '.job-listing, .assignment-card, .opportunity-item, ' +
    'li[class*="job"], div[class*="job-item"]'
  )

  cards.forEach((card, i) => {
    try {
      // Title
      const titleEl = card.querySelector(
        'h2, h3, h4, [class*="title"], [class*="name"], [class*="job-name"]'
      )
      const title = titleEl?.innerText?.trim()
      if (!title) return

      // Location
      const locationEl = card.querySelector(
        '[class*="location"], [class*="address"], [class*="store"], [class*="city"]'
      )
      const location = locationEl?.innerText?.trim() ?? null

      // Payout
      const payEl = card.querySelector(
        '[class*="pay"], [class*="amount"], [class*="fee"], [class*="price"], [class*="reward"]'
      )
      const payText = payEl?.innerText?.trim() ?? ''
      const payMatch = payText.match(/\$?([\d,]+\.?\d*)/)
      const payoutAmount = payMatch ? parseFloat(payMatch[1].replace(',', '')) : null

      // Time estimate
      const timeEl = card.querySelector(
        '[class*="time"], [class*="duration"], [class*="minutes"], [class*="hours"]'
      )
      const timeText = timeEl?.innerText?.trim() ?? ''
      const hrMatch = timeText.match(/(\d+)\s*h/i)
      const minMatch = timeText.match(/(\d+)\s*m/i)
      const estMinutes = hrMatch
        ? parseInt(hrMatch[1]) * 60 + (minMatch ? parseInt(minMatch[1]) : 0)
        : minMatch
        ? parseInt(minMatch[1])
        : null

      // Deadline
      const deadlineEl = card.querySelector(
        '[class*="deadline"], [class*="due"], [class*="expire"], [class*="date"]'
      )
      const deadlineText = deadlineEl?.innerText?.trim() ?? null
      let deadline = null
      if (deadlineText) {
        const parsed = new Date(deadlineText)
        if (!isNaN(parsed.getTime())) deadline = parsed.toISOString()
      }

      // URL
      const linkEl = card.querySelector('a[href]')
      const href = linkEl?.getAttribute('href') ?? ''
      const detailUrl = href.startsWith('http')
        ? href
        : href
        ? `https://app.survey.com${href}`
        : window.location.href

      // External ID - try data attrs, fallback to index+title hash
      const externalId =
        card.dataset?.id ??
        card.dataset?.jobId ??
        card.dataset?.assignmentId ??
        card.id ??
        `auto-${Date.now()}-${i}`

      jobs.push({
        externalId: String(externalId),
        title,
        location,
        payoutAmount,
        payoutCurrency: 'USD',
        estMinutes,
        deadline,
        detailUrl,
      })
    } catch (e) {
      // skip malformed card
    }
  })

  return jobs
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SCRAPE_JOBS') {
    const jobs = scrapeJobs()
    sendResponse({ jobs, url: window.location.href, count: jobs.length })
  }
  if (msg.action === 'GET_PAGE_INFO') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      isSurveySite: window.location.hostname.includes('survey.com'),
    })
  }
  return true // keep channel open for async
})

// Auto-scrape and badge update when page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    const jobs = scrapeJobs()
    if (jobs.length > 0) {
      chrome.runtime.sendMessage({
        action: 'JOBS_FOUND',
        count: jobs.length,
      })
    }
  }, 1500)
})
