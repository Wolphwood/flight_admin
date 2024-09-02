import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Space, Grid, Col, Center, Pagination } from '@mantine/core'
import { useEffect, useState} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getSearchWeaponInput, weaponsPageCountAtom, weaponsActivePageAtom, weaponsPageContentAtom, WeaponProp } from '../../../../atoms/weapon'
import { displayImageAtom, imagePathAtom } from '../../../../atoms/imgPreview'
import { setClipboard } from '../../../../utils/setClipboard'
import WeaponSearch from './components/weaponListSearch'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { useLocales } from '../../../../providers/LocaleProvider'

const Weapon: React.FC = () => {
  const { getLocale } = useLocales()
  const searchWeaponValue = getSearchWeaponInput()
  const [pageContent, setPageContent] = useRecoilState(weaponsPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(weaponsPageCountAtom)
  const [activePage, setPage] = useRecoilState(weaponsActivePageAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: WeaponProp[], maxPages: number}) => {
    if (data.type === 'weapons') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
    }
  })

  const [copiedWeaponName, setCopiedWeaponName] = useState(false)
  const [copiedWeaponAmmoName, setCopiedWeaponAmmoName] = useState(false)
  const [copiedWeaponHash, setCopiedWeaponHash] = useState(false)
  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

  // Copied name button
  useEffect(() => {
    setTimeout(() => {
      if (copiedWeaponName) setCopiedWeaponName(false)
    }, 1000)
  }, [copiedWeaponName, setCopiedWeaponName])
  // Copied hash button
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (copiedWeaponHash) setCopiedWeaponHash(false)
  //   }, 1000)
  // }, [copiedWeaponHash, setCopiedWeaponHash])

  const WeaponList = pageContent?.map((weaponList: any, index: number) => (
      <Accordion.Item key={index} value={index.toString()}>
        <Accordion.Control>
          <Text size='md' weight={500}>• {weaponList.label}</Text>
          <Text size='xs'>{getLocale("ui_weapon")}: {weaponList.name}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Grid>
            <Grid.Col span={3}>
              <Image
                onMouseEnter={() => {
                  displayImage(true)
                  imagePath(`nui://flight_admin/shared/img/weapon/${weaponList.name}.png`)
                }}
                onMouseLeave={() => {displayImage(false)}}
                height={50}
                fit='contain'
                alt={`${weaponList.name}`}
                src={`nui://flight_admin/shared/img/weapon/${weaponList.name}.png`}
                withPlaceholder={true}
                sx={{
                  '&:hover':{
                    borderRadius: '5px',
                    backgroundColor: 'rgba(35, 35, 35, 0.75)'
                  }
                }}
              />
            </Grid.Col>
            <Grid.Col span={9}>
              <Paper> 
                <Group grow>
                  <Button
                    variant='light'
                    color={'blue.4'}
                    size='xs'
                    onClick={() => fetchNui('flight_admin:giveWeapon', weaponList.name)}
                  >
                    {getLocale("ui_give_weapon")}
                  </Button>
                  <Button
                    variant='light'
                    color={copiedWeaponName ? 'teal' : 'blue.4'}
                    size='xs'
                    onClick={() => {
                      setClipboard(weaponList.name)
                      setCopiedWeaponName(true)
                    }}
                  >
                    {copiedWeaponName ? getLocale("ui_copied_name") : getLocale("ui_copy_name")}
                  </Button>
                  {/* <Button
                    variant='light'
                    color={copiedWeaponHash ? 'teal' : 'blue.4'}
                    size='xs'
                    onClick={() => {
                      setClipboard(weaponList.hash ? `${weaponList.hash}` : '')
                      setCopiedWeaponHash(true)
                    }}
                  >
                    {copiedWeaponHash ? getLocale("ui_copied_hash") : getLocale("ui_copy_hash")}
                  </Button> */}
                </Group>
                
                {
                  weaponList.ammoname
                  ? <>
                    <Space h='md'/>
                    <Group grow>
                      <Button
                        variant='light'
                        color={'blue.4'}
                        size='xs'
                        onClick={() => fetchNui('flight_admin:giveWeaponAmmo', weaponList.ammoname)}
                      >
                        {getLocale("ui_give_ammo")}
                      </Button>
                      <Button
                        variant='light'
                        color={copiedWeaponAmmoName ? 'teal' : 'blue.4'}
                        size='xs'
                        onClick={() => {
                          setClipboard(weaponList.ammoname)
                          setCopiedWeaponAmmoName(true)
                        }}
                      >
                        {copiedWeaponAmmoName ? getLocale("ui_copied_ammoname") : getLocale("ui_copy_ammoname")}
                      </Button>
                    </Group>
                  </>
                  : ''
                }
              </Paper>
            </Grid.Col>
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return(
    <Stack>
      <Text size={20}>{getLocale("ui_weapons")}</Text>
      <Group grow>
        <WeaponSearch/>
        <Button
          disabled={searchWeaponValue === ''}
          uppercase
          variant='light'
          color='blue.4'
          onClick={() => fetchNui('flight_admin:giveWeapon', searchWeaponValue)}
        >
          {getLocale("ui_give_weapon_by_name")}
        </Button>
      </Group>
      
      <ScrollArea style={{ height: 575 }} scrollbarSize={0}>
        <Stack>
          <Accordion variant='contained' radius='sm' value={currentAccordionItem} onChange={setAccordionItem}>
            {WeaponList ? WeaponList : 
              <Paper p='md'>
                <Text size='md' weight={600} color='red.4'>{getLocale("ui_no_weapon_found")}</Text>
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
            fetchNui('flight_admin:loadPages', { type: 'weapons', activePage: value, filter: searchWeaponValue })
            setPage(value)
            setAccordionItem('0')
          }}
          total={pageCount}
        />
      </Center>
    </Stack>
  )

}

export default Weapon