import { Grid3x3, FileText, Mic } from 'lucide-react';
import { endpoints } from '../../../shared/api/endpoints';

// Column Definitions
export const commonColumns = {
  rank: { key: 'rank', label: 'Rank (UB)', sortable: true, width: '10%' },
  model: { key: 'model', label: 'Model', sortable: true, className: 'font-mono' },
  score: { key: 'score', label: 'Score', sortable: true, align: 'right' },
  ci: { key: 'ci', label: '95% CI (±)', sortable: true, align: 'right' },
  votes: { key: 'votes', label: 'Votes', sortable: true, align: 'right' },
  organization: { key: 'organization', label: 'Organization', sortable: true },
  license: { key: 'license', label: 'License', sortable: true },
};

export const leaderboardColumns = [
  commonColumns.rank,
  commonColumns.model,
  commonColumns.score,
  commonColumns.ci,
  commonColumns.votes,
  commonColumns.organization,
  commonColumns.license,
];

// Language Definitions
const indianLanguages = [
  { value: 'marathi', label: 'Marathi', icon: '🇮🇳' },
  { value: 'nepali', label: 'Nepali', icon: '🇮🇳' },
  { value: 'kannada', label: 'Kannada', icon: '🇮🇳' },
  { value: 'bengali', label: 'Bengali', icon: '🇮🇳' },
  { value: 'gujarati', label: 'Gujarati', icon: '🇮🇳' },
  { value: 'tamil', label: 'Tamil', icon: '🇮🇳' },
  { value: 'bodo', label: 'Bodo', icon: '🇮🇳' },
  { value: 'maithili', label: 'Maithili', icon: '🇮🇳' },
  { value: 'kashmiri', label: 'Kashmiri', icon: '🇮🇳' },
  { value: 'hindi', label: 'Hindi', icon: '🇮🇳' },
  { value: 'malayalam', label: 'Malayalam', icon: '🇮🇳' },
  { value: 'assamese', label: 'Assamese', icon: '🇮🇳' },
  { value: 'dogri', label: 'Dogri', icon: '🇮🇳' },
  { value: 'konkani', label: 'Konkani', icon: '🇮🇳' },
  { value: 'telugu', label: 'Telugu', icon: '🇮🇳' },
  { value: 'sanskrit', label: 'Sanskrit', icon: '🇮🇳' },
  { value: 'manipuri', label: 'Manipuri', icon: '🇮🇳' },
  { value: 'urdu', label: 'Urdu', icon: '🇮🇳' },
  { value: 'odia', label: 'Odia', icon: '🇮🇳' },
  { value: 'santali', label: 'Santali', icon: '🇮🇳' },
  { value: 'punjabi', label: 'Punjabi', icon: '🇮🇳' },
  { value: 'sindhi', label: 'Sindhi', icon: '🇮🇳' },
];

const globalLanguages = [
  { value: 'english', label: 'English', icon: '🇬🇧' },
  { value: 'thai', label: 'Thai', icon: '🇹🇭' },
];

export const allLanguages = [...indianLanguages, ...globalLanguages];

// Organization Options
export const organizationOptions = [
  { value: 'ai4bharat', label: 'AI4Bharat' },
  { value: 'aquarium', label: 'Aquarium' },
  { value: 'ai4x', label: 'AI4X' },
];

// TTS Data Mapper
const ttsDataMapper = (data) => {
  return (Array.isArray(data) ? data : [])
    .filter(m => m?.is_active === true)
    .map(m => ({
      rank: 0,
      model: m.display_name,
      score: 0,
      ci: 0,
      votes: 0,
      organization: (m.provider || '').charAt(0).toUpperCase() + (m.provider || '').slice(1),
      language: 'english',
      id: m.id,
      display_name: m.display_name,
      license: 'Unknown',
    }));
};

// Feature Configurations
export const leaderboardConfig = {
  asr: {
    title: 'ASR Arena',
    description: 'View rankings across various ASR models on their versatility, linguistic precision, and cultural context.',
    type: 'asr',
    defaultLanguage: 'english',
    defaultOrganization: 'ai4bharat',
    languages: allLanguages,
    organizations: organizationOptions,
    columns: leaderboardColumns,
    fetchEndpoint: (params) => endpoints.models.leaderboard('asr', params?.organization),
    getOverviewSections: (tenant) => [
      {
        id: 'asr',
        title: 'ASR',
        icon: Mic,
        fetchEndpoint: endpoints.models.leaderboard('asr'),
        viewAllLink: tenant ? `/${tenant}/leaderboard/asr` : '/leaderboard/asr',
        columns: leaderboardColumns,
      }
    ]
  },
  llm: { // Chat
    title: 'Text Arena',
    description: 'View rankings across various LLMs on their versatility, linguistic precision, and cultural context across text.',
    type: 'llm',
    defaultLanguage: 'english',
    defaultOrganization: 'ai4bharat',
    languages: allLanguages,
    organizations: organizationOptions,
    columns: leaderboardColumns,
    fetchEndpoint: (params) => endpoints.models.leaderboard('llm', params?.organization),
    getOverviewSections: (tenant) => [
      {
        id: 'text',
        title: 'Text',
        icon: FileText,
        fetchEndpoint: (params) => endpoints.models.leaderboard('llm', params?.organization || tenant || 'ai4bharat'),
        viewAllLink: tenant ? `/${tenant}/leaderboard/chat/text` : '/leaderboard/chat/text',
        columns: leaderboardColumns,
      }
    ]
  },
  tts: {
    title: 'TTS Arena',
    description: 'View rankings across various TTS models.',
    type: 'tts',
    defaultLanguage: 'english',
    defaultOrganization: 'ai4bharat',
    languages: allLanguages, // Or specific TTS languages if different
    organizations: organizationOptions,
    columns: leaderboardColumns,
    fetchEndpoint: '/models/',
    dataMapper: ttsDataMapper,
    getOverviewSections: (tenant) => [
      {
        id: 'tts',
        title: 'TTS',
        icon: FileText,
        fetchEndpoint: '/models/',
        viewAllLink: tenant ? `/${tenant}/leaderboard/tts/tts` : '/leaderboard/tts/tts',
        columns: leaderboardColumns,
        dataMapper: ttsDataMapper,
      }
    ]
  }
};
