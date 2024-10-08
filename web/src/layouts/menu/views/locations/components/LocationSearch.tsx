import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { TbSearch } from 'react-icons/tb'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom, locationsActivePageAtom, locationSearchAtom, locationVanillaFilterAtom, locationShopFilterAtom } from '../../../../../atoms/location'
import { useEffect, useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { fetchNui } from '../../../../../utils/fetchNui'

const LocationSearch: React.FC = () => {
  const { getLocale } = useLocales()
  const [search, setSearch] = useState('')
  const setLocationsSearch = useSetRecoilState(locationSearchAtom)
  const [debouncedSearch] = useDebouncedValue(search, 100)
  const setActivePage = useSetRecoilState(locationsActivePageAtom)
  const checkedVanilla = useRecoilValue(locationVanillaFilterAtom)
  const checkedCustom = useRecoilValue(locationCustomFilterAtom)
  const checkedShop = useRecoilValue(locationShopFilterAtom)

  useEffect(() => {
    setLocationsSearch(debouncedSearch)
    fetchNui('flight_admin:loadPages', { type: 'locations', activePage: 1, filter: debouncedSearch, checkboxes: { vanilla: checkedVanilla, custom: checkedCustom, shop: checkedShop } })
  }, [debouncedSearch])

  return (
    <>
      <TextInput
        placeholder={getLocale("ui_search")}
        icon={<TbSearch size={20} />}
        value={search}
        onChange={(e) => {
          setActivePage(1)
          setSearch(e.target.value)
        }}
      />
    </>
  )
}

export default LocationSearch
