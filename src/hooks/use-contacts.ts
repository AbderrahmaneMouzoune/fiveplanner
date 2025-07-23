'use client'

import { useState } from 'react'

interface Contact {
  name?: string[]
  tel?: string[]
  email?: string[]
}

export function useContacts() {
  /* ------------------------------------------------------------
   * 1 ► Compute browser support once (lazy state initializer)
   *    This prevents calling setState during render which was
   *    causing the “Too many re-renders” error.
   * ---------------------------------------------------------- */
  const [isSupported] = useState<boolean>(() => {
    return (
      typeof navigator !== 'undefined' &&
      'contacts' in navigator &&
      'ContactsManager' in window
    )
  })

  const [isLoading, setIsLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  /* ------------------------------------------------------------
   * 2 ► Ask the user to pick contacts (only if supported)
   * ---------------------------------------------------------- */
  const requestContacts = async (): Promise<Contact[]> => {
    if (!isSupported) {
      throw new Error("L'API Contacts n'est pas supportée sur cet appareil.")
    }

    setIsLoading(true)
    try {
      const props = ['name', 'tel', 'email']
      const opts = { multiple: true }

      // @ts-ignore – Contacts API is still experimental
      const contactList: Contact[] = await navigator.contacts.select(
        props,
        opts,
      )

      const valid = contactList.filter((c) => c.name && c.name.length > 0)
      setContacts(valid)
      return valid
    } catch (err) {
      console.error("Erreur lors de l'accès aux contacts :", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearContacts = () => setContacts([])

  return {
    contacts,
    isLoading,
    isSupported,
    requestContacts,
    clearContacts,
  }
}
