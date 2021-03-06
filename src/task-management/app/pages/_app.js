import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { QueryClientProvider } from 'react-query';
import { TaskEvent } from '../../../shared/enums';
import queryClient from '../helpers/queryClient';
import Layout from '../components/Layout';
import { SessionProvider } from 'next-auth/react'
import '../styles/global.css';
/** @type {Socket | null} */
let socket = null;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    (async () => {
      socket = io('http://localhost:3001');

      socket.on('connect', () => {
        console.log('connected')

        Object.values(TaskEvent).map(eventName => {
          socket.on(eventName, async (rawEvent) => {
            console.log(`received ${eventName}, rawEvent`);
            console.log('Revalidating tasks');

            queryClient.invalidateQueries('tasks');
          })
        })
      });
    })()

    return () => socket?.disconnect();
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {/* <SessionProvider session={pageProps.session}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </SessionProvider> */}
    </QueryClientProvider>
  );
}

export default MyApp
