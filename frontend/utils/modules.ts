export interface ModuleDef {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  route: string
}

export const ALL_MODULES: ModuleDef[] = [
  { id: 'micro-course', title: '微课', desc: '知识点精讲视频', icon: 'play_circle', color: 'blue', route: '/micro-course' },
  { id: 'globe', title: '地图库', desc: '探索全球地理', icon: 'public', color: 'emerald', route: '/globe' },
  { id: 'mistakes', title: '题库', desc: '巩固练习测试', icon: 'quiz', color: 'orange', route: '/mistakes' },
  { id: 'ar', title: 'AR探索', desc: '沉浸式观察体验', icon: 'view_in_ar', color: 'purple', route: '/ar' },
  { id: 'leaderboard', title: '排行榜', desc: '看看你的排名', icon: 'leaderboard', color: 'yellow', route: '/leaderboard' },
  { id: 'daily-challenge', title: '每日挑战', desc: '赢取额外奖励', icon: 'bolt', color: 'red', route: '/daily-challenge' },
  { id: 'levels', title: '地理闯关', desc: '逐级闯关挑战', icon: 'flag', color: 'indigo', route: '/levels' },
]

const STORAGE_KEY = 'module_preferences'

export interface ModulePrefs {
  enabled: string[]
  disabled: string[]
}

export function getModulePrefs(): ModulePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.enabled) && Array.isArray(parsed.disabled)) {
        return parsed
      }
    }
  } catch {}
  return { enabled: ALL_MODULES.map(m => m.id), disabled: [] }
}

export function saveModulePrefs(prefs: ModulePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export function getEnabledModules(): ModuleDef[] {
  const prefs = getModulePrefs()
  return prefs.enabled.map(id => ALL_MODULES.find(m => m.id === id)).filter(Boolean) as ModuleDef[]
}
