import { Button, Group, Stack, Text } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '../../../../../../atoms/location'
import { fetchNui } from '../../../../../../utils/fetchNui'
import { useLocales } from '../../../../../../providers/LocaleProvider'

const DeleteLocation = (props: {name: string}) => {
  const { getLocale } = useLocales()
  const { name } = props
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <Text>{getLocale("ui_delete")} '{name}' ?</Text>
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

export default DeleteLocation
