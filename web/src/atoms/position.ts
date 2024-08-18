import { atom, useRecoilValue } from 'recoil'

const mockPosition: string = "0, 0, 0"

export const positionAtom = atom<string>({ key: 'position', default: mockPosition })
export const getPosition = () => useRecoilValue(positionAtom)

export const groundPositionAtom = atom<string>({ key: 'ground_position', default: mockPosition })
export const getGroundPosition = () => useRecoilValue(positionAtom)