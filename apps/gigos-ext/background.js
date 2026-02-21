// GigOS Survey Sync - Background Service Worker

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'JOBS_FOUND') {
    // Update badge with job count
    chrome.action.setBadgeText({ text: String(msg.count) })
    chrome.action.setBadgeBackgroundColor({ color: '#06b6d4' }) // cyan
  }

  if (msg.action === 'PUSH_TO_GIGOS') {
    const { jobs, apiUrl, token } = msg
    fetch(`${apiUrl}/api/tasks/import/survey-merch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': token,
      },
      body: JSON.stringify({ gigs: jobs }),
    })
      .then((r) => r.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }))

    return true // keep async
  }
})

// Clear badge when tab navigates away from survey.com
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    if (!tab.url?.includes('survey.com')) {
      chrome.action.setBadgeText({ text: '' })
    }
  }
})
