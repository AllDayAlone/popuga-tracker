import { signOut } from 'next-auth/react';

export default function Signout() {
  return null;
}

export const getServerSideProps = async (context) => {
  signOut();

  return {
    props: {},
    redirect: {
      permanent: false,
      destination: '/'
    }
  }
}