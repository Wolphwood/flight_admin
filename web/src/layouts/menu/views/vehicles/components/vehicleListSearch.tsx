import { useEffect, useState } from 'react'
import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TbSearch } from 'react-icons/tb'
import { vehicleListSearchAtom, vehiclesActivePageAtom } from '@/atoms/vehicle'
import { fetchNui } from '@/utils/fetchNui'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'

const VehicleSearch: React.FC = () => {
  const [searchVehicle, setSearchVehicle] = useState('')
  const setVehicleSearch = useSetRecoilState(vehicleListSearchAtom)
  const [debouncedVehicleSearch] = useDebouncedValue(searchVehicle, 200)
  const setActivePage = useSetRecoilState(vehiclesActivePageAtom)

  useEffect(() => {
    setVehicleSearch(debouncedVehicleSearch)
    fetchNui('flight_admin:loadPages', { type: 'vehicles', activePage: 1, filter: debouncedVehicleSearch })
  }, [debouncedVehicleSearch])

  return (
    <>
      <TextInput
        placeholder={GetForcedStringLocale("ui_search")}
        icon={<TbSearch size={20} />}
        value={searchVehicle}
        onChange={(e) => {
          setActivePage(1)
          setSearchVehicle(e.target.value)
        }}
      />
    </>
  )
}

export default VehicleSearch
