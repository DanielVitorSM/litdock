import axios from 'axios'

export async function fetchPdfFromUnpaywall(doi: string): Promise<string | undefined> {
  try {
    const email = 'contato.danielsmoreira@gmail.com'

    const { data } = await axios.get(
      `https://api.unpaywall.org/v2/${doi}?email=${email}`
    )

    if (data.best_oa_location && data.best_oa_location.url_for_pdf) {
      return data.best_oa_location.url_for_pdf
    }

    if (data.oa_locations && data.oa_locations.length > 0) {
      for (const location of data.oa_locations) {
        if (location.url_for_pdf) {
          return location.url_for_pdf
        }
      }
    }

    return undefined
  } catch (error: unknown) {
    console.log('Erro ao buscar PDF no Unpaywall:', error)
    return undefined
  }
}