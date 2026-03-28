import { getFlashModel } from '@/lib/gemini'

export async function describeProjectFromGitHub(repoUrl: string): Promise<string> {
  // Extract owner/repo from URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/)
  if (!match) throw new Error('Invalid GitHub repository URL')

  const [, owner, repo] = match

  // Fetch README from GitHub
  const readmeRes = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
  )

  let readmeText = ''
  if (readmeRes.ok) {
    readmeText = (await readmeRes.text()).slice(0, 3000)
  } else {
    // Try master branch
    const masterRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
    )
    if (masterRes.ok) {
      readmeText = (await masterRes.text()).slice(0, 3000)
    }
  }

  if (!readmeText) {
    throw new Error('Could not access README. Make sure the repository is public.')
  }

  const model = getFlashModel()
  const result = await model.generateContent(
    `Write a 1-2 sentence portfolio description for this project based on the README. Be specific about what it does and who it's for. Return only the description, no quotes, no explanation.

README:
${readmeText}`
  )

  return result.response.text().trim().replace(/^["']|["']$/g, '')
}
