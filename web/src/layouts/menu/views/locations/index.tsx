import { Accordion, Badge, Button, Center, Checkbox, Group, Pagination, Paper, ScrollArea, Space, Stack, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import CreateLocation from './components/modals/CreateLocation'
import { Location, getSearchLocationInput, locationsActivePageAtom, locationCustomFilterAtom, locationShopFilterAtom, locationsPageCountAtom, locationVanillaFilterAtom, locationsPageContentAtom } from '../../../../atoms/location'
import LocationSearch from './components/LocationSearch'
import { setClipboard } from '../../../../utils/setClipboard'
import { useEffect, useState } from 'react'
import RenameLocation from './components/modals/RenameLocation'
import { useRecoilState } from 'recoil'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import DeleteLocation from './components/modals/DeleteLocation'
import { useLocales } from '../../../../providers/LocaleProvider'

const Locations: React.FC = () => {
  const { getLocale } = useLocales()
  const searchLocationValue = getSearchLocationInput()
  const [pageContent, setPageContent] = useRecoilState(locationsPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(locationsPageCountAtom)
  const [activePage, setPage] = useRecoilState(locationsActivePageAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: Location[], maxPages: number}) => {
    if (data.type === 'locations') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  // Checkboxes
  const [checkedVanilla, setCheckedVanilla] = useRecoilState(locationVanillaFilterAtom)
  const [checkedCustom, setCheckedCustom] = useRecoilState(locationCustomFilterAtom)
  const [checkedShop, setcheckedShop] = useRecoilState(locationShopFilterAtom)

  // Accordion
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  // Copied button
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)
  }, [copied, setCopied])

  const Locationlist = pageContent?.map((location: any, index: number) => (
      <Accordion.Item key={index} value={index.toString()}>
        <Accordion.Control>
          <Stack spacing={0}>
            <Group position='apart'>
              <Text color='blue.4' size='md' weight={500}>{location.name}</Text>
              <Badge color={location.custom ? 'green.4' : location.shop ? 'indigo' : 'blue.4'}>{location.custom ? getLocale("ui_custom") : location.shop ? getLocale("ui_shop") : getLocale("ui_vanilla")}</Badge>
            </Group>
            <Text size='xs'>{getLocale("ui_coords")}: {location.x.toFixed(3)}, {location.y.toFixed(3)}, {location.z.toFixed(3)}</Text>
          </Stack>
        </Accordion.Control>
        <Accordion.Panel>
          <Paper>
            <Group grow spacing='xs'>
              <Button
                variant='light'
                color={copied ? 'teal' : 'blue.4'}
                size='xs'
                onClick={() => {
                  fetchNui('flight_admin:placeMarker', { x: location.x, y: location.y, z: location.z })
                }}
              >
                {getLocale("ui_place_marker")}
              </Button>
              <Button
                variant='light'
                color='blue.4'
                size='xs'
                onClick={() =>
                  fetchNui('flight_admin:teleport', { name: location.name, x: location.x, y: location.y, z: location.z, heading: location.heading })
                }
              >
                {getLocale("ui_teleport")}
              </Button>
              <Button
                variant='light'
                color={copied ? 'teal' : 'blue.4'}
                size='xs'
                onClick={() => {
                  setClipboard(location.x + ', ' + location.y + ', ' + location.z)
                  setCopied(true)
                }}
              >
                {copied ? getLocale("ui_copied_coords") : getLocale("ui_copy_coords")}
              </Button>
            </Group>
            
            {
              location.custom ?
                <>
                  <Space h="md" />
                  <Group grow spacing='xs'>
                    <Button
                      variant='light'
                      color='blue.4'
                      size='xs'
                      onClick={() => {
                        openModal({
                          title: getLocale("ui_rename"),
                          children: <RenameLocation defaultName={location.name} />,
                          size: 'xs',
                        })
                      }}
                    >
                      {getLocale("ui_rename")}
                    </Button>
                    <Button
                      variant='light'
                      color='blue.4'
                      size='xs'
                      onClick={() => {
                        openModal({
                          title: getLocale("ui_delete"),
                          children: <DeleteLocation name={location.name} />,
                          size: 'xs',
                        })
                        setAccordionItem(null)
                      }}
                    >
                      {getLocale("ui_delete")}
                    </Button>
                  </Group>
                </>
              : ''
            }
          </Paper>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return (
    <>
      <Stack>
        <Text size={20}>{getLocale("ui_locations")}</Text>
        <Group grow>            
          <Checkbox
            label={getLocale("ui_show_custom_locations")}
            size='sm'
            color='blue.4'
            // disabled={!checkedVanilla}
            checked={checkedCustom}
            onChange={(e) => {
              fetchNui('flight_admin:loadPages', { type: 'locations', activePage: 1, filter: searchLocationValue, checkboxes: {vanilla: checkedVanilla, custom: e.currentTarget.checked, shop: checkedShop} })
              setPage(1)
              setCheckedCustom(e.currentTarget.checked)
            }}
          />
          <Checkbox
            label={getLocale("ui_show_vanilla_locations")}
            size='sm'
            color='blue.4'
            // disabled={!checkedCustom}
            checked={checkedVanilla}
            onChange={(e) => {
              fetchNui('flight_admin:loadPages', { type: 'locations', activePage: 1, filter: searchLocationValue, checkboxes: {vanilla: e.currentTarget.checked, custom: checkedCustom, shop: checkedShop} })
              setPage(1)
              setCheckedVanilla(e.currentTarget.checked)
            }}
          />
          <Checkbox
            label={getLocale("ui_show_shop_locations")}
            size='sm'
            color='blue.4'
            // disabled={!checkedShop}
            checked={checkedShop}
            onChange={(e) => {
              fetchNui('flight_admin:loadPages', { type: 'locations', activePage: 1, filter: searchLocationValue, checkboxes: {vanilla: checkedVanilla, custom: checkedCustom, shop: e.currentTarget.checked} })
              setPage(1)
              setcheckedShop(e.currentTarget.checked)
            }}
          />
        </Group>
        
        <Button
          uppercase
          variant='light'
          color='blue.4'
          onClick={() =>
            openModal({
              title: getLocale("ui_create_custom_location"),
              size: 'xs',
              children: <CreateLocation />,
            })
          }
        >{getLocale("ui_create_custom_location")}</Button>
        
        <LocationSearch />

        <ScrollArea style={{ height: 480 }} scrollbarSize={0}>
          <Stack>
            <Accordion chevronPosition='left' variant='contained' radius='sm' value={currentAccordionItem} onChange={setAccordionItem}>
              {Locationlist ? Locationlist :
                <Paper p='md'>
                  <Text size='md' weight={600} color='red.4'>{getLocale("ui_no_location_found")}</Text>
                </Paper>
              }
            </Accordion>
          </Stack>
        </ScrollArea>
        <Center>
          <Pagination
            color='blue.4'
            size='sm'
            page={activePage}
            onChange={(value) => {
              fetchNui('flight_admin:loadPages', { type: 'locations', activePage: value, filter: searchLocationValue, checkboxes: {vanilla: checkedVanilla, custom: checkedCustom, shop: checkedShop} })
              setPage(value)
              setAccordionItem('0')
            }}
            total={pageCount}
          />
        </Center>
      </Stack>
    </>
  )
}

export default Locations
