async function testEndpoints() {
  const routes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/onboarding',
    '/woman',
    '/woman/education',
    '/woman/symptoms',
    '/woman/cycle',
    '/woman/pcos-pcod',
    '/woman/uti',
    '/woman/nutrition',
    '/woman/food-reminder',
    '/woman/water-reminder',
    '/woman/loved-ones',
    '/woman/insights',
    '/woman/ai-assistant',
    '/woman/profile',
    '/man',
    '/man/education',
    '/man/symptoms',
    '/man/prevention',
    '/man/self-care',
    '/man/loved-ones',
    '/man/ai-assistant',
    '/man/profile',
    '/api/articles?experience=women',
    '/api/articles?experience=boys',
  ]

  console.log('====================================================')
  console.log('🌐 HERWELL LIVE HTTP ENDPOINT DIAGNOSTIC AUDIT')
  console.log('====================================================\n')

  let passed = 0
  let failed = 0

  for (const route of routes) {
    const url = `http://localhost:3000${route}`
    try {
      const res = await fetch(url, { redirect: 'manual' })
      const status = res.status
      // 200 OK or 307/302 Redirect to onboarding/sign-in are healthy responses
      if (status === 200 || status === 307 || status === 302 || status === 308) {
        console.log(`✅ [${status}] ${route}`)
        passed++
      } else {
        console.error(`❌ [${status}] ${route}`)
        failed++
      }
    } catch (err: any) {
      console.error(`❌ [ERROR] ${route} -> ${err.message}`)
      failed++
    }
  }

  console.log('\n====================================================')
  console.log(`📊 HTTP ROUTE AUDIT: ${passed}/${routes.length} HEALTHY`)
  console.log('====================================================\n')

  if (failed > 0) process.exit(1)
}

testEndpoints().catch((e) => {
  console.error(e)
  process.exit(1)
})
