import { Stack, Button, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useRecoilState } from 'recoil'
import { ObjectNameAtom } from '@/atoms/object'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const AddEntity: React.FC = () => {
  const [entityName, setEntityName] = useRecoilState(ObjectNameAtom)

  return (
    <Stack>
      <TextInput value={entityName} onChange={(e) => setEntityName(e.target.value)} />
      <Button
        uppercase
        disabled={entityName === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:addEntity', entityName)
        }}
      >
        {GetLocale("ui_confirm")}
      </Button>
    </Stack>
  )
}

export default AddEntity
