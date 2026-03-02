import { nextTestSetup } from 'e2e-utils'

describe('instant-static-shell-validation-sync-io', () => {
  const { next, skipped, isNextDev } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })
  if (skipped) return

  if (isNextDev) {
    it('detects sync IO in client component when entire tree is new', async () => {
      await next.start()
      const browser = await next.browser('/')
      await expect(browser).toDisplayCollapsedRedbox(`
       {
         "code": "E394",
         "description": "Route "/" used \`Date.now()\` inside a Client Component without a Suspense boundary above it. See more info here: https://nextjs.org/docs/messages/next-prerender-current-time-client",
         "environmentLabel": "Server",
         "label": "Console Error",
         "source": "app/client.tsx (4:20) @ SyncIOClient
       > 4 |   const now = Date.now()
           |                    ^",
         "stack": [
           "SyncIOClient app/client.tsx (4:20)",
           "RootLayout app/layout.tsx (7:9)",
         ],
       }
      `)
    })
  } else {
    it('errors during build', async () => {
      const { cliOutput, exitCode } = await next.build()
      expect(exitCode).toBe(1)
      expect(cliOutput).toContain('Date.now()')
    })
  }
})
