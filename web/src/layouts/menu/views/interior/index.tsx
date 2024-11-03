import { Stack, SimpleGrid, Paper, Text, Space } from '@mantine/core'
import { getInteriorData } from '@/atoms/interior'
import InteriorElement from './components/InteriorElement'
import RoomsElement from './components/RoomsElement'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const Interior: React.FC = () => {
  const interior = getInteriorData()

  return (
    <SimpleGrid cols={1}>
      <Stack>
        {
          interior?.interiorId <= 0
          ?
          <Paper p='md'>
              <Text size={24} weight={600}>{GetLocale("ui_current_interior")}</Text>
              <Space h='sm' />
              <Text color='red.4'>{GetLocale("ui_not_in_interior")}</Text>
          </Paper>
          :
          <>
            <InteriorElement/>
            <RoomsElement/>
          </>
        }
      </Stack>
    </SimpleGrid>
  )
}

export default Interior
