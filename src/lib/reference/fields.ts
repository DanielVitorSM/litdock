export const referenceFields: Record<string, { label: string; type: string; required?: boolean }> = {
  title: { label: 'Título', type: 'text', required: true },
  shortTitle: { label: 'Título curto', type: 'text' },
  subtitle: { label: 'Subtítulo', type: 'text' },

  language: { label: 'Idioma', type: 'text' },
  abstract: { label: 'Resumo', type: 'textarea' },

  creators: {
    label: 'Autores / Criadores',
    type: 'creators',
    required: true,
  },

  date: { label: 'Data', type: 'date' },
  accessDate: { label: 'Data de acesso', type: 'date' },
  eventDate: { label: 'Data do evento', type: 'date' },

  publicationTitle: {
    label: 'Título da publicação',
    type: 'text',
  },
  journalAbbreviation: {
    label: 'Abreviação do periódico',
    type: 'text',
  },
  publisher: { label: 'Editora', type: 'text' },
  place: { label: 'Local', type: 'text' },
  series: { label: 'Série', type: 'text' },
  seriesNumber: { label: 'Número da série', type: 'text' },
  edition: { label: 'Edição', type: 'text' },
  volume: { label: 'Volume', type: 'text' },
  issue: { label: 'Número', type: 'text' },
  pages: { label: 'Páginas', type: 'text' },
  section: { label: 'Seção', type: 'text' },

  doi: { label: 'DOI', type: 'identifier' },
  isbn: { label: 'ISBN', type: 'identifier' },
  issn: { label: 'ISSN', type: 'identifier' },
  pmid: { label: 'PMID', type: 'identifier' },
  arxivId: { label: 'arXiv ID', type: 'identifier' },
  callNumber: { label: 'Número de chamada', type: 'text' },
  reportNumber: { label: 'Número do relatório', type: 'text' },
  patentNumber: { label: 'Número da patente', type: 'text' },
  standardNumber: { label: 'Número do padrão', type: 'text' },

  institution: { label: 'Instituição', type: 'text' },
  university: { label: 'Universidade', type: 'text' },
  faculty: { label: 'Faculdade', type: 'text' },
  department: { label: 'Departamento', type: 'text' },
  advisor: { label: 'Orientador', type: 'text' },
  degree: { label: 'Grau', type: 'text' },
  conferenceName: {
    label: 'Nome da conferência',
    type: 'text',
  },
  meetingPlace: { label: 'Local do evento', type: 'text' },

  court: { label: 'Tribunal', type: 'text' },
  jurisdiction: { label: 'Jurisdição', type: 'text' },
  authority: { label: 'Autoridade', type: 'text' },
  caseNumber: { label: 'Número do caso', type: 'text' },
  statuteCode: { label: 'Código do estatuto', type: 'text' },
  publicLawNumber: {
    label: 'Número da lei',
    type: 'text',
  },
  session: { label: 'Sessão', type: 'text' },

  medium: { label: 'Mídia', type: 'text' },
  format: { label: 'Formato', type: 'text' },
  duration: { label: 'Duração', type: 'text' },
  runningTime: {
    label: 'Tempo de execução',
    type: 'text',
  },
  network: { label: 'Emissora', type: 'text' },
  studio: { label: 'Estúdio', type: 'text' },
  audioFileType: {
    label: 'Tipo de áudio',
    type: 'text',
  },
  videoFileType: {
    label: 'Tipo de vídeo',
    type: 'text',
  },

  url: { label: 'URL', type: 'url' },
  archive: { label: 'Arquivo', type: 'text' },
  archiveLocation: {
    label: 'Local do arquivo',
    type: 'text',
  },
  repository: { label: 'Repositório', type: 'text' },
  platform: { label: 'Plataforma', type: 'text' },

  tags: { label: 'Tags', type: 'tags' },
  notes: { label: 'Notas', type: 'textarea' },
  extra: { label: 'Extra', type: 'textarea' },
} as const

export const fieldsByReferenceType = {
  presentation: {
    required: ['title', 'creators', 'date'],
    optional: [
      'conferenceName',
      'meetingPlace',
      'eventDate',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  newspaperArticle: {
    required: ['title', 'publicationTitle', 'date'],
    optional: [
      'creators',
      'section',
      'pages',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  journalArticle: {
    required: ['title', 'creators', 'publicationTitle', 'date'],
    optional: [
      'journalAbbreviation',
      'volume',
      'issue',
      'pages',
      'doi',
      'issn',
      'pmid',
      'arxivId',
      'language',
      'abstract',
      'notes',
    ],
  },

  magazineArticle: {
    required: ['title', 'publicationTitle', 'date'],
    optional: [
      'creators',
      'volume',
      'issue',
      'pages',
      'url',
      'language',
      'abstract',

      'notes',
    ],
  },

  hearing: {
    required: ['title', 'authority', 'date'],
    optional: [
      'session',
      'place',
      'url',
      'language',
      'notes',
    ],
  },

  database: {
    required: ['title'],
    optional: [
      'publisher',
      'place',
      'url',
      'accessDate',
      'language',
      'abstract',
      'notes',
    ],
  },

  letter: {
    required: ['title', 'creators', 'date'],
    optional: [
      'place',
      'language',
      'abstract',
      'notes',
    ],
  },

  case: {
    required: ['title', 'court', 'date'],
    optional: [
      'jurisdiction',
      'authority',
      'caseNumber',
      'url',
      'language',
      'notes',
    ],
  },

  conferencePaper: {
    required: ['title', 'creators', 'conferenceName', 'date'],
    optional: [
      'publicationTitle',
      'pages',
      'place',
      'doi',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  email: {
    required: ['title', 'creators', 'date'],
    optional: [
      'language',
      'notes',
    ],
  },

  document: {
    required: ['title'],
    optional: [
      'creators',
      'publisher',
      'date',
      'language',
      'abstract',
      'notes',
    ],
  },

  thesis: {
    required: ['title', 'creators', 'university', 'date'],
    optional: [
      'advisor',
      'degree',
      'department',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  interview: {
    required: ['title', 'creators', 'date'],
    optional: [
      'medium',
      'place',
      'language',
      'abstract',
      'notes',
    ],
  },

  blogPost: {
    required: ['title', 'publicationTitle', 'date', 'url'],
    optional: [
      'creators',
      'accessDate',
      'language',
      'abstract',
      'notes',
    ],
  },

  forumPost: {
    required: ['title', 'publicationTitle', 'date', 'url'],
    optional: [
      'creators',
      'accessDate',
      'language',
      'abstract',
      'notes',
    ],
  },

  statute: {
    required: ['title', 'statuteCode', 'date'],
    optional: [
      'jurisdiction',
      'authority',
      'url',
      'language',
      'notes',
    ],
  },

  film: {
    required: ['title'],
    optional: [
      'creators',
      'date',
      'runningTime',
      'studio',
      'medium',
      'language',
      'abstract',
      'notes',
    ],
  },

  videoRecording: {
    required: ['title'],
    optional: [
      'creators',
      'date',
      'duration',
      'videoFileType',
      'platform',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  audioRecording: {
    required: ['title'],
    optional: [
      'creators',
      'date',
      'duration',
      'audioFileType',
      'platform',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  legislation: {
    required: ['title', 'authority', 'date'],
    optional: [
      'jurisdiction',
      'publicLawNumber',
      'url',
      'language',
      'notes',
    ],
  },

  book: {
    required: ['title', 'creators', 'publisher', 'date'],
    optional: [
      'edition',
      'place',
      'series',
      'seriesNumber',
      'isbn',
      'language',
      'abstract',
      'notes',
    ],
  },

  manuscript: {
    required: ['title'],
    optional: [
      'creators',
      'date',
      'language',
      'abstract',
      'notes',
    ],
  },

  map: {
    required: ['title'],
    optional: [
      'creators',
      'publisher',
      'place',
      'date',
      'scale',
      'language',
      'abstract',

      'notes',
    ],
  },

  instantMessage: {
    required: ['title', 'creators', 'date'],
    optional: [
      'platform',
      'language',
      'notes',
    ],
  },

  monograph: {
    required: ['title', 'creators', 'publisher', 'date'],
    optional: [
      'edition',
      'place',
      'series',
      'isbn',
      'language',
      'abstract',
      'notes',
    ],
  },

  note: {
    required: ['title'],
    optional: [
      'notes',

    ],
  },

  artwork: {
    required: ['title', 'creators'],
    optional: [
      'medium',
      'place',
      'date',
      'language',
      'abstract',
      'notes',
    ],
  },

  standard: {
    required: ['title', 'standardNumber'],
    optional: [
      'publisher',
      'date',
      'url',
      'language',
      'notes',
    ],
  },

  patent: {
    required: ['title', 'patentNumber', 'date'],
    optional: [
      'authority',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  podcast: {
    required: ['title', 'creators', 'date'],
    optional: [
      'duration',
      'platform',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  program: {
    required: ['title'],
    optional: [
      'creators',
      'publisher',
      'date',
      'url',
      'language',
      'notes',
    ],
  },

  preprint: {
    required: ['title', 'creators', 'date'],
    optional: [
      'publicationTitle',
      'doi',
      'arxivId',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  webpage: {
    required: ['title', 'url', 'accessDate'],
    optional: [
      'creators',
      'language',
      'abstract',
      'notes',
    ],
  },

  report: {
    required: ['title', 'institution', 'date'],
    optional: [
      'reportNumber',
      'place',
      'url',
      'language',
      'abstract',
      'notes',
    ],
  },

  bookSection: {
    required: [
      'title',
      'creators',
      'publicationTitle',
      'publisher',
      'date',
    ],
    optional: [
      'pages',
      'edition',
      'place',
      'isbn',
      'language',
      'abstract',
      'notes',
    ],
  },

  tvBroadcast: {
    required: ['title', 'date'],
    optional: [
      'network',
      'runningTime',
      'language',
      'abstract',
      'notes',
    ],
  },

  radioBroadcast: {
    required: ['title', 'date'],
    optional: [
      'network',
      'runningTime',
      'language',
      'abstract',
      'notes',
    ],
  },

  dictionaryEntry: {
    required: ['title', 'publicationTitle'],
    optional: [
      'edition',
      'publisher',
      'date',
      'language',
      'abstract',
      'notes',
    ],
  },

  encyclopediaEntry: {
    required: ['title', 'publicationTitle'],
    optional: [
      'edition',
      'publisher',
      'date',
      'language',
      'abstract',
      'notes',
    ],
  },
} as Record<string, { required: string[]; optional: string[] }>