import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CompaniesPage } from './pages/CompaniesPage'
import { ContactsPage } from './pages/ContactsPage'
import { ConversationsPage } from './pages/ConversationsPage'
import { DealsPage } from './pages/DealsPage'
import { HomePage } from './pages/HomePage'
import { KnowledgePage } from './pages/KnowledgePage'
import { ProjectsPage } from './pages/ProjectsPage'
import {
  knowledgeDocuments,
  legacyKnowledgeFileToKbId,
} from './data/mock'

function RedirectPreserveSearch({ to }: { to: string }) {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: to, search, hash }} replace />
}

/** Alias PT → URL canônica `/conversations/:id`. */
function RedirectConversasConversationId() {
  const { conversationId } = useParams()
  const { search, hash } = useLocation()
  return (
    <Navigate
      to={{ pathname: `/conversations/${conversationId}`, search, hash }}
      replace
    />
  )
}

/** Alias PT → URL canônica `/projects/:id`. */
function RedirectProjetosProjectId() {
  const { projectId } = useParams()
  const { search, hash } = useLocation()
  return (
    <Navigate
      to={{ pathname: `/projects/${projectId}`, search, hash }}
      replace
    />
  )
}

function LegacyContatoDetailRedirect() {
  const { contactId } = useParams()
  const { search, hash } = useLocation()
  return (
    <Navigate
      to={{ pathname: `/contact/${contactId}`, search, hash }}
      replace
    />
  )
}

/** `/knowledge`, `/knowledge?file=…`, `?doc=new` → `/kb/…` */
function KnowledgeLegacyRedirect() {
  const { search, hash } = useLocation()
  const sp = new URLSearchParams(search)
  if (sp.get('doc') === 'new') {
    return <Navigate to={{ pathname: '/kb/new', hash }} replace />
  }
  const file = sp.get('file')
  if (file) {
    const nextId =
      legacyKnowledgeFileToKbId[file] ??
      (Object.hasOwn(knowledgeDocuments, file) ? file : null)
    if (nextId) {
      return <Navigate to={{ pathname: `/kb/${nextId}`, hash }} replace />
    }
  }
  return <Navigate to={{ pathname: '/kb', hash }} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="contact/:contactId" element={<ContactsPage />} />
        <Route path="contacts/new" element={<ContactsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="deals/:dealId" element={<DealsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="projects/:projectId" element={<ProjectsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="kb/new" element={<KnowledgePage />} />
        <Route path="kb/:docId" element={<KnowledgePage />} />
        <Route path="kb" element={<KnowledgePage />} />
        <Route
          path="knowledge/new"
          element={<Navigate to="/kb/new" replace />}
        />
        <Route path="knowledge" element={<KnowledgeLegacyRedirect />} />
        <Route path="conversations/:conversationId" element={<ConversationsPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="contatos" element={<RedirectPreserveSearch to="/contacts" />} />
        <Route path="contatos/:contactId" element={<LegacyContatoDetailRedirect />} />
        <Route path="negocios" element={<RedirectPreserveSearch to="/deals" />} />
        <Route path="projetos/:projectId" element={<RedirectProjetosProjectId />} />
        <Route path="projetos" element={<RedirectPreserveSearch to="/projects" />} />
        <Route path="conhecimento/new" element={<RedirectPreserveSearch to="/kb/new" />} />
        <Route path="conhecimento" element={<RedirectPreserveSearch to="/kb" />} />
        <Route
          path="conversas/:conversationId"
          element={<RedirectConversasConversationId />}
        />
        <Route path="conversas" element={<RedirectPreserveSearch to="/conversations" />} />
        <Route path="empresas" element={<RedirectPreserveSearch to="/companies" />} />
        <Route path="home" element={<RedirectPreserveSearch to="/" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
