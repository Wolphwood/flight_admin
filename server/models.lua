local function getFileData(path, file)
    return json.decode(LoadResourceFile(RESOURCE_NAME, path .. '/' .. file))
end

local objects = getFileData('shared/data', 'modelList.json')

local indexes = {}
for _, key in ipairs({"name", "hash", "uInt32", "image"}) do
    indexes[key] = {}
    for index, obj in ipairs(objects) do
        if obj[key] then
            indexes[key][obj[key]] = index
        end
    end
end

local function __getobjectbykey(key, value)
    if not indexes[key] == nil or not indexes[key][value] == nil then
        return nil
    else
        return objects[indexes[key][value]]
    end
end

local function getObjectByName(v)
    return __getobjectbykey('name', v)
end

local function getObjectByHash(v)
    return __getobjectbykey('hash', v)
end

local function getObjectByUInt32(v)
    return __getobjectbykey('uInt32', v)
end

return {
    getObjectByName = getObjectByName,
    getObjectByHash = getObjectByHash,
    getObjectByUInt32 = getObjectByUInt32
}