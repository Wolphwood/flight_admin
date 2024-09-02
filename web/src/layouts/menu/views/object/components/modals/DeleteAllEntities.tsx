import { Button, Group, Stack, Text } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { fetchNui } from '../../../../../../utils/fetchNui'
import { useLocales } from '../../../../../../providers/LocaleProvider'

const DeleteAllEntities = () => {
  const { getLocale } = useLocales()

  return (
    <Stack>
      <Group grow>
        <Button
          uppercase
          variant='light'
          color='green.4'
          onClick={() => {
            closeAllModals()
            fetchNui('flight_admin:deleteAllEntities')
          }}
        >
          {getLocale("ui_confirm")}
        </Button>
        <Button
          uppercase
          variant='light'
          color='red.4'
          onClick={() => {
            closeAllModals()
          }}
        >
          {getLocale("ui_cancel")}
        </Button>
      </Group>
    </Stack>
  )
}

export default DeleteAllEntities
