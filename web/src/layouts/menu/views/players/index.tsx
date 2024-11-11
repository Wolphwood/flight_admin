import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Center, Pagination, Space, Badge, SimpleGrid, Select } from '@mantine/core'
import { useEffect, useState} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getSearchPlayerInput, playersPageCountAtom, playersActivePageAtom, playersPageContentAtom, PlayerInfo, jobsContentAtom, JobInfo } from '@/atoms/player'
import { displayImageAtom, imagePathAtom } from '@/atoms/imgPreview'
import { setClipboard } from '@/utils/setClipboard'
import PlayerSearch from './components/playerListSearch'
import { fetchNui } from '@/utils/fetchNui'
import { useNuiEvent } from '@/hooks/useNuiEvent'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

import { FaDiscord, FaSteam, FaDiceFive, FaXbox, FaMapMarkedAlt } from 'react-icons/fa'
import { ImConnection} from 'react-icons/im'
import { TbLivePhoto, TbLicense } from 'react-icons/tb'
import { GiCharacter, GiThorHammer, GiGingerbreadMan } from 'react-icons/gi'
import { MdHealing } from "react-icons/md";

import { openModal } from '@mantine/modals'
import SendWarn from './modals/SendWarn'
import SetCoords from './modals/SetCoords'
import TrollMenu from './modals/TrollMenu'
import YeetPlayer from './modals/YeetPlayer'

import PlayerAccordionClasses from './styles.module.css'

const Players: React.FC = () => {
  const searchPlayerValue = getSearchPlayerInput()
  const [pageContent, setPageContent] = useRecoilState(playersPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(playersPageCountAtom)
  const [activePage, setPage] = useRecoilState(playersActivePageAtom)
  const [pressSpectate, setPressSpectate] = useState(false)

  const [Jobs, setJobs] = useRecoilState(jobsContentAtom)

  useNuiEvent('setPageContent', (data: {type: string, content: PlayerInfo[], maxPages: number, spectate: boolean}) => {
    if (data.type === 'players') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
      setPressSpectate(data.spectate)
    }
  })
  useNuiEvent('setPageContent', (data: {type: string, content: JobInfo[]}) => {
    if (data.type === 'jobs') {
      setJobs(data.content)
    }
  })

  const [copiedLicense,    setCopiedLicense   ] = useState(false);
  const [copiedLicense2,   setCopiedLicense2  ] = useState(false);
  const [copiedIdentifier, setCopiedIdentifier] = useState(false);
  const [copiedDiscord,    setCopiedDiscord   ] = useState(false);
  const [copiedSteam,      setCopiedSteam     ] = useState(false);
  const [copiedFivem,      setCopiedFivem     ] = useState(false);
  const [copiedIP,         setCopiedIP        ] = useState(false);
  const [copiedLive,       setCopiedLive      ] = useState(false);
  const [copiedXbl,        setCopiedXbl       ] = useState(false);

  const [pressHeal,        setPressHeal       ] = useState(false);
  const [pressRevive,      setPressRevive     ] = useState(false);
  const [pressNoClip,      setPressNoClip     ] = useState(false);
  const [pressBring,       setPressBring      ] = useState(false);
  const [pressGoTo,        setPressGoTo       ] = useState(false);
  const [pressTpIntoVeh,   setPressTpIntoVeh  ] = useState(false);
  const [pressTpIntoMyVeh, setPressTpIntoMyVeh] = useState(false);
  const [pressTpMarker,    setPressTpMarker   ] = useState(false);
  const [pressFreeze,      setPressFreeze     ] = useState(false);
  const [pressKill,        setPressKill       ] = useState(false);

  const [currentAccordionItem, setAccordionItem] = useState<string|null>()

  useEffect(() => { setTimeout(() => { if (copiedLicense)    setCopiedLicense(false)    }, 1000)}, [copiedLicense,    setCopiedLicense   ]);
  useEffect(() => { setTimeout(() => { if (copiedLicense2)   setCopiedLicense2(false)   }, 1000)}, [copiedLicense2,   setCopiedLicense2  ]);
  useEffect(() => { setTimeout(() => { if (copiedIdentifier) setCopiedIdentifier(false) }, 1000)}, [copiedIdentifier, setCopiedIdentifier]);
  useEffect(() => { setTimeout(() => { if (copiedDiscord)    setCopiedDiscord(false)    }, 1000)}, [copiedDiscord,    setCopiedDiscord   ]);
  useEffect(() => { setTimeout(() => { if (copiedSteam)      setCopiedSteam(false)      }, 1000)}, [copiedSteam,      setCopiedSteam     ]);
  useEffect(() => { setTimeout(() => { if (copiedFivem)      setCopiedFivem(false)      }, 1000)}, [copiedFivem,      setCopiedFivem     ]);
  useEffect(() => { setTimeout(() => { if (copiedIP)         setCopiedIP(false)         }, 1000)}, [copiedIP,         setCopiedIP        ]);
  useEffect(() => { setTimeout(() => { if (copiedLive)       setCopiedLive(false)       }, 1000)}, [copiedLive,       setCopiedLive      ]);
  useEffect(() => { setTimeout(() => { if (copiedXbl)        setCopiedXbl(false)        }, 1000)}, [copiedXbl,        setCopiedXbl       ]);

  useEffect(() => { setTimeout(() => { if (pressHeal)      setPressHeal(false)     }, 1000)}, [pressHeal,      setPressHeal     ]);
  useEffect(() => { setTimeout(() => { if (pressRevive)    setPressRevive(false)   }, 1000)}, [pressRevive,    setPressRevive   ]);
  useEffect(() => { setTimeout(() => { if (pressTpIntoVeh) setPressTpIntoVeh(false)}, 1000)}, [pressTpIntoVeh, setPressTpIntoVeh]);
  useEffect(() => { setTimeout(() => { if (pressTpIntoMyVeh) setPressTpIntoMyVeh(false)}, 1000)}, [pressTpIntoMyVeh, setPressTpIntoMyVeh]);
  useEffect(() => { setTimeout(() => { if (pressTpMarker)  setPressTpMarker(false) }, 1000)}, [pressTpMarker,  setPressTpMarker ]);
  useEffect(() => { setTimeout(() => { if (pressKill)      setPressKill(false)     }, 1000)}, [pressKill,      setPressKill     ]);

  const formatedJobs = Jobs.flatMap(job => job.grades.map(grade => ({
    label: job.label +' • '+ grade.label,
    value: job.name +':'+ grade.grade
  })))

  const PlayerList = pageContent?.map((player: any, index: number) => {
    let player_job_id = player.job.name +':'+ player.job.grade;

    return (
      <Accordion.Item key={index} value={index.toString()}>
        <Accordion.Control>
          <Group position='apart'>
            <Text size='md' weight={500}>• {player.id} | {player.name}</Text>
            <Badge color={["blue", 'orange', 'green'][player.rank] ?? 'white'}>{GetLocale(`rank.${player.label}.name`, null, { default: player.label })}</Badge>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Accordion variant="separated" radius='sm' classNames={PlayerAccordionClasses}>
            <Accordion.Item key="badges" value="badges">
              <Accordion.Control><Group><TbLicense/>{ GetLocale('ui.player.category.licenses') }</Group></Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={2} spacing="sm">
                  <Badge color={ copiedLicense ? 'teal' : 'blue.3'} onClick={() => { setClipboard(player.license); setCopiedLicense(true); }} style={{ gridColumn: 'span 2' }} >
                    <Group><TbLicense fontSize={15}/>{copiedLicense ? GetLocale('component.button.copied') : player.license}</Group>
                  </Badge>
                  {
                    player.license.split(':')[1] !== player.license2.split(':')[1]
                    ? (
                      <Badge color={ copiedLicense2 ? 'teal' : 'blue.3'} onClick={() => { setClipboard(player.license2); setCopiedLicense2(true); }} style={{ gridColumn: 'span 2' }} >
                        <Group><TbLicense fontSize={15}/>{copiedLicense2 ? GetLocale('component.button.copied') : player.license2}</Group>
                      </Badge>
                      )
                    : ''
                  }
                  {
                    player.identifier !== 'none'
                    ? (
                      <Badge color={ copiedIdentifier ? 'teal' : 'indigo'} onClick={() => { setClipboard(player.identifier); setCopiedIdentifier(true); }} style={{ gridColumn: 'span 2' }} >
                        <Group><GiCharacter fontSize={15}/>{copiedIdentifier ? GetLocale('component.button.copied') : player.identifier}</Group>
                      </Badge>
                      )
                    : ''
                  }
                  <Badge color={copiedDiscord ? 'teal' : 'violet.5'} onClick={() => { setClipboard(player.discord); setCopiedDiscord(true); }}>
                    <Group grow spacing='xs'><FaDiscord fontSize={15}/>{!copiedDiscord ? player.discord : "Copied"}</Group>
                  </Badge>
                  <Badge color={copiedSteam ? 'teal' : 'gray.5'} onClick={() => { setClipboard(player.steam); setCopiedSteam(true); }}>
                    <Group grow spacing='xs'><FaSteam fontSize={15}/>{!copiedSteam ? player.steam : "Copied"}</Group>
                  </Badge>
                  <Badge color={copiedFivem ? 'teal' : 'orange.4'} onClick={() => { setClipboard(player.fivem); setCopiedFivem(true); }}>
                    <Group grow spacing='xs'><FaDiceFive fontSize={13}/>{!copiedFivem ? player.fivem : "Copied"}</Group>
                  </Badge>
                  <Badge color={copiedIP ? 'teal' : 'teal.5'} onClick={() => { setClipboard(player.ip); setCopiedIP(true); }}>
                    <Group grow spacing='xs'><ImConnection fontSize={15}/>{!copiedIP ? "Click To Copy IP" : "Copied"}</Group>
                  </Badge>
                  <Badge color={copiedLive ? 'teal' : 'cyan.4'} onClick={() => { setClipboard(player.live); setCopiedLive(true); }}>
                    <Group grow spacing='xs'><TbLivePhoto fontSize={13}/>{!copiedLive ? player.live : "Copied"}</Group>
                  </Badge>
                  <Badge color={copiedXbl ? 'teal' : 'green.5'} onClick={() => { setClipboard(player.xbl); setCopiedXbl(true); }}>
                    <Group grow spacing='xs'><FaXbox fontSize={13}/>{!copiedXbl ? player.xbl : "Copied"}</Group>
                  </Badge>
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="healing" value="healing">
              <Accordion.Control><Group><MdHealing/>{ GetLocale('ui.player.category.heal') }</Group></Accordion.Control>
              <Accordion.Panel>
                <Group grow spacing='xs'>
                  <Button variant='light' color={pressRevive ? 'teal' : 'blue.4'} size='xs' onClick={() => { setPressRevive(true); fetchNui('flight_admin:revive', player.id); }}>
                    {GetLocale("ui.player.button.revive")}
                  </Button>

                  <Button variant='light' color={pressHeal ? 'teal' : 'blue.4'} size='xs' onClick={() => { setPressHeal(true); fetchNui('flight_admin:setMaxHealth', player.id); }}>
                    {GetLocale("ui.player.button.heal")}
                  </Button>

                  <Button variant='light' color={pressKill ? 'teal' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:killPlayer', player.id); setPressKill(true); }}>
                    {GetLocale("ui.player.button.kill")}
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="tp" value="tp">
            <Accordion.Control><Group><FaMapMarkedAlt/>{ GetLocale('ui.player.category.tp') }</Group></Accordion.Control>
              <Accordion.Panel>                
                <Group grow spacing='xs'>
                <Button variant='light' color={pressTpIntoVeh ? 'teal.4' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:tpIntoVehPlayer', player.id); setPressTpIntoVeh(true); }}>
                    {GetLocale("ui.player.button.tp_into_veh")}
                  </Button>

                  <Button variant='light' color={pressTpIntoMyVeh ? 'teal.4' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:tpPlayerIntoMy', player.id); setPressTpIntoMyVeh(true); }}>
                    {GetLocale("ui.player.button.tp_into_my_veh")}
                  </Button>
                </Group>

                <Space h='xs'/>
                
                <Group grow spacing='xs'>
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { openModal({ title: GetLocale("ui.player.button.tp_coords"), size: 'sm', children: <SetCoords id = {player.id}/> }); }}>
                    {GetLocale("ui.player.button.tp_coords")}
                  </Button>
                </Group>
                
                <Space h='xs'/>
                
                <Group grow spacing='xs'>
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:placeMarkerAtPlayer', player.id); }}>
                    {GetLocale("ui.player.button.locate")}
                  </Button>

                  {
                    player.tracking
                      ? (<Button variant='light' color="red.4" size='xs' onClick={() => { fetchNui('flight_admin:untrackPlayer', player.id); }}>
                          {GetLocale("ui.player.button.untrack")}
                        </Button>)
                      : (<Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:trackPlayer', player.id); }}>
                          {GetLocale("ui.player.button.track")}
                        </Button>)
                  }
                  
                </Group>
                
                <Space h='xs'/>
                
                <Group grow spacing='xs'>
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:tpPlayerToMarker', player.id); }}>
                    {GetLocale("ui.player.button.tpm")}
                  </Button>

                  <Button variant='light' color={pressTpMarker ? 'teal' : 'blue.4'} size='xs' onClick={() => { setPressTpMarker(true); fetchNui('flight_admin:tpToPlayerMarker', player.id); }}>
                    {GetLocale("ui.player.button.tp_to_player_marker")}
                  </Button>
                </Group>

                <Space h="xs"/>

                <Group grow spacing='xs'> 
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:bringPlayer', player.id); }}>
                      {GetLocale("ui.player.button.bring")}
                  </Button>
                  <Button disabled={!player.bringPlayer} variant='light' color="red.4" size='xs' onClick={() => { fetchNui('flight_admin:bringBackPlayer', player.id); }}>
                    {GetLocale("ui.player.button.bring_back")}
                  </Button>
                </Group>

                <Space h="xs"/>

                <Group grow spacing='xs'>
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:gotoPlayer', player.id); }}>
                    {GetLocale("ui.player.button.goto")}
                  </Button>
                  <Button disabled={!player.gotoPlayer} variant='light' color="red.4" size='xs' onClick={() => { fetchNui('flight_admin:goBackPlayer', player.id); }}>
                    {GetLocale("ui.player.button.goto_back")}
                  </Button> 
                </Group>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item key="moderator" value="moderator">
            <Accordion.Control><Group><GiThorHammer/>{ GetLocale('ui.player.category.moderator') }</Group></Accordion.Control>
              <Accordion.Panel>
                <Group grow spacing='xs'>
                  <Button variant='light' color={pressSpectate ? 'red.4' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:spectatePlayer', player.id); }}>
                    {pressSpectate ? "Exit Spectate" : GetLocale("ui.player.button.spectate")}
                  </Button>

                  <Button variant='light' color={player.freeze ? 'red.4' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:freezePlayer', player.id); }}>
                    { GetLocale(`ui.player.button.${player.freeze ? 'unfreeze' : 'unfreeze'}`) }
                  </Button>
                  
                  <Button variant='light' color={player.noclip ? 'red.4' : 'blue.4'} size='xs' onClick={() => { fetchNui('flight_admin:setNoClip', player.id); }}>
                    {GetLocale("ui.player.button.noclip")}
                  </Button>
                </Group>

                <Space h="xs"/>                

                <Group grow spacing='xs'>
                  <Button variant='light' color={'yellow.4'} size='xs' onClick={() => { openModal({ title: GetLocale("ui.warn"), size: 'lg', children: <SendWarn id = {player.id}/> }); }}>
                    {GetLocale("ui.player.button.warn")}
                  </Button>
                  
                  <Button variant='light' color={'orange.4'} size='xs' onClick={() => openModal({ title: GetLocale("ui.kick"), size: 'sm', children: <YeetPlayer type = "kick" id = {player.id}/> })}>
                    {GetLocale("ui.player.button.kick")}
                  </Button>
                  
                  <Button variant='light' color="red.4" size='xs' onClick={() => openModal({ title: GetLocale("ui.ban"), size: 'sm', children: <YeetPlayer id = {player.id} type = "ban"/> })}>
                    {GetLocale("ui.player.button.ban")}
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item key="other" value="other">
            <Accordion.Control><Group><GiGingerbreadMan/>{ GetLocale('ui.player.category.other') }</Group></Accordion.Control>
              <Accordion.Panel>
              <Group grow spacing='xs'>
                  <Select
                    data = {formatedJobs}
                    value = {player_job_id}
                    placeholder = "Métier"
                    onChange={ (value) => {
                      let [job, grade] = value?.split(':') ?? [];
                      fetchNui('flight_admin:playerSetJob', { player: player.id, job, grade });
                    }}
                  />
                </Group>
                
                <Space h="xs"/>

                <Group grow spacing='xs'>
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { fetchNui('flight_admin:openPlayerInventory', player.id); }}>
                    {GetLocale("ui.player.button.open_inventory")}
                  </Button>
                  
                  <Button variant='light' color="blue.4" size='xs' onClick={() => { openModal({ title: GetLocale("ui.trolls"), size: 'sm', children: <TrollMenu id={player.id}/>}); }}>
                    {GetLocale("ui.player.button.troll")}
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Accordion.Panel>
      </Accordion.Item>
    )
  })

  return(
    <Stack>
      <Text size={20}>{GetLocale("ui.players")}</Text>
      <Group grow>
        <PlayerSearch/>
      </Group>
      <ScrollArea style={{ height: 575 }} scrollbarSize={0}>
        <Stack>
          <Accordion variant='contained' radius='sm' value={currentAccordionItem} onChange={setAccordionItem}>
            {PlayerList ? PlayerList : 
              <Paper p='md'>
                <Text size='md' weight={600} color='red.4'>No players found</Text>
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
            fetchNui('flight_admin:loadPages', { type: 'players', activePage: value, filter: searchPlayerValue })
            setPage(value)
            setAccordionItem('0')
          }}
          total={pageCount}
      />
      </Center>
    </Stack>
  )

}

export default Players