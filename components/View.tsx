import { client } from '@/sanity/lib/client'
import Ping from './Ping'
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries'
import { writeClient } from '@/sanity/lib/write-client'
import { after } from 'next/server'

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id })
  const formatNumber = totalViews < 2 ? 'View' : 'Views' // I made this by myself as a challenge!

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  )

  return (
    <div className="view-container relative -translate-y-[50px]">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">
          {totalViews} {formatNumber}
        </span>
      </p>
    </div>
  )
}

export default View
