import { Plugin } from 'vite'
import { UnocssPluginContext } from '../../plugins-common/context'

export function ConfigHMRPlugin(ctx: UnocssPluginContext): Plugin | undefined {
  const { ready, uno } = ctx
  return {
    name: 'unocss:config',
    async configResolved() {
      await ready
    },
    async configureServer(server) {
      uno.config.envMode = 'dev'

      const { sources } = await ready

      if (!sources.length)
        return

      server.watcher.add(sources)
      server.watcher.on('change', async(p) => {
        if (!sources.includes(p))
          return

        await ctx.reloadConfig()

        server.ws.send({
          type: 'custom',
          event: 'unocss:config-changed',
        })
      })
    },
  }
}
