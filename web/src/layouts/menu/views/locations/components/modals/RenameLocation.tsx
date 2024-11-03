import { Button, Stack, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useState } from 'react'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const RenameLocation = (props: {defaultName: string}) => {
  const { defaultName } = props
  const [newName, setNewName] = useState(defaultName)

  return (
    <Stack>
      <TextInput label={GetForcedStringLocale("ui_location_name")} value={newName} onChange={(e) => setNewName(e.target.value)} />
      <Button
        uppercase
        disabled={newName === '' || newName === defaultName}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          if (newName !== '') {
            fetchNui('flight_admin:changeLocationName', {oldName: defaultName, newName: newName})
          }
        }}
      >
        {GetLocale("ui_confirm")}
      </Button>
    </Stack>
  )
}

export default RenameLocation
