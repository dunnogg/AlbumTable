<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Input} from '@/components/ui/input'
import {onMounted, ref, nextTick} from "vue";
import {useThemeStore} from "@/stores/useThemeStore.ts";
import {useAlbumsStore} from "@/stores/useAlbumsStore.ts";

const albumsStorage = useAlbumsStore();
const albumValue = ref(albumsStorage.albumIds)
const allImages = ref<any[]>(albumsStorage.albums);
const images = ref<any[]>(albumsStorage.loadedAlbums);
const tableContainer = ref<HTMLElement | null>(null)
const themeStorage = useThemeStore()
const theme = ref(themeStorage.theme);
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  themeStorage.setTheme(theme.value)

  if (theme.value === "dark") {
    document.documentElement.style.colorScheme = 'dark';
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = 'light';

  }
};

onMounted(() => {
  theme.value = themeStorage.theme || "light";

      if (theme.value === "dark") {
    document.documentElement.style.colorScheme = theme.value;
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = 'light';
  }
});

const sendRequest = async () => {
  images.value = [];
  try {
      await albumsStorage.sendRequest(albumValue.value)
      allImages.value = albumsStorage.albums
      images.value = allImages.value.slice(0, 30);
      await nextTick();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
};

const loadMore = () => {
  const currentLength = images.value.length;
  const nextItems = allImages.value.slice(currentLength, currentLength + 20);

  if (nextItems.length > 0) {
    images.value = [...images.value, ...nextItems];
    albumsStorage.setLoadedAlbums(images.value)
  }
};

const handleScroll = () => {
  if (!tableContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = tableContainer.value;
  const isBottom = (scrollTop + clientHeight) >= scrollHeight;
  if (isBottom) {
    loadMore();
  }
};


</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-[6px]">
    <div class="flex flex-row w-[600px] gap-[6px]">
      <Button class="w-full" @click.stop="sendRequest">Поиск</Button>
      <Button class="w-full" @click.stop="toggleTheme">Сменить цветовую схему</Button>
    </div>
    <Input class="w-[600px]" v-model="albumValue"></Input>

    <div ref="tableContainer"  class="overflow-y-scroll w-[600px] h-[600px] " @scroll="handleScroll" >
      <Table >
        <TableHeader class="sticky top-0 z-10">
          <TableRow>
            <TableHead>
              Ид
            </TableHead>
            <TableHead>Альбом</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>
              Ссылка
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="image in images" :key="image.id">
            <TableCell class="font-medium">
              {{ image['id'] }}
            </TableCell>
            <TableCell>{{ image['albumId'] }}</TableCell>
            <TableCell>{{ image['title'] }}</TableCell>
            <TableCell class="text-left">
              {{ image['url'] }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
