import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { ref, computed, reactive } from 'vue';

interface IApiRequestConfig<D> extends AxiosRequestConfig<D> {
    skip?: boolean
}

const apiConfig: AxiosRequestConfig = {
   baseURL: 'http://localhost:3000/api',
   timeout: 2000,
   headers: {
      // "Content-Type": "application/json",
      Accept: 'application/json',
   },
};

const apiAxiosInstance = axios.create(apiConfig);

export const useApi = <T, D>(url: string, config: IApiRequestConfig<D> = { skip: true, ...apiConfig }) => {
   const data = ref<T>();
   const responce = ref<AxiosResponse>();
   const error = ref<unknown>();
   const loading = ref<boolean>(false);

   const errorMsg = computed(() => {
      if (!error.value) return null;

      if ((error.value as AxiosError).response) {
         return (error.value as AxiosError).response?.data?.message;
      } if ((error.value as AxiosError).request) {
         return 'Something went wrong!';
      }
      return (error.value as Error).message;
   });

   const fetch = async () => {
      loading.value = true;

      try {
         const result = await apiAxiosInstance.request({
            url,
            ...config,
         });

         responce.value = result;
         data.value = result.data;
      } catch (e :unknown) {
         error.value = e as Error;
         console.log('Api call error; ', e);
         console.log('Error message; ', errorMsg.value);
      } finally {
         loading.value = false;
      }
   };

   !config.skip && fetch();

   return {
      fetch,
      data,
      responce,
      error,
      loading,
   };
};

// for caching reponces
const cacheMap = reactive<Map<string, AxiosResponse | undefined>>(new Map());

export const useApiCache = <T, D>(key: string, url: string, config: AxiosRequestConfig<D>) => {
   const info = useApi<T, D>(url, { skip: true, ...config });

   const updateApiCache = () => cacheMap.set(key, info.responce.value);
   const clearApiCache = () => cacheMap.delete(key);

   const fetch = async () => {
      try {
         await info.fetch();
         updateApiCache();
      } catch (error) {
         clearApiCache();
      }
   };

   const responce = computed(() => cacheMap.get(key));

   const data = computed(() => info.responce.value?.data);

   return {
      responce,
      data,
      fetch,
      updateApiCache,
      clearApiCache,
   };
};
