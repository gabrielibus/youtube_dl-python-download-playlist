const fs = require('fs');
const { exec } = require('child_process');

// const url = "https://youtube.com/playlist?list=PLjH_UcN_0UZd7YmpB5pwaa4AI6LZ5z_jk";

const digest = {
    newPlaylist: (playlistName, videos) => {
        const path = `file:///D:/${playlistName}/`
        let playlistHeader = `<?xml version="1.0" encoding="UTF-8"?>
<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/" version="1">
<title>${playlistName}</title>
<trackList>`;

        let playlistBody = (Object.values(videos).map((e, idx) => {
            return `
    <track>
        <location>${path}${e.filename}</location>
        <duration>${e.duration}</duration>
        <extension application="http://www.videolan.org/vlc/playlist/0">
            <vlc:id>${idx}</vlc:id>
        </extension>
    </track>`
        })).join('');

        let videosQty = Object.values(videos).map((e, idx) => `<vlc:item tid="${idx}"/>
        `).join('');

        let playlistFooter = `
</trackList>
<extension application="http://www.videolan.org/vlc/playlist/0">
    ${videosQty}
</extension>
</playlist>    
`
        let exportPlaylist = playlistHeader + playlistBody + playlistFooter;
        return exportPlaylist;
    },
    getVideosArray: (next, playlistName) => {
        let videos;
        try {
            exec(`dir /B ${playlistName}`, (err, files, stderr) => {
                if (err) console.log(err);
                if (stderr) console.log(stderr);
                if (files) {
                    files = files.replace(/\r\n/gi, ',').split(',')
                    videos = files.map(e => {
                        let name = e.slice(10, e.length - 4);
                        let position = e.split(' - ')[0];
                        let duration = e.split(' - ')[1] * 1000;
                        return {
                            name,
                            position,
                            duration,
                            filename: e
                        }
                    })
                    next(videos)
                };
            });
        }
        catch
        {
            exec(`cd ${playlistName} && find . -iname "*.*" -type f`, (err, files, stderr) => {
                if (err) console.log(err);
                if (stderr) console.log(stderr);
                if (files) {
                    files = files.replace(/\r\n/gi, ',').replace('./', '').split(',')
                    videos = files.map(e => {
                        let name = e.slice(10, e.length - 4);
                        let position = e.split(' - ')[0];
                        let duration = e.split(' - ')[1] * 1000;
                        return {
                            name,
                            position,
                            duration,
                            filename: e
                        }
                    })
                    next(videos)
                };
            })
        }
    },
    getDurationArray: () => {
        let durationArray = fs.readFileSync('duration.txt', { encoding: 'utf8', flag: 'r' });
        durationArray = durationArray.split('\n').map(e => e.split(':')[0] * 60 + e.split(':')[1]);
        durationArray.pop();
        return durationArray;
    },
    writePlayList: (playlistName, playlist) => {
        try {
            fs.writeFileSync(`${playlistName}.xspf`, playlist, { flag: 'w' });
            console.log(`archivo ${playlistName}.xspf fue creado con éxito`);
        }
        catch (error) {
            console.log('error escribiendo el archivo');
        };
    }
}

module.exports = digest;