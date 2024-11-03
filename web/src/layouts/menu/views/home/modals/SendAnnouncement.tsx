import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const SendAnnouncement: React.FC = () => {
  const [message, setMessage] = useState('')

  return (
    <Stack>
      <TextInput label={GetForcedStringLocale("ui_announcement_name")} description={GetLocale("ui_announcement_description")} value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button
        uppercase
        disabled={message === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:Announce', message)
        }}
      >
        {GetLocale("ui_confirm")}
      </Button>
    </Stack>
  )
}

export default SendAnnouncement
