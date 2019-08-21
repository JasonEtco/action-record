import { GitHub } from '@actions/github'

// Export a singleton
const octokit = new GitHub(process.env.GITHUB_TOKEN as string)
export default octokit
