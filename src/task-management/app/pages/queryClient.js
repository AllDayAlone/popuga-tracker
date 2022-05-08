import { QueryClient } from 'react-query';

const defaultQueryFn = async ({ queryKey }) => {
  const res = await fetch(`/api/${queryKey[0]}`);
  const data = await res.json();

  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

export default queryClient;