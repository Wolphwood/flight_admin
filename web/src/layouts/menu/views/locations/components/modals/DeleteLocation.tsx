import { Button, Group, Stack, Text } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '@/atoms/location'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const DeleteLocation = (props: {name: string}) => {
  const { name } = props
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <Text>{GetLocale("ui_delete")} '{name}' ?</Text>
      <Group grow>
        <Button
          uppercase
          variant='light'
          color='green.4'
          onClick={() => {
            closeAllModals()
            fetchNui('flight_admin:deleteLocation', name)
            setCustomLocationCheckbox(true)
          }}
        >
          {GetLocale("ui_confirm")}
        </Button>
        <Button
          uppercase
          variant='light'
          color='red.4'
          onClick={() => {
            closeAllModals()
          }}
        >
          {GetLocale("ui_cancel")}
        </Button>
      </Group>
    </Stack>
  )
}

export default DeleteLocation
