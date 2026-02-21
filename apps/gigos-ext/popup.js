let scrapedJobs = []

const $ = (id) => document.getElementById(id)

// Load saved settings
chrome.storage.local.get(['apiUrl', 'token'], (data) => {
  if (data.apiUrl) $('apiUrl').value = data.apiUrl
  if (data.token) $('token').value = data.token
})

// Save settings on change
$('apiUrl').addEventListener('change', () => {
  chrome.storage.local.set({ apiUrl: $('apiUrl').value.trim() })
})
$('token').addEventListener('change', () => {
  chrome.storage.local.set({ token: $('token').value.trim() })
})

// Check current page
async function checkPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const isSurvey = tab?.url?.includes('survey.com')
  const dot = $('pageDot')
  const status = $('pageStatus')

  if (isSurvey) {
    dot.className = 'dot green'
    status.textContent = '✓ Survey.com detected'
    $('scrapeBtn').disabled = false
  } else {
    dot.className = 'dot yellow'
    status.textContent = 'Navigate to survey.com to scan'
    $('scrapeBtn').disabled = true
  }
}

// Scan page for jobs
$('scrapeBtn').addEventListener('click', async () => {
  $('scrapeBtn').disabled = true
  $('scrapeBtn').textContent = '⏳ Scanning...'
  $('resultArea').innerHTML = ''

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const results = await chrome.tabs.sendMessage(tab.id, { action: 'SCRAPE_JOBS' })
    scrapedJobs = results?.jobs ?? []

    $('jobCount').textContent = scrapedJobs.length
    $('jobCountLabel').textContent = scrapedJobs.length === 1 ? 'job found' : 'jobs found'

    if (scrapedJobs.length > 0) {
      // Show job list
      $('jobsSection').style.display = 'block'
      const list = $('jobsList')
      list.innerHTML = scrapedJobs.map(j => `
        <div class="job-item">
          <div class="job-title">${j.title}</div>
          <div class="job-meta">
            ${j.location ? `📍 ${j.location} &nbsp;` : ''}
            ${j.payoutAmount ? `<span class="pay">$${j.payoutAmount.toFixed(2)}</span>` : ''}
            ${j.estMinutes ? ` &nbsp;⏱ ${j.estMinutes}min` : ''}
          </div>
        </div>
      `).join('')
      $('pushBtn').disabled = false
      showResult(`Found ${scrapedJobs.length} jobs — ready to push!`, 'success')
    } else {
      $('jobsSection').style.display = 'none'
      $('pushBtn').disabled = true
      showResult('No jobs found on this page. Try navigating to a job listing page.', 'error')
    }
  } catch (e) {
    showResult('Could not scan page. Refresh Survey.com and try again.', 'error')
  }

  $('scrapeBtn').disabled = false
  $('scrapeBtn').textContent = '🔍 Scan Page for Jobs'
})

// Push jobs to GigOS
$('pushBtn').addEventListener('click', async () => {
  const apiUrl = $('apiUrl').value.trim() || 'http://localhost:3000'
  const token = $('token').value.trim()

  if (!token) {
    showResult('Add your sync token first.', 'error')
    return
  }

  if (!scrapedJobs.length) {
    showResult('Scan the page first.', 'error')
    return
  }

  $('pushBtn').disabled = true
  $('pushBtn').textContent = '⏳ Pushing...'

  chrome.runtime.sendMessage(
    { action: 'PUSH_TO_GIGOS', jobs: scrapedJobs, apiUrl, token },
    (response) => {
      if (response?.success) {
        const { created, updated } = response.data
        showResult(`✅ Pushed! ${created} new, ${updated} updated`, 'success')
        $('jobCount').textContent = '✓'
        $('jobCountLabel').textContent = 'synced to GigOS'
      } else {
        showResult(`❌ Push failed: ${response?.error ?? 'Unknown error'}`, 'error')
      }
      $('pushBtn').disabled = false
      $('pushBtn').textContent = '🚀 Push to GigOS'
    }
  )
})

function showResult(msg, type) {
  $('resultArea').innerHTML = `<div class="result ${type}">${msg}</div>`
}

// Init
checkPage()
