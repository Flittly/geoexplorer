import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALL_MODULES, getModulePrefs, saveModulePrefs, ModuleDef } from '../utils/modules'

const colorStyles: Record<string, { bg: string; darkBg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', text: 'text-primary' },
  emerald: { bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20', text: 'text-emerald-600' },
  orange: { bg: 'bg-orange-50', darkBg: 'dark:bg-orange-900/20', text: 'text-orange-600' },
  purple: { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/20', text: 'text-purple-600' },
  yellow: { bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-900/20', text: 'text-yellow-600' },
  red: { bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20', text: 'text-red-600' },
  indigo: { bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900/20', text: 'text-indigo-600' },
}

const ModuleManage: React.FC = () => {
  const navigate = useNavigate()
  const initial = getModulePrefs()
  const [enabled, setEnabled] = useState<string[]>(initial.enabled)
  const [disabled, setDisabled] = useState<string[]>(initial.disabled)
  const [dragId, setDragId] = useState<string | null>(null)

  const persist = (en: string[], dis: string[]) => {
    setEnabled(en)
    setDisabled(dis)
    saveModulePrefs({ enabled: en, disabled: dis })
  }

  const handleRemove = (id: string) => {
    const en = enabled.filter(x => x !== id)
    const dis = [...disabled, id]
    persist(en, dis)
  }

  const handleAdd = (id: string) => {
    const dis = disabled.filter(x => x !== id)
    const en = [...enabled, id]
    persist(en, dis)
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
    setDragId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain') || dragId
    if (!draggedId || draggedId === targetId) return

    const idx = enabled.indexOf(draggedId)
    const targetIdx = enabled.indexOf(targetId)
    if (idx === -1 || targetIdx === -1) return

    const reordered = [...enabled]
    reordered.splice(idx, 1)
    reordered.splice(targetIdx, 0, draggedId)
    persist(reordered, disabled)
    setDragId(null)
  }

  const handleDragEnd = () => {
    setDragId(null)
  }

  const enabledModules = enabled.map(id => ALL_MODULES.find(m => m.id === id)).filter(Boolean) as ModuleDef[]
  const disabledModules = disabled.map(id => ALL_MODULES.find(m => m.id === id)).filter(Boolean) as ModuleDef[]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">模块管理</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            已启用 <span className="text-sm font-normal text-slate-500">({enabled.length})</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {enabledModules.map(mod => {
              const cs = colorStyles[mod.color] || colorStyles.blue
              return (
                <div
                  key={mod.id}
                  draggable
                  onDragStart={e => handleDragStart(e, mod.id)}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, mod.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-shadow ${dragId === mod.id ? 'opacity-50 shadow-md' : ''}`}
                >
                  <span className="material-symbols-outlined text-slate-400 text-lg cursor-grab active:cursor-grabbing shrink-0">drag_indicator</span>
                  <div className={`flex items-center justify-center size-9 rounded-lg ${cs.bg} ${cs.darkBg} shrink-0`}>
                    <span className={`material-symbols-outlined text-[20px] ${cs.text}`}>{mod.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{mod.title}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{mod.desc}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(mod.id)}
                    className="flex items-center justify-center size-7 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            已禁用 <span className="text-sm font-normal text-slate-500">({disabled.length})</span>
          </h2>
          {disabledModules.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-surface-dark p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 mb-2">playlist_add</span>
              <p className="text-sm text-slate-400 dark:text-slate-500">暂无禁用模块</p>
              <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">在已启用区域点击 ✕ 可禁用模块</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {disabledModules.map(mod => (
                <div
                  key={mod.id}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 p-3 border border-dashed border-slate-200 dark:border-slate-700/50 opacity-60"
                >
                  <div className="w-[24px] shrink-0"></div>
                  <div className="flex items-center justify-center size-9 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-slate-400">{mod.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-500 dark:text-slate-400 truncate">{mod.title}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-600 truncate">{mod.desc}</p>
                  </div>
                  <button
                    onClick={() => handleAdd(mod.id)}
                    className="flex items-center justify-center size-7 rounded-full hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ModuleManage
