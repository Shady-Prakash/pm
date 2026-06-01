import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env' })

const prisma = new PrismaClient()

const covers = [
  {
    slug: 'getting-started-with-mern-stack',
    coverImage: 'https://cdn-images-1.medium.com/max/1024/0*FaErr7suffhKPbGd',
  },
  {
    slug: 'building-a-simple-sentiment-analyzer-with-python-textblob-vader',
    coverImage: 'https://cdn-images-1.medium.com/max/1024/1*jWiLGS3YIvRGxuAMJGlJNA.png',
  },
  {
    slug: 'gesture-controlled-camera-filters-using-python-opencv-mediapipe',
    coverImage: 'https://cdn-images-1.medium.com/max/800/1*jLI1oXLFF-YTvUqOFUGwCA.jpeg',
  },
  {
    slug: 'building-a-calories-advisor-app-with-streamlit-and-google-gemini-vision-api',
    coverImage: 'https://cdn-images-1.medium.com/max/800/1*4JAel-7nLp1nXiGgKdUWVg.gif',
  },
  {
    slug: 'slack-based-google-meet-integration-system',
    coverImage: 'https://cdn-images-1.medium.com/max/1024/1*26mX1KQ_c-uVy2A_YE7oHA.png',
  },
]

async function main() {
  for (const { slug, coverImage } of covers) {
    await prisma.blogPost.update({ where: { slug }, data: { coverImage } })
    console.log(`✓ ${slug}`)
  }
  console.log('\nDone!')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
