import { atom, useRecoilValue } from 'recoil'

export interface PlayerInfo {
  identifier: string,
  license: string,
  license2: string,
  discord: string,
  steam: string,
  fivem: string,
  ip: string,
  live: string,
  xbl: string,
  id: number,
  rank: number,
  label: string,
  name: string,
  noclip: boolean,
  freeze: boolean,
  bringPlayer: boolean,
  gotoPlayer: boolean,
  tracking: any,
  job: {
    name: string,
    grade: string | number
  }
}

export interface JobInfo {
  name: string;
  label: string;
  grades: {
    grade: number;
    label: string;
    name: string;
  }[];
}


const mockPlayerList: PlayerInfo[] = [
    {
      identifier: "none",
      license: "license:abcdefg1234567hbhgvjtshygv",
      license2: "license2:abcdefg1234567hbhgvjtshygv",
      discord: "823961539442507836",
      steam: "steam:110000346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 1,
      rank: 2,
      label: "Moderator",
      name:"Connor Papazarcadas",
      noclip: true,
      freeze: true,
      bringPlayer: true,
      gotoPlayer: true,
      tracking: 12,
      job: {
        name: 'job1',
        grade: 0
      }
    },
    {
      identifier: "none",
      license: "license:WFEASDFg12dfagdfbvhygv",
      license2: "license2:WFEASDFg12dfagdfbvhygv",
      discord: "1234261539442507836",
      steam: "steam:2624625466346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 112,
      rank: 0,
      label: "Junior Moderator",
      name:"Iwn Kalb",
      noclip: false,
      freeze: false,
      bringPlayer: false,
      gotoPlayer: false,
      tracking: 45,
      job: {
        name: 'job2',
        grade: 1
      }
    },    
    {
      identifier: "none",
      license: "license:WFEASDFg12dfagdfbvhygv",
      license2: "license2:WFEASDFg12dfagdfbvhygv",
      discord: "1234261539442507836",
      steam: "steam:2624625466346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 69,
      rank: 3,
      label: "Senior Moderator",
      name:"Ripper Stripper",
      noclip: false,
      freeze: false,
      bringPlayer: false,
      gotoPlayer: false,
      tracking: 45,
      job: {
        name: 'job3',
        grade: 3
      }
    },    
    {
      identifier: "none",
      license: "license:WFEASDFg12dfagdfbvhygv",
      license2: "license2:WFEASDFg12dfagdfbvhygv",
      discord: "1234261539442507836",
      steam: "steam:2624625466346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 12,
      rank: 0,
      label: "Head Moderator",
      name:"Fey Day",
      noclip: false,
      freeze: false,
      bringPlayer: false,
      gotoPlayer: false,
      tracking: 45,
      job: {
        name: 'job1',
        grade: 0
      }
    },    
    {
      identifier: "none",
      license: "license:WFEASDFg12dfagdfbvhygv",
      license2: "license2:WFEASDFg12dfagdfbvhygv",
      discord: "1234261539442507836",
      steam: "steam:2624625466346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 63,
      rank: 5,
      label: "Administrator",
      name:"Officer Shit",
      noclip: false,
      freeze: false,
      bringPlayer: false,
      gotoPlayer: false,
      tracking: 45,
      job: {
        name: 'job1',
        grade: 2
      }
    },    
    {
      identifier: "none",
      license: "license:WFEASDFg12dfagdfbvhygv",
      license2: "license2:WFEASDFg12dfagdfbvhygv",
      discord: "1234261539442507836",
      steam: "steam:2624625466346eadsa",
      fivem: "fivem:1135749",
      ip: "172.168.0.1",
      live: "live:123141532236436457124",
      xbl: "xbl:2533274921375520",
      id: 11,
      rank: 6,
      label: "Owner",
      name:"Unknown Person",
      noclip: false,
      freeze: false,
      bringPlayer: false,
      gotoPlayer: false,
      tracking: 45,
      job: {
        name: 'job2',
        grade: 4
      }
    },
]

const mockJobs: JobInfo[] = [
  {
    name: 'job1',
    label: "Nom du job 1",
    grades: [
      { grade: 0, label: "Nom du poste 1.0", name: 'postname1_0' },
      { grade: 1, label: "Nom du poste 1.1", name: 'postname1_1' },
      { grade: 2, label: "Nom du poste 1.2", name: 'postname1_2' },
      { grade: 3, label: "Nom du poste 1.3", name: 'postname1_3' },
    ]
  },
  {
    name: 'job2',
    label: "Nom du job 2",
    grades: [
      { grade: 0, label: "Nom du poste 2.0", name: 'postname2_0' },
      { grade: 1, label: "Nom du poste 2.1", name: 'postname2_1' },
      { grade: 2, label: "Nom du poste 2.2", name: 'postname2_2' },
      { grade: 3, label: "Nom du poste 2.3", name: 'postname2_3' },
    ]
  },
  {
    name: 'job3',
    label: "Nom du job 2",
    grades: [
      { grade: 0, label: "Nom du poste 3.0", name: 'postname3_0' },
      { grade: 1, label: "Nom du poste 3.1", name: 'postname3_1' },
      { grade: 2, label: "Nom du poste 3.2", name: 'postname3_2' },
      { grade: 3, label: "Nom du poste 3.3", name: 'postname3_3' },
    ]
  }
]

export const playerListSearchAtom = atom<string>({ key: 'playerListSearch', default: '' })
export const playersActivePageAtom = atom<number>({ key: 'playerActivePage', default: 1 })
export const playersPageCountAtom = atom<number>({ key: 'playerPageCount', default: 1})
export const playersPageContentAtom = atom<PlayerInfo[]>({ key: 'playersPageContent', default: mockPlayerList })

export const jobsContentAtom = atom<JobInfo[]>({ key: 'jobsContent', default: mockJobs })

export const getSearchPlayerInput = () => useRecoilValue(playerListSearchAtom) as string
