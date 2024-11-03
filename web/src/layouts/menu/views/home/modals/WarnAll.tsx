import { Button, Stack, Text, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useState } from 'react'
import { GetLocale, GetForcedStringLocale } from '@/utils/Locale'
import { fetchNui } from '@/utils/fetchNui'

const WarnAll: React.FC = () => {
    const [warnMessage, setWarnMessage] = useState('')

    return (
        <Stack>
            <Text weight={500}>{GetLocale("warn_message")}</Text>
            <TextInput value={warnMessage} onChange={(e) => setWarnMessage(e.target.value)} />
            <Button
                uppercase
                disabled={warnMessage === ''}
                variant='light'
                color='blue.4'
                onClick={() => {
                    closeAllModals()
                    fetchNui('flight_admin:warnAll', warnMessage)
                }}
            >{GetLocale("ui_confirm")}</Button>
        </Stack>
        )
    }
    
    export default WarnAll