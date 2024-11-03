function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file))
end

function updateFileData(path, file, data)
    return SaveResourceFile(RESOURCE_NAME, path .. '/' .. file, json.encode(data, { indent=true }))
end

function formatTimecycles(timecycles)
    local formatedTimecycles = {}

    for i=1, #timecycles do
        local v = timecycles[i]
        table.insert(formatedTimecycles, { label = v.Name, value = tostring(joaat(v.Name)) })
    end

    return formatedTimecycles
end

function formatVanillaInteriors(vanillaInteriors)
    local formatedLocations = {}
    local count = 0

    for i=1, #vanillaInteriors do
        local v = vanillaInteriors[i]
        if v.Locations[1] then
            count += 1
            formatedLocations[count] = {
                name = v.Name,
                x = math.floor(v.Locations[1].Position.X *10^2)/10^2,
                y = math.floor(v.Locations[1].Position.Y *10^2)/10^2,
                z = math.floor(v.Locations[1].Position.Z *10^2)/10^2,
                heading = 0,
                metadata = {
                    dlc = v.DlcName,
                    ytyp = v.FilePath,
                    ymap = v.Locations[1].FilePath,
                    totalEntitiesCount = v.TotalEntitiesCount
                }
            }
        end
    end

    return formatedLocations
end

function formatRadioStations(radioStations)
    local formatedRadioStations = {}

    for i=1, #radioStations do
        local v = radioStations[i]
        table.insert(formatedRadioStations, { label = v.RadioName, value = v.RadioName })
    end

    return formatedRadioStations
end

function formatStaticEmitters(staticEmitters)
    local formatedStaticEmitters = {}

    for i=1, #staticEmitters do
        local v = staticEmitters[i]
        table.insert(formatedStaticEmitters, {
            name = v.Name,
            coords = vec3(v.Position.X, v.Position.Y, v.Position.Z),
            flags = v.Flags,
            interior = v.Interior,
            room = v.Room,
            radiostation = v.RadioStation
        })
    end

    return formatedStaticEmitters
end

function filterCustomLocations()
    -- Filter custom locations to update 'locations.json'
    local customLocations = {}
    for _, v in ipairs(Server.locations) do
        if v.custom then
            customLocations[#customLocations+1] = v
        end
    end
    return customLocations
end

function FlightGetJobs()
    local Jobs = {}
    for _,job in pairs(ESX.GetJobs()) do
        local Job = {
            name = job.name,
            label = job.label,
            grades = {}
        }
        
        for _,grade in pairs(job.grades) do
            table.insert(Job.grades, {
                grade = grade.grade,
                name = grade.name,
                label = grade.label
            })
        end

        -- sort grades by level (asc)
        table.sort(Job.grades, function(a,b)
            return a.grade < b.grade
        end)

        table.insert(Jobs, Job)
    end

    return Jobs
end

function getLangFiles()
    local resourceName = GetCurrentResourceName()
    local path = GetResourcePath(resourceName) .. "/locales/"
    local langs = {}

    for _, file in ipairs(GetDirFiles(path)) do
        if file:sub(-5) == '.json' then
            local data = LoadResourceFile(resourceName, "locales/" .. file)

            if data then
                langs[file:sub(0,-6)] = json.decode(data)
            end
        end
    end

    return langs
end

-- Fonction auxiliaire pour lister les fichiers d'un dossier
function GetDirFiles(path)
    local files = {}
    for file in io.popen(isLinux() and ('ls -a "' .. path ..'"') or ('dir /b "' .. path .. '"') ):lines() do
        if file ~= "." and file ~= ".." then
            table.insert(files, file)
        end
    end
    return files
end

function isLinux()
    return os.getenv("HOME") ~= nil
end

function isWindows()
    return os.getenv("HOMEDRIVE") ~= nil
end