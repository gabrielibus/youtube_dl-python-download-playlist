import os
import re

start_command = 'youtube-dl'
playlist_length = 0
playlist_name = ""
url = input(
    'Por favor ingrese la URL de la playlist. Ésta se descargará en su respectivo directorio:\n')

def get_playlist_lenght_and_name():
    global start_command
    global url
    return os.system(start_command + " --flat-playlist " + url + " > temp")


get_playlist_lenght_and_name()

with open('./temp') as file:
    lines = file.readlines()
    playlist_length = lines[6].split(' ')[-1]
    playlist_name = lines[1].split('Downloading playlist:')[-1].strip()
    playlist_name = re.sub(
        r'[^A-Za-z0-9\s]', '', playlist_name).strip().replace(" ", "_").strip()
    if int(playlist_name[:1]):
        playlist_name = playlist_name[2:]

download_options = {
    "continue": True,
    "no-overwrites": True,
    "ignore-errors": True,
    "download-archive": 'log.txt',
    'output': '"' + playlist_name + '/%(playlist_index)s - %(duration)s - %(id)s.%(ext)s"',
    "format": 'best',
    "age-limit": "99",
    'geo-bypass': True,
    "no-check-certificate": True
}


def create_command():
    for key in download_options:
        global start_command
        start_command = (start_command + ' --' + key) + \
            ('' if download_options[key] ==
             True else (' ' + download_options[key]))
    return(start_command)


command = create_command()

# AQUÍ debe ir la validación de los videos que faltan, para no volver a correr las 104 instancias
complete_videos = []
try:
    for file in os.listdir(playlist_name):
        file_extension = file[-3:]
        if file_extension == 'mp4':
            complete_videos.append(file.split(' ')[0])
        else:
            pass
            # try:
            #     # for unix
            #     os.system('rm ' + playlist_name + "/" + str(file))
            # except:
            #     # for cmd
            #     os.system('del ' + playlist_name + "\\" + file)
except:
    pass



if len(complete_videos) != 0:
    for i in range(int(playlist_length) + 1):
        if complete_videos.count(str(i + 1)) == 0 and i != range(int(playlist_length) + 1)[-1]:
            os.system( command + ' --playlist-items ' + str(i + 1) + " " + url)
            print('falta el video: ' + str(i + 1))
            # os.system('start ' + command + ' --playlist-items ' + str(i + 1) + " " + url)
    try:
        XLM_command = 'SET PLAYLIST_NAME=' + playlist_name + " && " + 'node createXML.js'
        os.system(XLM_command)
    except:
        XLM_command = 'PLAYLIST_NAME=' + playlist_name + ' node createXML.js'
        os.system(XLM_command)
else:
    for i in range(int(playlist_length) + 1):
        if complete_videos.count(str(i + 1)) == 0 and i != range(int(playlist_length) + 1)[-1]:
            os.system('start "" ' + command + ' --playlist-items ' + str(i + 1) + " " + url)

# no borrar los números de la playlist, sino solo los primeros.