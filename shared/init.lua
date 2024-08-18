RESOURCE_NAME = GetCurrentResourceName()

Shared = {}

if not GetResourceState('ox_lib'):find('start') then
    print('^1ox_lib should be started before this resource^0', 2)
end

if GetResourceState('ox_inventory'):find('start') then
    Shared.ox_inventory = true
end

lib.locale()

function tprint (tbl, indent)
    if not indent then indent = 0 end
    local toprint = string.rep(" ", indent) .. "{\r\n"
    indent = indent + 2 
    for k, v in pairs(tbl) do
      toprint = toprint .. string.rep(" ", indent)
      if (type(k) == "number") then
        toprint = toprint .. "[" .. k .. "] = "
      elseif (type(k) == "string") then
        toprint = toprint  .. k ..  "= "   
      end
      if (type(v) == "number") then
        toprint = toprint .. v .. ",\r\n"
      elseif (type(v) == "string") then
        toprint = toprint .. "\"" .. v .. "\",\r\n"
      elseif (type(v) == "table") then
        toprint = toprint .. tprint(v, indent + 2) .. ",\r\n"
      else
        toprint = toprint .. "\"" .. tostring(v) .. "\",\r\n"
      end
    end
    toprint = toprint .. string.rep(" ", indent-2) .. "}"
    return toprint
end

function getModelHeight(playerPed)
    local model = GetEntityModel(playerPed)
    local minVector, maxVector = GetModelDimensions(model)
    local height = maxVector.z - minVector.z

    return height
end

CreateThread(function()    
    if IsDuplicityVersion() then
        Server = {}
    else
        Client = {
            noClip = false,
            isMenuOpen = false,
            currentTab = 'home',
            lastLocation = json.decode(GetResourceKvpString('flight_admin:lastLocation')),
            portalPoly = false,
            portalLines = false,
            portalCorners = false,
            portalInfos = false,
            interiorId = GetInteriorFromEntity(cache.ped),
            spawnedEntities = {},
            freezeTime = false,
            freezeWeather = false,
            data = {}
        }

        -- Get data from shared/data json files
        lib.callback('flight_admin:getData', false, function(data)
            Client.data = data
        end)

        lib.callback('flight_admin:getPlayerData', false, function(data)
            Client.data.players = data
        end)

        -- If ox_target is running, create targets
        if GetResourceState('ox_target'):find('start') then
            FUNC.initTarget()
        end

        -- Load locale
        RegisterNUICallback('loadLocale', function(_, cb)
            cb(1)
            local locale = Config.language or 'en'
            local JSON = LoadResourceFile(RESOURCE_NAME, ('locales/%s.json'):format(locale))
            if not JSON then
                JSON = LoadResourceFile(RESOURCE_NAME, 'locales/en.json')
                lib.notify({
                    type = 'error',
                    title = "Flight Admin",
                    description = "'" .. locale .. "' locale not found, please contribute by adding your language",
                    duration = 10000
                })
            end
            SendNUIMessage({
                action = 'setLocale',
                data = json.decode(JSON)
            })
        end)

        CreateThread(function()
            FUNC.setMenuPlayerCoords()
            FUNC.setMenuServerInfo()
            while true do
                Wait(150)
                Client.interiorId = GetInteriorFromEntity(cache.ped)
            end
        end)

        if not Config.development then
            SetTimeout(1000, function()
                Client.version = lib.callback.await('flight_admin:getVersion', false)
            end)
        end
    end
end)