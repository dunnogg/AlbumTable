import { defineStore } from 'pinia';
import axios from 'axios';

const STORAGE_KEYS = {
    ALBUMS: 'albums',
    ALBUM_IDS: 'albumsids',
    LOADED_ALBUMS: 'loadedalbums'
};

const getLocalStorageItem = (key: string, defaultValue: any = '') => {
    const item = localStorage.getItem(key);
    try {
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const useAlbumsStore = defineStore('albumsStore', {
    state: () => ({
        albums: getLocalStorageItem(STORAGE_KEYS.ALBUMS, []),
        albumIds: localStorage.getItem(STORAGE_KEYS.ALBUM_IDS) || '',
        loadedAlbums: getLocalStorageItem(STORAGE_KEYS.LOADED_ALBUMS, [])
    }),
    actions: {
        async sendRequest(albumIds: string) {
            this.albumIds = albumIds;
            localStorage.setItem(STORAGE_KEYS.ALBUM_IDS, albumIds);
            const params = albumIds.split(' ').map((id: string) => `albumId=${id}`).join('&');
            const url = `https://jsonplaceholder.typicode.com/photos?${params}`;

            try {
                const response = await axios.get(url);
                this.albums = response.data;
                localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(this.albums));
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        },
        setLoadedAlbums(albums: any) {
            this.loadedAlbums = albums;
            localStorage.setItem(STORAGE_KEYS.LOADED_ALBUMS, JSON.stringify(albums));
        }
    }
});
