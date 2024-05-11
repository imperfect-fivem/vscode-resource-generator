fx_version 'cerulean'
game 'gta5'

description "{{description}}"
author "{{author}}"
version "{{version}}"

dependency 'es_extended'

shared_scripts {
	'@es_extended/imports.lua',
	'shared/*.lua'
}

client_scripts {
	'client/*.lua'
}

server_scripts {
	'server/*.lua'
}
