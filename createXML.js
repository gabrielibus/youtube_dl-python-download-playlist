const { getVideosArray, newPlaylist, writePlayList } = require('./digest/digest');
const PLAYLIST_NAME = process.env.PLAYLIST_NAME.trim();

getVideosArray((videos) => {
    let playlist = newPlaylist(PLAYLIST_NAME, videos);
    writePlayList(PLAYLIST_NAME, playlist);
}, PLAYLIST_NAME);


