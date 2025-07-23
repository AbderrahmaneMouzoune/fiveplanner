"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useContacts } from "@/hooks/use-contacts"
import { IconAddressBook, IconSearch, IconUser, IconMail, IconPhone } from "@tabler/icons-react"

interface Contact {
  name?: string[]
  tel?: string[]
  email?: string[]
}

interface ContactSelectorProps {
  onSelectContact: (contact: { name: string; email?: string; phone?: string }) => void
  onCancel: () => void
}

export function ContactSelector({ onSelectContact, onCancel }: ContactSelectorProps) {
  const { contacts, isLoading, isSupported, requestContacts } = useContacts()
  const [searchTerm, setSearchTerm] = useState("")
  const [showContacts, setShowContacts] = useState(false)

  const handleRequestContacts = async () => {
    try {
      await requestContacts()
      setShowContacts(true)
    } catch (error) {
      alert("Erreur lors de l'accès aux contacts. Assurez-vous d'avoir donné les permissions nécessaires.")
    }
  }

  const handleSelectContact = (contact: Contact) => {
    const name = contact.name?.[0] || "Contact sans nom"
    const email = contact.email?.[0] || undefined
    const phone = contact.tel?.[0] || undefined

    onSelectContact({ name, email, phone })
  }

  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name?.[0]?.toLowerCase() || ""
    const email = contact.email?.[0]?.toLowerCase() || ""
    const phone = contact.tel?.[0] || ""
    const search = searchTerm.toLowerCase()

    return name.includes(search) || email.includes(search) || phone.includes(search)
  })

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <IconAddressBook className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            L'accès aux contacts n'est pas supporté sur cet appareil ou navigateur.
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
          <IconAddressBook className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-foreground mb-4">Importez facilement vos contacts pour ajouter des joueurs</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRequestContacts} disabled={isLoading}>
              <IconAddressBook className="w-4 h-4 mr-2" />
              {isLoading ? "Chargement..." : "Accéder aux contacts"}
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
        <h3 className="font-medium">Sélectionner un contact ({contacts.length})</h3>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Retour
        </Button>
      </div>

      {contacts.length > 0 && (
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3" onClick={() => handleSelectContact(contact)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <IconUser className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{contact.name?.[0] || "Contact sans nom"}</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {contact.tel?.[0] && (
                          <div className="flex items-center gap-1">
                            <IconPhone className="w-3 h-3" />
                            {contact.tel[0]}
                          </div>
                        )}
                        {contact.email?.[0] && (
                          <div className="flex items-center gap-1">
                            <IconMail className="w-3 h-3" />
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
          <div className="text-center text-muted-foreground py-8">
            {searchTerm ? "Aucun contact trouvé pour cette recherche" : "Aucun contact disponible"}
          </div>
        )}
      </div>
    </div>
  )
}
