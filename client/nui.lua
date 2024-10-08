local isSpectating, bringback, goback = false, nil, nil

TriggerServerEvent('flight_admin:log', 'Flight Admin is fully loaded :)')

local function applyDrunkEffect(animation, duration, amplifier)
    print(animation, duration, amplifier)
    
    local playerPed = PlayerPedId()
    local isDrunk = true

    -- Charger l'ensemble d'animations saoul
    RequestAnimSet(animation)
    while not HasAnimSetLoaded(animation) do
        Wait(5)
    end

    -- Appliquer l'effet saoul
    SetPedMovementClipset(playerPed, animation, 0.25)
    ShakeGameplayCam("DRUNK_SHAKE", amplifier)
    SetPedIsDrunk(playerPed, true)
    SetTransitionTimecycleModifier("spectator5", amplifier)

    -- Tâches aléatoires si le joueur conduit
    CreateThread(function()
        while isDrunk do
            local vehPedIsIn = GetVehiclePedIsIn(playerPed, false)
            local isPedInVehicleAndDriving = (vehPedIsIn ~= 0) and (GetPedInVehicleSeat(vehPedIsIn, -1) == playerPed)

            if isPedInVehicleAndDriving then
                local randomTask = math.round(math.random(1, 8))
                TaskVehicleTempAction(playerPed, vehPedIsIn, randomTask, math.round(math.random(100,500)))
            end

            Wait(math.round(math.random(500,5000)))
        end
    end)

    -- Nettoyage après la durée de l'effet
    Wait(duration)
    isDrunk = false
    SetTransitionTimecycleModifier("default", 10.00)
    StopGameplayCamShaking(true)
    ResetPedMovementClipset(playerPed, 0.0)
    RemoveAnimSet(animation)
    SetPedIsDrunk(playerPed, false)
end

local function splitString(inputStr)
    local sanitizedStr = inputStr:gsub("[; /]", ",")
    
    local result = {}
    for value in sanitizedStr:gmatch("[^,]+") do
        table.insert(result, value)
    end

    return result;
end

local function parseRelativeValue(value, current)
    if value == "~" then
        return current
    elseif value:sub(1, 1) == "~" then
        local offset = tonumber(value:sub(2)) or 0
        return current + offset
    else
        return tonumber(value) or current
    end
end

RegisterNetEvent('flightadmin:applyTrollEffect', function(effect)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local rots = GetEntityRotation(playerPed)

    if effect.value == "ragdoll" then
        if not IsPedRagdoll(playerPed) then
            SetPedToRagdoll(playerPed, effect.duration * 1000, effect.duration * 1000, 0, true, true, false)
        else
            ClearPedTasksImmediately(playerPed)
        end
    elseif effect.value == "drunk" then
        applyDrunkEffect(effect.animation, effect.duration * 1000, effect.amplifier)
    elseif effect.value == "teleport" then
        local pos = splitString(effect.pos);
        local rot = splitString(effect.rot);

        local h = GetPlayerHeight(playerPed)

        local pos_x, pos_y, pos_z = parseRelativeValue(pos[1], coords.x), parseRelativeValue(pos[2], coords.y), parseRelativeValue(pos[3], coords.z);
        local rot_x, rot_y, rot_z = parseRelativeValue(rot[1], rots.x), parseRelativeValue(rot[2], rots.y), parseRelativeValue(rot[3], rots.z);

        SetEntityRotation(playerPed, rot_x, rot_y, rot_z, 2, true)
        SetEntityCoords(playerPed, pos_x, pos_y, pos_z - (h/2), false, false, true, false)
    end
end)

RegisterNUICallback('flight_admin:tabSelected', function(newTab, cb)
    cb(1)
    local previousTab = Client.currentTab
    Client.currentTab = newTab

    -- If exiting object tab while gizmo is enabled, set gizmo disabled
    if previousTab == 'object' and newTab ~= 'object' then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {}
        })
        Client.gizmoEntity = nil
    end

    if newTab == 'home' then
        FUNC.setMenuPlayerCoords()
        FUNC.setMenuServerInfo()
    elseif newTab == 'world' then
        local hour, minute = FUNC.getClock()

        SendNUIMessage({
            action = 'setWorldData',
            data = {
                clock = { hour = hour, minute = minute },
                weather = FUNC.getWeather()
            }
        })

    elseif newTab == 'interior' and not Client.timecyclesLoaded then
        SendNUIMessage({
            action = 'setTimecycleList',
            data = Client.data.timecycles
        })
        Client.timecyclesLoaded = true

    elseif newTab == 'locations' and not Client.locationsLoaded then
        FUNC.loadPage('locations', 1)
        Client.locationsLoaded = true

    elseif newTab == 'peds' and not Client.pedsLoaded then
        FUNC.loadPage('peds', 1)
        Client.pedsLoaded = true

    elseif newTab == 'vehicles' and not Client.vehiclesLoaded then
        FUNC.loadPage('vehicles', 1)
        Client.vehiclesLoaded = true

    elseif newTab == 'players' then
        lib.callback('flight_admin:getPlayerData', false, function(data)
            Client.data.players = data
        end)

        FUNC.loadPage('players', 1, nil, nil, isSpectating)

    elseif newTab == 'weapons' and not Client.weaponsLoaded then
        FUNC.loadPage('weapons', 1)
        Client.weaponsLoaded = true
    elseif newTab == 'audio' and not Client.audioLoaded then
        FUNC.getClosestStaticEmitter()
        SendNUIMessage({
            action = 'setRadioStationsList',
            data = Client.data.radioStations
        })
        Client.audioLoaded = true
    end
end)

RegisterNUICallback('flight_admin:setNoClip', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:server:setNoClip", id)
end)

RegisterNUICallback('flight_admin:revive', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:revive", id)
end)

RegisterNUICallback('flight_admin:warnAll', function(message, cb)
    cb(1)
    if not message then return end
    TriggerServerEvent("flight_admin:warnAll", message)
end)

RegisterNUICallback('flight_admin:kickAll', function(message, cb)
    cb(1)
    if not message then return end
    TriggerServerEvent("flight_admin:kickAll", message)
end)

RegisterNUICallback('flight_admin:Announce', function(message, cb)
    cb(1)
    if not message then return end
    TriggerServerEvent("flight_admin:Announce", message)
end)

RegisterNUICallback('flight_admin:teleport', function(data, cb)
    cb(1)
    if data then
        FUNC.teleportPlayer({ x = data.x, y = data.y, z = data.z, heading = data.heading }, true)

        SendNUIMessage({
            action = 'setLastLocation',
            data = data
        })

        SetResourceKvp('flight_admin:lastLocation', json.encode(data))
        Client.lastLocation = data
    end
end)

RegisterNUICallback('flight_admin:changePed', function(data, cb)
    cb(1)
    FUNC.changePed(data.name)
end)

RegisterNUICallback('flight_admin:spawnVehicle', function(data, cb)
    cb(1)
    FUNC.spawnVehicle(data)
end)

RegisterNUICallback('flight_admin:deleteVehicle', function(_, cb)
    cb(1)
    if cache.vehicle and DoesEntityExist(cache.vehicle) then
        DeleteVehicle(cache.vehicle)
    end
end)

RegisterNUICallback('flight_admin:exit', function(_, cb)
    cb(1)
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    Client.isMenuOpen = false

    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil
end)

RegisterNUICallback('flight_admin:changeLocationName', function(data, cb)
    cb(1)
    lib.callback('flight_admin:renameLocation', false, function(result)
        if not result then return end

        Client.data.locations[result.index] = result.data

        if Client.isMenuOpen and Client.currentTab == 'locations' then
            FUNC.loadPage('locations', 1)
        end
    end, data)
end)

RegisterNUICallback('flight_admin:createCustomLocation', function(locationName, cb)
    cb(1)
    local playerPed = cache.ped

    lib.callback('flight_admin:createCustomLocation', false, function(result)
        if not result then return end

        -- Insert new location at index 1
        table.insert(Client.data.locations, 1, result)

        if Client.isMenuOpen and Client.currentTab == 'locations' then
            FUNC.loadPage('locations', 1)
        end

        lib.notify({
            title = 'Flight Admin',
            description = locale('custom_location_created'),
            type = 'success',
            position = 'top'
        })
    end, {
        name = locationName,
        coords = GetEntityCoords(playerPed),
        heading = GetEntityHeading(playerPed)
    })
end)

RegisterNUICallback('flight_admin:deleteLocation', function(locationName, cb)
    cb(1)
    local result = lib.callback.await('flight_admin:deleteLocation', false, locationName)
    if not result then return end

    -- Remove location from file
    table.remove(Client.data.locations, result)

    if Client.isMenuOpen and Client.currentTab == 'locations' then
        FUNC.loadPage('locations', 1)
    end
end)

RegisterNUICallback('flight_admin:setWeather', function(weatherName, cb)
    cb(1)
    FUNC.setWeather(weatherName)
end)

RegisterNUICallback('flight_admin:setClock', function(clock, cb)
    cb(1)
    FUNC.setClock(clock.hour, clock.minute)
end)

RegisterNUICallback('flight_admin:getClock', function(_, cb)
    cb(1)
    local hour, minute = FUNC.getClock()
    SendNUIMessage({
        action = 'setClockData',
        data = {hour = hour, minute = minute }
    })
end)

RegisterNUICallback('flight_admin:freezeTime', function(state, cb)
    cb(1)
    Client.freezeTime = state
end)

RegisterNUICallback('flight_admin:freezeWeather', function(state, cb)
    cb(1)
    Client.freezeWeather = state
end)

RegisterNUICallback('flight_admin:cleanZone', function(_, cb)
    cb(1)
    local playerId = cache.ped
    local playerCoords = GetEntityCoords(playerId)
    ClearAreaOfEverything(playerCoords.x, playerCoords.y, playerCoords.z, 1000.0, false, false, false, false)
end)

RegisterNUICallback('flight_admin:cleanPed', function(_, cb)
    cb(1)
    local playerId = cache.ped
    ClearPedBloodDamage(playerId)
    ClearPedEnvDirt(playerId)
    ClearPedWetness(playerId)
end)

RegisterNUICallback('flight_admin:upgradeVehicle', function(_, cb)
    cb(1)
    local vehicle = cache.vehicle
    if DoesEntityExist(vehicle) and IsEntityAVehicle(vehicle) then
        local max
        for _, modType in ipairs({11, 12, 13, 16}) do
            max = GetNumVehicleMods(vehicle, modType) - 1
            SetVehicleMod(vehicle, modType, max, customWheels)
        end
        ToggleVehicleMod(vehicle, 18, true) -- Turbo
        lib.notify({
            title = 'Flight Admin',
            description = locale('vehicle_upgraded'),
            type = 'success',
            position = 'top'
        })
    end
end)

RegisterNUICallback('flight_admin:tpIntoVehPlayer', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:tpIntoVeh", id)
end)

RegisterNUICallback('flight_admin:warnPlayer', function(data, cb)
    cb(1)
    TriggerServerEvent("flight_admin:warnPlayer", data)
end)

RegisterNUICallback('flight_admin:tpCoordsPlayer', function(data, cb)
    cb(1)
    TriggerServerEvent("flight_admin:tpCoordsPlayer", data)
end)



RegisterNUICallback('flight_admin:tpMarkerPlayer', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:tpMarkerPlayer", id)
end)

RegisterNUICallback('flight_admin:spectatePlayer', function(targetPed, cb)
    cb(1)
    local myPed = PlayerPedId()
    local targetplayer = GetPlayerFromServerId(targetPed)
    local target = GetPlayerPed(targetplayer)
    if not isSpectating then
        isSpectating = true
        SetEntityVisible(myPed, false) -- Set invisible
        SetEntityCollision(myPed, false, false) -- Set collision
        SetEntityInvincible(myPed, true) -- Set invincible
        NetworkSetEntityInvisibleToNetwork(myPed, true) -- Set invisibility
        lastSpectateCoord = GetEntityCoords(myPed) -- save my last coords
        NetworkSetInSpectatorMode(true, target) -- Enter Spectate Mode
    else
        isSpectating = false
        NetworkSetInSpectatorMode(false, target) -- Remove From Spectate Mode
        NetworkSetEntityInvisibleToNetwork(myPed, false) -- Set Visible
        SetEntityCollision(myPed, true, true) -- Set collision
        SetEntityCoords(myPed, lastSpectateCoord) -- Return Me To My Coords
        SetEntityVisible(myPed, true) -- Remove invisible
        SetEntityInvincible(myPed, false) -- Remove godmode
        lastSpectateCoord = nil -- Reset Last Saved Coords
    end
    TriggerServerEvent("flight_admin:spectatePlayer", isSpectating)
end)

RegisterNUICallback('flight_admin:freezePlayer', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:freezePlayer", id)
end)

RegisterNUICallback('flight_admin:killPlayer', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:killPlayer", id)
end)

RegisterNUICallback('flight_admin:trollPlayer', function(data, cb)
    cb(1)
    TriggerServerEvent("flight_admin:trollPlayer", data)
end)

RegisterNUICallback('flight_admin:bringPlayer', function(id, cb)
    cb(1)
    local h = GetPlayerHeight(GetPlayerPed(GetPlayerFromServerId(id)))
    TriggerServerEvent("flight_admin:bringPlayer", id, h)
end)

RegisterNUICallback('flight_admin:placeMarkerAtPlayer', function(id, cb)
    cb(1)
    TriggerServerEvent("flight_admin:placeMarkerAtPlayer", id)
end)

RegisterNUICallback('flight_admin:placeMarker', function(coords, cb)
    cb(1)
    TriggerEvent("flight_admin:placeMarker", coords)
end)

RegisterNUICallback('flight_admin:bringBackPlayer', function(id, cb)
    cb(1)
    local h = GetPlayerHeight(GetPlayerPed(GetPlayerFromServerId(id)))
    TriggerServerEvent("flight_admin:bringBackPlayer", id, h)
end)

RegisterNUICallback('flight_admin:gotoPlayer', function(id, cb)
    cb(1)
    local h = GetPlayerHeight(GetPlayerPed(GetPlayerFromServerId(id)))
    TriggerServerEvent("flight_admin:gotoPlayer", id, h)
end)

RegisterNUICallback('flight_admin:goBackPlayer', function(id, cb)
    cb(1)
    local h = GetPlayerHeight(GetPlayerPed(GetPlayerFromServerId(id)))
    TriggerServerEvent("flight_admin:goBackPlayer", id, h)
end)

RegisterNUICallback('flight_admin:kickPlayer', function(data, cb)
    cb(1)
    TriggerServerEvent("flight_admin:kickPlayer", data)
end)

RegisterNUICallback('flight_admin:banPlayer', function(data, cb)
    cb(1)
    TriggerServerEvent("flight_admin:banPlayer", data)
end)

RegisterNUICallback('flight_admin:repairVehicle', function(_, cb)
    cb(1)
    local vehicle = cache.vehicle
	SetVehicleFixed(vehicle)
    SetVehicleEngineHealth(vehicle, 1000.0)
    SetVehicleDirtLevel(vehicle, 0.0)
end)

RegisterNUICallback('flight_admin:giveWeapon', function(weaponName, cb)
    cb(1)
    if Shared.ox_inventory then
        lib.callback('flight_admin:giveWeaponToPlayer', false, function(result)
            if result then
                lib.notify({type = 'success', description = locale('weapon_gave')})
            else
                lib.notify({type = 'error', description = locale('weapon_cant_carry')})
            end
        end, weaponName)
        return
    else
        GiveWeaponToPed(cache.ped, joaat(weaponName), 999, false, true)
    end
end)

RegisterNUICallback('flight_admin:giveWeaponAmmo', function(weaponName, cb)
    cb(1)
    if Shared.ox_inventory then
        lib.callback('flight_admin:giveWeaponAmmoToPlayer', false, function(result)
            if result then
                lib.notify({type = 'success', description = locale('ammo_gave')})
            else
                lib.notify({type = 'error', description = locale('ammo_cant_carry')})
            end
        end, weaponName)
        return
    else
        GiveWeaponToPed(cache.ped, joaat(weaponName), 999, false, true)
    end
end)

RegisterNUICallback('flight_admin:setDay', function(_, cb)
    cb(1)
    FUNC.setClock(12)
    FUNC.setWeather('extrasunny')
end)

RegisterNUICallback('flight_admin:setMaxHealth', function(id, cb)
    cb(1)
    if id then
        local playerPed = PlayerPedId()
        SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed))

        lib.notify({
            title = 'Flight Admin',
            description = locale('max_health_set'),
            type = 'success',
            position = 'top'
        })
    else
        TriggerServerEvent("flight_admin:setMaxHealth", id)
    end
end)

RegisterNUICallback('flight_admin:spawnFavoriteVehicle', function(_, cb)
    cb(1)
    FUNC.spawnVehicle('krieger')
end)

RegisterNUICallback('flight_admin:noclip', function(bool, cb)
    cb(1)
    FUNC.setNoClip(bool)
end)

RegisterNUICallback('flight_admin:tpm', function(_, cb)
    cb(1)
    FUNC.teleportPlayer()
end)

RegisterNUICallback('flight_admin:addEntity', function(modelName, cb)
    cb(1)
    local model = joaat(modelName)
    if not IsModelInCdimage(model) then
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    
    lib.requestModel(model)

    local distance = 5 -- Distance to spawn object from the camera
    local cameraRotation = GetFinalRenderedCamRot()
    local cameraCoord = GetFinalRenderedCamCoord()
	local direction = FUNC.rotationToDirection(cameraRotation)
	local coords =  vec3(cameraCoord.x + direction.x * distance, cameraCoord.y + direction.y * distance, cameraCoord.z + direction.z * distance)
    local obj = CreateObject(model, coords.x, coords.y, coords.z)
    
    Wait(50)
    if not DoesEntityExist(obj) then 
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_cant_be_loaded'),
            type = 'error',
            position = 'top'
        })
        return
    end

    FreezeEntityPosition(obj, true)

    local entityRotation = GetEntityRotation(obj)

    table.insert(Client.spawnedEntities, {
        handle = obj,
        name = modelName,
        position = {
            x = FUNC.round(coords.x, 3),
            y = FUNC.round(coords.y, 3),
            z = FUNC.round(coords.z, 3)
        },
        rotation = {
            x = FUNC.round(entityRotation.x, 3),
            y = FUNC.round(entityRotation.y, 3),
            z = FUNC.round(entityRotation.z, 3)
        },
        invalid = false
    })

    SendNUIMessage({
        action = 'setObjectList',
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = #Client.spawnedEntities - 1
        }
    })

    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            name = modelName,
            handle = obj,
            position = GetEntityCoords(obj),
            rotation = GetEntityRotation(obj),
        }
    })
    Client.gizmoEntity = obj
end)

RegisterNUICallback('flight_admin:setEntityModel', function(data, cb)
    cb(1)
    local model = joaat(data.modelName)
    if not IsModelInCdimage(model) then
        data.entity.invalid = true
        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = data.index,
                entity = data.entity
            }
        })
        return
    end

    -- Check if entity was spawned using Object Spawner
    local index, entity
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == data.entity.handle then
            index = k-1
            entity = v
            break
        end
    end
    
    -- If entity was spawned using Object Spawner, send updated data to nui
    if index and entity and DoesEntityExist(entity.handle) then
        entity.invalid = false
        entity.name = data.modelName
        
        -- Remove current entity
        SetEntityAsMissionEntity(entity.handle)
        DeleteEntity(entity.handle)
        
        -- Create new entity
        lib.requestModel(model)
        local obj = CreateObject(model, entity.position.x, entity.position.y, entity.position.z)
        Wait(5)
        SetEntityRotation(obj, entity.rotation.x, entity.rotation.y, entity.rotation.z)
        
        SetModelAsNoLongerNeeded(model)
        entity.handle = obj

        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = index,
                entity = entity
            }
        })

        SendNUIMessage({
            action = 'setGizmoEntity',
            data = entity
        })
        Client.gizmoEntity = entity.handle
    end
end)

RegisterNUICallback('flight_admin:deleteEntity', function(entityHandle, cb)
    cb(1)
    -- Make sure entity exists in spawnedEntities
    local foundIndex
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == entityHandle then
            foundIndex = k
            break
        end
    end

    if not foundIndex or not DoesEntityExist(entityHandle) then
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    DeleteEntity(entityHandle)
    table.remove(Client.spawnedEntities, foundIndex)

    -- Sending empty object to hide editor
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil

    -- Updating nui object list
    local newIndex = foundIndex-2
    SendNUIMessage({
        action = 'setObjectList',
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = newIndex > 0 and newIndex or nil
        }
    })

    lib.notify({
        title = 'Flight Admin',
        description = locale('entity_deleted'),
        type = 'success',
        position = 'top'
    })
end)

RegisterNUICallback('flight_admin:deleteAllEntities', function(_, cb)
    cb(1)
    -- Sending empty object to hide editor
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil

    -- Remove all spawned entities
    for _, v in ipairs(Client.spawnedEntities) do
        if DoesEntityExist(v.handle) then
            DeleteEntity(v.handle)
        end
    end
    Client.spawnedEntities = {}

    -- Updating nui object list
    SendNUIMessage({
        action = 'setObjectList',
        data = {
            entitiesList = Client.spawnedEntities,
            newIndex = nil
        }
    })
end)

RegisterNUICallback('flight_admin:setGizmoEntity', function(entityHandle, cb)
    cb(1)
    -- If entity param is nil, hide gizmo
    if not entityHandle then
        SendNUIMessage({
            action = 'setGizmoEntity',
            data = {}
        })
        Client.gizmoEntity = nil
        return
    end

    -- Make sure entity exists in spawnedEntities
    local entity
    for _, v in ipairs(Client.spawnedEntities) do
        if v.handle == entityHandle then
            entity = v
            break
        end
    end

    if not entity or not DoesEntityExist(entityHandle) then
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    -- Set entity gizmo
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            name = entity.name,
            handle = entity.handle,
            position = GetEntityCoords(entity.handle),
            rotation = GetEntityRotation(entity.handle),
        }
    })
    Client.gizmoEntity = entity.handle
end)

RegisterNUICallback('flight_admin:goToEntity', function(data, cb)
    cb(1)
    if data?.position and data.handle and DoesEntityExist(data.handle) then
        local coords = GetEntityCoords(data.handle)
        FUNC.teleportPlayer({x = coords.x, y = coords.y, z = coords.z}, true)
        
        lib.notify({
            title = 'Flight Admin',
            description = locale('teleport_success'),
            type = 'success',
            position = 'top'
        })
    else
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
    end
end)

RegisterNUICallback('flight_admin:moveEntity', function(data, cb)
    cb(1)
    if data.handle then
        if DoesEntityExist(data.handle) then
            SetEntityCoords(data.handle, data.position.x, data.position.y, data.position.z)
            SetEntityRotation(data.handle, data.rotation.x, data.rotation.y, data.rotation.z)
        else
            lib.notify({
                title = 'Flight Admin',
                description = locale('entity_doesnt_exist'),
                type = 'error',
                position = 'top'
            })
            return
        end

        -- Check if entity was spawned using Object Spawner
        local index, entity
        for k, v in ipairs(Client.spawnedEntities) do
            if v.handle == data.handle then
                index = k-1
                entity = v
                break
            end
        end

        -- If entity was spawned using Object Spawner, send updated data to nui
        if index and entity then
            local newPos = GetEntityCoords(entity.handle)
            local newRot = GetEntityRotation(entity.handle)
            entity.position = { x = newPos.x, y = newPos.y, z = newPos.z }
            entity.rotation = { x = newRot.x, y = newRot.y, z = newRot.z }

            SendNUIMessage({
                action = 'setObjectData',
                data = {
                    index = index,
                    entity = entity
                }
            })
        end
    end
end)

RegisterNUICallback('flight_admin:snapEntityToGround', function(data, cb)
    cb(1)
    if not DoesEntityExist(data.handle) then
        lib.notify({
            title = 'Flight Admin',
            description = locale('entity_doesnt_exist'),
            type = 'error',
            position = 'top'
        })
        return
    end

    -- Check if entity was spawned using Object Spawner
    local index, entity
    for k, v in ipairs(Client.spawnedEntities) do
        if v.handle == data.handle then
            index = k-1
            entity = v
            break
        end
    end

    -- If entity was spawned using Object Spawner, send updated data to nui
    if index and entity and DoesEntityExist(entity.handle) then
        PlaceObjectOnGroundProperly(entity.handle)

        local newPos = GetEntityCoords(entity.handle)
        local newRot = GetEntityRotation(entity.handle)
        entity.position = { x = newPos.x, y = newPos.y, z = newPos.z }
        entity.rotation = { x = newRot.x, y = newRot.y, z = newRot.z }

        SendNUIMessage({
            action = 'setObjectData',
            data = {
                index = index,
                entity = entity
            }
        })

        SendNUIMessage({
            action = 'setGizmoEntity',
            data = entity
        })
        Client.gizmoEntity = entity.handle
    end
end)

RegisterNUICallback('flight_admin:setCustomCoords', function(data, cb)
    cb(1)
    local formatedCoords
    if data.coordString then
        local coordString = (data.coordString:gsub(',', '')):gsub('  ', ' ')

        local coords = {}
        for match in (coordString..' '):gmatch('(.-) ') do
            table.insert(coords, match)
        end
        formatedCoords = vec3(tonumber(coords[1]), tonumber(coords[2]), tonumber(coords[3]))

    elseif data.coords then
        formatedCoords = vec3(data.coords.x, data.coords.y, data.coords.z)
    end

    if not formatedCoords then return end
    FUNC.teleportPlayer({ x = formatedCoords.x, y = formatedCoords.y, z = formatedCoords.z }, true)
end)

RegisterNUICallback('flight_admin:loadPages', function(data, cb)
    cb(1)
    FUNC.loadPage(data.type, data.activePage, data.filter, data.checkboxes)
end)

RegisterNUICallback('flight_admin:openBrowser', function(data, cb)
    cb(1)
    SendNUIMessage({ name = 'openBrowser', url = data.url })
end)

RegisterNUICallback('flight_admin:setStaticEmitterDrawDistance', function(distance, cb)
    cb(1)
    Client.staticEmitterDrawDistance = distance
end)

RegisterNUICallback('flight_admin:getClosestStaticEmitter', function(_, cb)
    cb(1)
    FUNC.getClosestStaticEmitter()
end)

RegisterNUICallback('flight_admin:toggleStaticEmitter', function(data, cb)
    cb(1)
    SetStaticEmitterEnabled(data.emitterName, data.state)
end)

RegisterNUICallback('flight_admin:setStaticEmitterRadio', function(data, cb)
    cb(1)
    SetEmitterRadioStation(data.emitterName, data.radioStation)
    for _, v in ipairs(Client.data.staticEmitters) do
        if v.name == data.emitterName then
            v.radiostation = data.radioStation
            break
        end
    end
end)

RegisterNUICallback('flight_admin:setDrawStaticEmitters', function(state, cb)
    cb(1)
    Client.drawStaticEmitters = state
end)

-- Events

RegisterNetEvent('flight_admin:killPlayer', function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent('flight_admin:tpCoordsPlayer', function(data)
    local formatedCoords
    if data.coordString then
        local coordString = (data.coordString:gsub(',', '')):gsub('  ', ' ')

        local coords = {}
        for match in (coordString..' '):gmatch('(.-) ') do
            table.insert(coords, match)
        end
        formatedCoords = vec3(tonumber(coords[1]), tonumber(coords[2]), tonumber(coords[3]))

    elseif data.coords then
        formatedCoords = vec3(data.coords.x, data.coords.y, data.coords.z)
    end

    if not formatedCoords then return end
    FUNC.teleportPlayer({ x = formatedCoords.x, y = formatedCoords.y, z = formatedCoords.z }, true)
end)

RegisterNetEvent('flight_admin:tpMarkerPlayer', function()
    FUNC.teleportPlayer()
end)

RegisterNetEvent('flight_admin:updatePlayerData', function()
    lib.callback('flight_admin:getPlayerData', false, function(data)
        Client.data.players = data
        FUNC.loadPage('players', 1, nil, nil, isSpectating)
    end)
end)

RegisterNetEvent('flight_admin:placeMarker', function(coords)
    SetNewWaypoint(coords.x, coords.y)
end)

RegisterNetEvent('flight_admin:setNoClip', function(bool)
    FUNC.setNoClip(bool)
end)

RegisterNetEvent("flight_admin:setMaxHealthPlayer", function()
    local playerPed = PlayerPedId()
    SetEntityHealth(playerPed, GetEntityMaxHealth(playerPed))

    lib.notify({
        title = 'Flight Admin',
        description = locale('max_health_set'),
        type = 'success',
        position = 'top'
    })
end)

-- Exports
exports("setGizmoEntity", function(obj)
    Client.gizmoEntity = obj
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {
            name = modelName,
            handle = obj,
            position = GetEntityCoords(obj),
            rotation = GetEntityRotation(obj),
        }
    })
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
end)

exports("removeGizmoEntity", function()
    SendNUIMessage({
        action = 'setGizmoEntity',
        data = {}
    })
    Client.gizmoEntity = nil
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
end)