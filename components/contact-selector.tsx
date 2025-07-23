'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useContacts } from '@/hooks/use-contacts'
import {
  IconAddressBook,
  IconSearch,
  IconUser,
  IconMail,
  IconPhone,
} from '@tabler/icons-react'

interface Contact {
  name?: string[]
  tel?: string[]
  email?: string[]
}

interface ContactSelectorProps {
  onSelectContact: (contact: {
    name: string
    email?: string
    phone?: string
  }) => void
  onCancel: () => void
}

export function ContactSelector({
  onSelectContact,
  onCancel,
}: ContactSelectorProps) {
  const { contacts, isLoading, isSupported, requestContacts } = useContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [showContacts, setShowContacts] = useState(false)

  const handleRequestContacts = async () => {
    try {
      await requestContacts()
      setShowContacts(true)
    } catch (error) {
      alert(
        "Erreur lors de l'accès aux contacts. Assurez-vous d'avoir donné les permissions nécessaires.",
      )
    }
  }

  const handleSelectContact = (contact: Contact) => {
    const name = contact.name?.[0] || 'Contact sans nom'
    const email = contact.email?.[0] || undefined
    const phone = contact.tel?.[0] || undefined

    onSelectContact({ name, email, phone })
  }

  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name?.[0]?.toLowerCase() || ''
    const email = contact.email?.[0]?.toLowerCase() || ''
    const phone = contact.tel?.[0] || ''
    const search = searchTerm.toLowerCase()

    return (
      name.includes(search) || email.includes(search) || phone.includes(search)
    )
  })

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <IconAddressBook className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">
            L'accès aux contacts n'est pas supporté sur cet appareil ou
            navigateur.
          </p>
          <Button onClick={onCancel} variant="outline">
            Retour
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!showContacts) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <IconAddressBook className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-foreground">
            Importez facilement vos contacts pour ajouter des joueurs
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={handleRequestContacts} disabled={isLoading}>
              <IconAddressBook className="mr-2 h-4 w-4" />
              {isLoading ? 'Chargement...' : 'Accéder aux contacts'}
            </Button>
            <Button onClick={onCancel} variant="outline">
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          Sélectionner un contact ({contacts.length})
        </h3>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Retour
        </Button>
      </div>

      {contacts.length > 0 && (
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="max-h-60 space-y-2 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-colors hover:bg-accent"
            >
              <CardContent
                className="p-3"
                onClick={() => handleSelectContact(contact)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <IconUser className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {contact.name?.[0] || 'Contact sans nom'}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {contact.tel?.[0] && (
                          <div className="flex items-center gap-1">
                            <IconPhone className="h-3 w-3" />
                            {contact.tel[0]}
                          </div>
                        )}
                        {contact.email?.[0] && (
                          <div className="flex items-center gap-1">
                            <IconMail className="h-3 w-3" />
                            {contact.email[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Sélectionner
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {searchTerm
              ? 'Aucun contact trouvé pour cette recherche'
              : 'Aucun contact disponible'}
          </div>
        )}
      </div>
    </div>
  )
}
