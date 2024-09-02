local currentVersion = GetResourceMetadata('flight_admin', 'version', 0)
local mainVersion, suffix = nil, nil

if currentVersion then
    mainVersion, suffix = currentVersion:match('(%d+%.%d+%.%d+)(%-?%w*%d*)')
    currentVersion = mainVersion..suffix
end

local versionData = { currentVersion = currentVersion, mainVersion = mainVersion, suffix = suffix }

local function checkVersion()
	if not currentVersion then return print("^1Unable to determine current resource version for 'flight_admin' ^0") end

	SetTimeout(200, function()
		PerformHttpRequest('https://api.github.com/repos/Wolphwood/flight_admin/releases/latest', function(status, response)
			if status ~= 200 then return end

			response = json.decode(response)
			if response.prerelease then return end

            local latestMainVersion, latestSuffix = response.tag_name:match('(%d+%.%d+%.%d+)(%-?%w*%d*)');
			local latestVersion = latestMainVersion..latestSuffix

			if not latestVersion or latestVersion == currentVersion then return end

            local cv = { string.strsplit('.', currentVersion) }
            local lv = { string.strsplit('.', latestVersion) }

            for i = 1, #cv do
                local current, minimum = tonumber(cv[i]:match('%d+')), tonumber(lv[i]:match('%d+'))

                if current ~= minimum then
                    if current < minimum then
                        versionData = { currentVersion = currentVersion, url = response.html_url, mainVersion = latestMainVersion, suffix = latestSuffix }
                        return print(("^3An update is available for 'flight_admin' (current version: %s)\r\n%s^0"):format(currentVersion, response.html_url))
                    else break end
                end
            end
		end, 'GET')
	end)
end

if not Config.development then
    checkVersion()
end

lib.callback.register('flight_admin:getVersion', function()
    return versionData
end)