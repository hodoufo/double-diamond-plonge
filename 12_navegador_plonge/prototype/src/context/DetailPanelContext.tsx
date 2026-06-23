import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { recordCompanyAccessFromNavigation } from '../lib/companyRecentAccess'
import { parseDetailKey, resolveEffectiveDetailKey } from '../lib/detailShare'
import {
  DetailPanelContext,
  detailPanelCloseBlockedRef,
} from './detailPanelContextBase'

function isKnowledgePath(pathname: string) {
  return pathname === '/kb' || pathname.startsWith('/kb/')
}

function isHomePath(pathname: string) {
  return pathname === '/' || pathname.startsWith('/home')
}

export function DetailPanelProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const detailKey = resolveEffectiveDetailKey(
    location.pathname,
    searchParams.get('detail'),
  )

  /** Empresas citadas ou focadas ao navegar nos outros módulos (lista «recentes» em Empresas). */
  useEffect(() => {
    if (isKnowledgePath(location.pathname) || isHomePath(location.pathname)) return
    recordCompanyAccessFromNavigation(location.pathname, detailKey)
  }, [detailKey, location.pathname])

  useEffect(() => {
    if (!isKnowledgePath(location.pathname) && !isHomePath(location.pathname))
      return
    setIsOpen(false)
    setSearchParams(
      (prev) => {
        if (!prev.get('detail')) return prev
        const next = new URLSearchParams(prev)
        next.delete('detail')
        return next
      },
      { replace: true },
    )
  }, [location.pathname, setSearchParams])

  useEffect(() => {
    if (isKnowledgePath(location.pathname) || isHomePath(location.pathname))
      return
    if (
      resolveEffectiveDetailKey(location.pathname, searchParams.get('detail'))
    ) {
      setIsOpen(true)
    }
  }, [location.pathname, searchParams])

  const openDetailPanel = useCallback(
    (opts?: { detail?: string }) => {
      if (isKnowledgePath(location.pathname) || isHomePath(location.pathname))
        return
      const detail = opts?.detail
      if (!detail) {
        setIsOpen(true)
        return
      }

      const parsed = parseDetailKey(detail)
      if (parsed?.kind === 'project' && parsed.id) {
        setIsOpen(true)
        if (location.pathname === `/projects/${parsed.id}`) {
          return
        }
        const next = new URLSearchParams(searchParams)
        next.delete('detail')
        const q = next.toString()
        navigate(
          {
            pathname: `/projects/${parsed.id}`,
            search: q ? `?${q}` : '',
            hash: location.hash,
          },
          { replace: false },
        )
        return
      }

      if (parsed?.kind === 'deal' && parsed.id) {
        setIsOpen(true)
        if (location.pathname === `/deals/${parsed.id}`) {
          return
        }
        const next = new URLSearchParams(searchParams)
        next.delete('detail')
        const q = next.toString()
        navigate(
          {
            pathname: `/deals/${parsed.id}`,
            search: q ? `?${q}` : '',
            hash: location.hash,
          },
          { replace: false },
        )
        return
      }

      if (parsed?.kind === 'conversation' && parsed.id) {
        setIsOpen(true)
        if (location.pathname === `/conversations/${parsed.id}`) {
          return
        }
        const next = new URLSearchParams(searchParams)
        next.delete('detail')
        const q = next.toString()
        navigate(
          {
            pathname: `/conversations/${parsed.id}`,
            search: q ? `?${q}` : '',
            hash: location.hash,
          },
          { replace: false },
        )
        return
      }

      if (searchParams.get('detail') === detail) {
        setIsOpen(true)
        return
      }
      setIsOpen(true)
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('detail', detail)
          return next
        },
        { replace: false },
      )
    },
    [
      location.hash,
      location.pathname,
      navigate,
      searchParams,
      setSearchParams,
    ],
  )

  const closeDetailPanel = useCallback(() => {
    if (detailPanelCloseBlockedRef.current) return
    setIsOpen(false)
    const next = new URLSearchParams(searchParams)
    next.delete('detail')
    const search = next.toString()
    const isProjectDetailPath = /^\/projects\/[^/]+$/u.test(location.pathname)
    const isDealDetailPath = /^\/deals\/[^/]+$/u.test(location.pathname)
    const isConversationDetailPath = /^\/conversations\/[^/]+$/u.test(
      location.pathname,
    )
    const isContactDetailPath =
      /^\/contact\/[^/]+$/u.test(location.pathname) ||
      location.pathname === '/contacts/new'
    if (isProjectDetailPath) {
      navigate(
        { pathname: '/projects', search: search ? `?${search}` : '' },
        { replace: true },
      )
    } else if (isDealDetailPath) {
      navigate(
        { pathname: '/deals', search: search ? `?${search}` : '' },
        { replace: true },
      )
    } else if (isConversationDetailPath) {
      navigate(
        {
          pathname: '/conversations',
          search: search ? `?${search}` : '',
        },
        { replace: true },
      )
    } else if (isContactDetailPath) {
      navigate(
        { pathname: '/contacts', search: search ? `?${search}` : '' },
        { replace: true },
      )
    } else {
      setSearchParams(next, { replace: true })
    }
  }, [location.pathname, navigate, searchParams, setSearchParams])

  const value = useMemo(
    () => ({
      isOpen,
      detailKey,
      openDetailPanel,
      closeDetailPanel,
    }),
    [isOpen, detailKey, openDetailPanel, closeDetailPanel],
  )

  return (
    <DetailPanelContext.Provider value={value}>
      {children}
    </DetailPanelContext.Provider>
  )
}
