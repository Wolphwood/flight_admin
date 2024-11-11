Config = {}

Config.language = 'fr' -- Available Languages : en/de/fr/pt

Config.openMenuKey = 'F3'
Config.toggleNoclipKey = 'F11'
Config.teleportMarkerKey = 'F10'

Config.perimission =  function(type, playerId)
    local group = nil
    if playerId then
        group = ESX.GetPlayerFromId(playerId).getGroup()
    else
        group = lib.callback.await('flight_admin:getGroup', false, GetPlayerServerId(PlayerId()))
    end
    return group == "admin"
end