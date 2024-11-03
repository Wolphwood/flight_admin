import { Box, createStyles } from '@mantine/core'
import { ThreeComponent } from './layouts/gizmo/ThreeComponent'
import ImgPreview from './layouts/imgPreview'
import Menu from './layouts/menu'
import { isEnvBrowser } from './utils/misc'

import { fetchNui } from './utils/fetchNui'

import { DebugImportLangFiles } from './utils/debugData'
import { RegisterLocale } from './utils/Locale'

const useStyles = createStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

if (isEnvBrowser()) {
  DebugImportLangFiles()
}

const App: React.FC = () => {
  const { classes } = useStyles()  

  fetchNui('getLocales').then(data => Object.keys(data).forEach(lang => RegisterLocale(lang, data[lang])));

  return (
    <>
      <Box className={classes.container}>
        <Menu />
        <ThreeComponent />
      </Box>
      <ImgPreview />
    </>
  )
}

export default App
