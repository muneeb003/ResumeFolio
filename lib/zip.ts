import archiver from 'archiver'
import { Writable } from 'stream'

export async function generateZip(html: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        callback()
      },
    })

    writable.on('finish', () => resolve(Buffer.concat(chunks)))
    writable.on('error', reject)

    const archive = archiver('zip', { zlib: { level: 6 } })
    archive.on('error', reject)
    archive.pipe(writable)
    archive.append(html, { name: 'index.html' })
    archive.finalize()
  })
}
