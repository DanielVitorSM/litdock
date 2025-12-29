import { BookOpenText, Clapperboard, Database, FileText, Mail, MessageSquare, MicVocal, Newspaper, Presentation, Rss, Scale, Users, Video, Map, MessageSquareText, ScrollText, StickyNote, NotebookText, Landmark, Tv, Palette, Globe, Computer } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import { z } from 'zod'

export const referenceTypeDict: Record<string, string> = {
  presentation: 'Apresentação',
  newspaperArticle: 'Artigo de jornal',
  journalArticle: 'Artigo de periódico',
  magazineArticle: 'Artigo de revista',
  hearing: 'Audiência',
  database: 'Base de dados',
  letter: 'Carta',
  case: 'Caso',
  conferencePaper: 'Conferência',
  email: 'Correio eletrônico',
  document: 'Documento',
  thesis: 'Dissertação',
  interview: 'Entrevista',
  blogPost: 'Envio de blog',
  forumPost: 'Envio de fórum',
  statute: 'Estatuto',
  film: 'Filme',
  videoRecording: 'Gravação de vídeo',
  audioRecording: 'Gravação de áudio',
  legislation: 'Legislação',
  book: 'Livro',
  manuscript: 'Manuscrito',
  map: 'Mapa',
  instantMessage: 'Mensagem instantânea',
  monograph: 'Monografia',
  note: 'Nota',
  artwork: 'Obra de arte',
  standard: 'Padrão',
  patent: 'Patente',
  podcast: 'Podcast',
  tvBroadcast: 'Transmissão de TV',
  radioBroadcast: 'Transmissão de rádio',
  preprint: 'Pré-impressão',
  webpage: 'Página web',
  report: 'Relatório',
  bookSection: 'Seção de livro',
  program: 'Programa',
  dictionaryEntry: 'Verbete de dicionário',
  encyclopediaEntry: 'Verbete de enciclopédia',
} as const

export type ReferenceType = keyof typeof referenceTypeDict

export const referenceTypeIconDict: Record<ReferenceType, FunctionalComponent> = {
  presentation: Presentation,
  newspaperArticle: Newspaper,
  journalArticle: Newspaper,
  magazineArticle: Newspaper,
  hearing: Users,
  database: Database,
  letter: Mail,
  case: Scale,
  conferencePaper: FileText,
  email: Mail,
  document: FileText,
  thesis: NotebookText,
  interview: MessageSquare,
  blogPost: Rss,
  forumPost: Rss,
  statute: Landmark,
  film: Clapperboard,
  videoRecording: Video,
  audioRecording: MicVocal,
  legislation: Scale,
  book: BookOpenText,
  manuscript: ScrollText,
  map: Map,
  instantMessage: MessageSquareText,
  monograph: NotebookText,
  note: StickyNote,
  artwork: Palette,
  standard: Landmark,
  patent: Landmark,
  podcast: MicVocal,
  tvBroadcast: Tv,
  radioBroadcast: MicVocal,
  preprint: FileText,
  webpage: Globe,
  report: FileText,
  bookSection: BookOpenText,
  program: Computer,
  dictionaryEntry: BookOpenText,
  encyclopediaEntry: BookOpenText,
}

export const referenceTypeColorDict: Record<ReferenceType, string> = {
  // Acadêmico / Científico
  presentation: 'academic',
  journalArticle: 'academic',
  conferencePaper: 'academic',
  thesis: 'academic',
  monograph: 'academic',
  preprint: 'academic',
  report: 'academic',

  // Publicações & Mídia escrita
  newspaperArticle: 'media',
  magazineArticle: 'media',
  blogPost: 'media',
  forumPost: 'media',
  webpage: 'media',

  // Jurídico / Normativo
  case: 'legal',
  legislation: 'legal',
  statute: 'legal',
  standard: 'legal',
  patent: 'legal',

  // Livros & Referência
  book: 'reference',
  bookSection: 'reference',
  dictionaryEntry: 'reference',
  encyclopediaEntry: 'reference',
  manuscript: 'reference',

  // Comunicação direta
  email: 'communication',
  letter: 'communication',
  interview: 'communication',
  instantMessage: 'communication',

  // Mídia audiovisual
  film: 'mediaAV',
  videoRecording: 'mediaAV',
  tvBroadcast: 'mediaAV',
  audioRecording: 'mediaAV',
  podcast: 'mediaAV',
  radioBroadcast: 'mediaAV',

  // Documentos & dados
  document: 'data',
  database: 'data',
  note: 'data',
  program: 'data',

  // Criativo / Visual
  artwork: 'creative',
  map: 'creative',

  // Institucional
  hearing: 'institutional',
}

export const referenceTypeOptions = Object.entries(
  referenceTypeDict
).map(([value, label]) => ({
  value,
  label,
}))

export const ReferenceTypeSchema = z.enum(
  Object.keys(referenceTypeDict) as [
    keyof typeof referenceTypeDict,
    ...Array<keyof typeof referenceTypeDict>
  ]
)

