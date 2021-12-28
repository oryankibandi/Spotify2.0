import { getProviders, signIn } from 'next-auth/react';

function Login({ providers }) {
  console.log(providers);
  return (
    <div className='flex flex-col bg-black min-h-screen items-center justify-center'>
      <img className='w-52 mb-5' src='https://links.papareact.com/9xl' />

      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            className='bg-[#18D860] text-white p-5 hover:text-black hover:bg-white rounded-full'
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
