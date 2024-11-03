import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const KickAll: React.FC = () => {
  const [kickMessage, setKickMessage] = useState('')

  return (
    <Stack>
      <TextInput label={GetForcedStringLocale("ui_confirm_kickAll_name")} description={GetLocale("ui_confirm_kickAll_description")} value={kickMessage} onChange={(e) => setKickMessage(e.target.value)} />
      <Button
        uppercase
        disabled={kickMessage === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:kickAll', kickMessage)
        }}
      >
        {GetLocale("ui_confirm")}
      </Button>
    </Stack>
  )
}

export default KickAll
