import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'sbvvl9vs',
    dataset: 'production'
  },
  /**
   * Deployment configuration
   */
  deployment: {
    autoUpdates: true,
    appId: 'q8k8uzhzblzki4jlh5b6z1qw'
  }
})
