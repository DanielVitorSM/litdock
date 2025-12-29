import { supabase } from '@/lib/supabase'
import { localFileStore } from '@/lib/localStore'

const CLOUD_LIMIT_BYTES = 512 * 1024

export const storageService = {
  async uploadPaper(file: File, userId: string): Promise<string> {
    if (file.size > CLOUD_LIMIT_BYTES) {
      const uniqueId = `local://${userId}_${Date.now()}_${file.name}`

      await localFileStore.saveFile(uniqueId, file)

      return uniqueId
    }

    const timestamp = Date.now()
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${userId}/${timestamp}_${cleanName}`

    const { data, error } = await supabase.storage
      .from('papers')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (error) throw error
    return data.path
  },

  async removePaper(path: string) {
    if (path.startsWith('local://')) {
      await localFileStore.removeFile(path)
      return
    }

    const { error } = await supabase.storage
      .from('papers')
      .remove([path])

    if (error) throw error
  },

  async getFileUrl(path: string): Promise<string | null> {
    if (path.startsWith('local://')) {
      const blob = await localFileStore.getFile(path)
      if (!blob) return null
      return URL.createObjectURL(blob)
    }

    const { data, error } = await supabase.storage
      .from('papers')
      .createSignedUrl(path, 60 * 60)

    if (error) throw error
    return data.signedUrl
  }
}