/** Estados do “farol” de salvamento / sincronização (contatos, KB, etc.) */
export type AutosaveStatus =
  | 'saved'
  | 'saving'
  | 'validation-error'
  | 'connection-error'
