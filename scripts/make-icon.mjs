import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const source = new URL('../public/brand.png', import.meta.url)
const target = new URL('../public/app.ico', import.meta.url)
const optimized = await sharp(fileURLToPath(source)).resize(512, 512, { fit: 'cover' }).png({ palette: true, quality: 90 }).toBuffer()
await fs.writeFile(source, optimized)
await fs.writeFile(target, await pngToIco(optimized))
