import { Text, Stack, SimpleGrid, Button, Paper, Group, Space } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { useEffect, useState } from 'react'
import { FiFastForward } from 'react-icons/fi'
import { getInteriorData } from '../../../../atoms/interior'
import { getLastLocation } from '../../../../atoms/location'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { fetchNui } from '../../../../utils/fetchNui'
import CreateLocation from '../locations/components/modals/CreateLocation'
import SendAnnouncement from './modals/SendAnnouncement'
import { setClipboard } from '../../../../utils/setClipboard'
import SetCoords from './modals/SetCoords'
import { useRecoilState } from 'recoil'
import { positionAtom, groundPositionAtom } from '../../../../atoms/position'
import { worldFreezeTimeAtom } from '../../../../atoms/world'
import { useLocales } from '../../../../providers/LocaleProvider'
import { FaMapMarkerAlt } from 'react-icons/fa'
import {BsFillInfoCircleFill, BsFillPinMapFill} from 'react-icons/bs'
import KickAll from './modals/KickAll'
import WarnAll from './modals/WarnAll'

const Home: React.FC = () => {
  const { getLocale } = useLocales()
  const lastLocation = getLastLocation()
  const interior = getInteriorData()
  const [currentCoords, setCurrentCoords] = useRecoilState(positionAtom)
  const [currentGroundCoords, setCurrentGroundCoords] = useRecoilState(groundPositionAtom)
  const [currentPlayers, setCurrentPlayers] = useState(0)
  const [currentUpTime, setCurrentUpTime] = useState(0)
  const [currentNextRestart, setNextRestart] = useState(0)
  const [currentHeading, setCurrentHeading] = useState('0.000')
  const [timeFrozen, setTimeFrozen] = useRecoilState(worldFreezeTimeAtom)
  const [copiedCoords, setCopiedCoords] = useState(false)
  const [copiedCoordsHeading, setCopiedCoordsHeading] = useState(false)
  const [copiedGroundCoords, setCopiedGroundCoords] = useState(false)
  const [copiedGroundCoordsHeading, setCopiedGroundCoordsHeading] = useState(false)
  const [noclipActive, setNoclip] = useState(false)

  useNuiEvent('playerCoords', (data: { coords: string, ground: string, heading: string }) => {
    // console.log(data)
    setCurrentCoords(data.coords)
    setCurrentGroundCoords(data.ground)
    setCurrentHeading(data.heading)
  });

  useNuiEvent('serverInfo', (data: { players: number, uptime:number, nextRestart:number}) => {
    setCurrentPlayers(data.players)
    setCurrentUpTime(data.uptime)
    setNextRestart(data.nextRestart)
  });

  // Copied coords button
  [
    [copiedCoords, setCopiedCoords],
    [copiedGroundCoords, setCopiedGroundCoords],
    [copiedCoordsHeading, setCopiedCoordsHeading],
    [copiedGroundCoordsHeading, setCopiedGroundCoordsHeading],
  ].forEach(group => {
    let [value, setter] = group;

    useEffect(() => {
      if (value) {
        const timer = setTimeout(() => {
          if (typeof setter == 'function') setter(false);
        }, 1000);
        return () => clearTimeout(timer); // Cleanup on unmount or value change
      }
    }, [value, setter]);
  });


  return (
    <SimpleGrid cols={1}>
      <Stack>

        {/* CURRENT COORDS */}
        <Paper p='md'>
          
          <Group position='apart'>
            <Text size={20} weight={600}>{getLocale("ui_general_tab")}</Text>
            <BsFillInfoCircleFill size={24}/>
          </Group>
          
          <Space h='sm' />

          <Group position='apart'>
            <Group><Text>{getLocale("ui_players")}:</Text><Text color='blue.4' >{currentPlayers}</Text></Group>
            <Group><Text>{getLocale("ui_uptime")}:</Text><Text color='blue.4'  >{0}</Text></Group>
            <Group><Text>{getLocale("ui_schedRestart")}:</Text><Text color='blue.4' style={{ minWidth: '15px' }} >{0}</Text></Group>
          </Group>
          
          <Space h='sm' />

          <Group grow>
          <Button
              color='green.7'
              variant='light'
              size='xs'
              onClick={() =>
                openModal({
                  title: getLocale("ui_announcement_title"),
                  size: 'lg',
                  children: <SendAnnouncement />,
                })
              }
            >{getLocale("ui_announcement_title")}</Button>

            <Button
              color='red.7'
              variant='light'
              size='xs'
              onClick={() =>
                openModal({
                  title: getLocale("ui_kickAll"),
                  size: 'xs',
                  children: <KickAll />,
                })
              }
            >{getLocale("ui_kickAll")}</Button>

            <Button
              color='orange.7'
              variant='light'
              size='xs'
              onClick={() =>
              openModal({
                  title: getLocale("ui_warnAll"),
                  size: 'xs',
                  children: <WarnAll />,
                })
              }
            >{getLocale("ui_warnAll")}</Button>

          </Group>
        </Paper>

        {/* CURRENT COORDS */}
        <Paper p='md'>
          
          <Group position='apart'>
            <Text size={20} weight={600}>{getLocale("ui_current_coords")}</Text>
            <FaMapMarkerAlt size={24}/>
          </Group>
          
          <Space h='sm' />

          <Group position='apart'>
            <Group><Text>{getLocale("ui.home.current_coords.coords")}</Text><Text color='blue.4' >{currentCoords}</Text></Group>
            <Group><Text>{getLocale("ui.home.current_coords.heading")}</Text><Text color='blue.4' style={{ minWidth: '120px' }} >{currentHeading}</Text></Group>
          </Group>
          
          <Space h='sm' />

          <Paper>
            <Group grow>
              <Button
                color={copiedCoords ? 'teal' : 'blue.4'}
                variant='light'
                size='xs'
                onClick={() => {
                  setClipboard(currentCoords)
                  setCopiedCoords(true)
                }}
              >
                {copiedCoords ? getLocale("ui.home.current_coords.button.copied") : getLocale("ui.home.current_coords.button.copy")}
              </Button>
              <Button
                color={copiedCoordsHeading ? 'teal' : 'blue.4'}
                variant='light'
                size='xs'
                onClick={() => {
                  setClipboard(currentCoords + ', ' + currentHeading)
                  setCopiedCoordsHeading(true)
                }}
              >
                {copiedCoords ? getLocale("ui.home.current_coords.button.copied") : getLocale("ui.home.current_coords.button.copy_heading")}
              </Button>
            </Group>

            <Space h='sm' />

            <Group grow>
              <Button
                color='blue.4'
                variant='light'
                size='xs'
                onClick={() =>
                openModal({
                    title: getLocale("ui.home.current_coords.modal.define.title"),
                    size: 'xs',
                    children: <SetCoords />,
                  })
                }
              >{getLocale("ui.home.current_coords.button.define")}</Button>

              <Button
                color='blue.4'
                variant='light'
                size='xs'
                onClick={() =>
                  openModal({
                    title: getLocale("ui.home.current_coords.modal.save.title"),
                    size: 'xs',
                    children: <CreateLocation />,
                  })
                }
              >{getLocale("ui.home.current_coords.button.save")}</Button>
            </Group>
          </Paper>

          <Space h='md' />
          
          <Group position='apart'>
            <Group><Text>{getLocale("ui.home.current_coords.coords.ground")}</Text><Text color='blue.4' >{currentGroundCoords}</Text></Group>
          </Group>

          <Space h="md" />

          <Group grow>
          <Button
              color={copiedGroundCoords ? 'teal' : 'blue.4'}
              variant='light'
              size='xs'
              onClick={() => {
                setClipboard(currentGroundCoords)
                setCopiedGroundCoords(true)
              }}
            >{copiedGroundCoords ? getLocale("ui_copied_coords") : getLocale("ui.home.current_coords.button.copy.ground")}</Button>
            <Button
              color={copiedGroundCoordsHeading ? 'teal' : 'blue.4'}
              variant='light'
              size='xs'
              onClick={() => {
                setClipboard(currentGroundCoords + ', ' + currentHeading)
                setCopiedGroundCoordsHeading(true)
              }}
            >{copiedGroundCoords ? getLocale("ui_copied_coords") : getLocale("ui.home.current_coords.button.copy_heading.ground")}</Button>
          </Group>

        </Paper>
        
        {/* LAST LOCATION */}
        <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{getLocale("ui_last_location")}</Text>
            <BsFillPinMapFill size={24} />
          </Group>
          
          <Space h='sm' />
          
          {
            lastLocation
            ?
              <>
                <Group><Text>{getLocale("ui_name")}</Text><Text color='blue.4' >{lastLocation.name}</Text></Group>
                
                <Paper>
                  <Group>
                    <Text>{getLocale("ui_coords")}</Text>
                    <Text color='blue.4' >{lastLocation.x.toFixed(3)}, {lastLocation.y.toFixed(3)}, {lastLocation.z.toFixed(3)}</Text>
                  </Group>

                  <Space h="md"/>

                  <Group grow>
                    <Button
                      color='blue.4'
                      variant='light'
                      onClick={() =>
                        fetchNui('flight_admin:teleport', { name: lastLocation.name, x: lastLocation.x, y: lastLocation.y, z: lastLocation.z, heading: lastLocation.heading })
                      }
                      value={lastLocation.name}
                    >
                      {getLocale("ui_teleport")}
                    </Button>
                    <Button
                      color='blue.4'
                      variant='light'
                      onClick={() =>
                        fetchNui('flight_admin:placeMarker', { name: lastLocation.name, x: lastLocation.x, y: lastLocation.y, z: lastLocation.z, heading: lastLocation.heading })
                      }
                      value={lastLocation.name}
                    >
                      {getLocale("ui_place_marker")}
                    </Button>
                  </Group>
                </Paper>
              </>
            :
              <>
                <Space h='sm' />
                <Text color='red.4'>{getLocale("ui_no_last_location")}</Text>
              </>
          }
        </Paper>

        {/* CURRENT INTERIOR */}
        {/* <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{getLocale("ui_current_interior")}</Text>
            <RiHomeGearFill size={24} />
          </Group>
         
          {
            interior.interiorId > 0
            ? 
              <>
                <Group><Text>{getLocale("ui_interior_id")}:</Text><Text color='blue.4' >{interior.interiorId}</Text></Group>
                <Group><Text>{getLocale("ui_current_room")}:</Text><Text color='blue.4' >{interior.currentRoom?.index} - {interior.currentRoom?.name}</Text></Group>
              </>
            : 
              <>
                <Space h='sm' />
                <Text color='red.4'>{getLocale("ui_not_in_interior")}</Text>
              </>
          }
        </Paper> */}

        {/* QUICK ACTIONS */}
        <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{getLocale("ui_quick_actions")}</Text>
            <FiFastForward size={24} />
          </Group>

          <Space h='sm' />
          
          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:tpm', {})
              }
            >{getLocale("ui_tpm")}</Button>
            
            <Button
              color={noclipActive ? 'red.4' : 'blue.4'}
              variant='light'
              onClick={() => {
                setNoclip(!noclipActive)
                fetchNui('flight_admin:noclip', !noclipActive)
              }}
            >{noclipActive ? getLocale("ui_exit_noclip") : getLocale("ui_noclip") }</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:revive')
              }
            >{getLocale("ui_revive")}</Button>
          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:cleanZone', {})
              }
            >{getLocale("ui_clean_zone")}</Button>
            
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:cleanPed', {})
              }
            >{getLocale("ui_clean_ped")}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:setMaxHealth')
              }
            >{getLocale("ui_max_health")}</Button>

          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:repairVehicle', {})
              }
            >{getLocale("ui_repair_vehicle")}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:deleteVehicle', {})
              }
            >{getLocale("ui_delete_vehicle")}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:upgradeVehicle', {})
              }
            >{getLocale("ui_upgrade_vehicle")}</Button>

          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:spawnFavoriteVehicle', {})
              }
            >{getLocale("ui_spawn_vehicle")}</Button>
            
            <Button
              color={timeFrozen ? 'red.4' : 'blue.4'}
              variant='light'
              onClick={() => {
                setTimeFrozen(!timeFrozen)
                fetchNui('flight_admin:freezeTime', !timeFrozen)
              }}
            >{timeFrozen ? getLocale("ui_time_freeze") : getLocale("ui_time_not_freeze") }</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:setDay', {})
              }
            >{getLocale("ui_set_sunny_day")}</Button>
          </Group>
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Home
