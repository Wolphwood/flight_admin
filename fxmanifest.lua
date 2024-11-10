fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

name         'flight_admin'
version      '1.2.0-b5'
description  'The admin menu everyone needs'
author       'Wolphwood' -- (originally DevTheBully)
repository   'https://github.com/Wolphwood/flight_admin'

shared_scripts {
    '@es_extended/imports.lua',
    '@ox_lib/init.lua',
    'shared/init.lua',
    'config.lua',
}

client_scripts {
    'client/freecam/utils.lua',
    'client/freecam/config.lua',
    'client/freecam/camera.lua',
    'client/freecam/main.lua',
    'client/functions.lua',
    'client/nui.lua',
    'client/controls.lua',
    'client/commands.lua',
    'client/interior.lua',
    'client/threads.lua',
}

server_scripts {
	'server/functions.lua',
	'server/main.lua',
    'server/version.lua'
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/**/*',
    'web/browser.js',
    'shared/img/**/*.webp',
    'shared/img/**/*.png',
    'locales/*.json'
}

dependencies {
    '/server:5104',
    '/onesync',
    'ox_lib'
}
