const { exec } = require('child_process');

const execute = (command, next) => {
    exec(command, (err, stdout, stderr) => {
        if (err) next(err);
        if (stderr) next(stderr);
        if (stdout) next(stdout);
    })
};

let url = "https://www.youtube.com/playlist?list=PLjH_UcN_0UZdeMwReIWThEluGqrEVEOao";
let path = 'files';
let downloadOptions = {
    "get-description": true,
    "continue": true,
    "no-overwrites": true,
    "ignore-errors": true,
    "download-archive": 'log.txt',
    'output': `"${path}/%(playlist_index)s - %(duration)s - %(id)s.%(ext)s"`,
    "format": 'best',
};

const createCommand = (opts) => {
    let startCommand = `start "" youtube-dl`;
    Object.entries(opts).forEach(opt => {
        startCommand = startCommand + ` --${opt[0]}` + `${opt[1] === true ? "" : ` ${opt[1]}`}`;
    })
    return startCommand;
}

const command = createCommand(downloadOptions);
const playlistLength = 1;

console.log('\nLa playlist se está descargando en este momento. Por favor sea paciente. Una vez finalizada la descarga, puede ejecutar: node createXML.js\n')

for (let i in Array(playlistLength * 1 + 1).fill(1)) {
    // console.log(`${command} --playlist-items ${i * 1 + 1} ${url}`, console.log())
    console.log(`${command} --playlist-items ${i * 1 + 1} ${url}`, console.log())
    // execute(`${command} --playlist-items ${i * 1 + 1} ${url}`, console.log())
}

// console.log(command)


//     for (let i in Array(playlistLength).fill(0)) {
//     command = `start "" youtube-dl --continue --no-overwrites --ignore-errors --download-archive log.txt --output "files/%(playlist_index)s - %(duration)s - %(id)s.%(ext)s" --format best --playlist-start ${startNumber} ${url}`
//     execute(command, execute(command, console.log))
// }
// command = `start "" youtube-dl -cw --ignore-errors  --download-archive log.txt --output "files/%(playlist_index)s - %(duration)s - %(id)s.%(ext)s" --format best --playlist-start ${startNumber} ${url}`
// command = `start "" youtube-dl --get-url ${url} > sample.txt`
// execute(command + " " + url, console.log())



