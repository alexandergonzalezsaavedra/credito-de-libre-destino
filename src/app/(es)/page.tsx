import Link from 'next/link';
export default function HomePageEs() {
  return (
    <>
      INICIO ESPAÑOL
      <br />
      <br />
      <Link
        className='text-blue-600 font-bold'
        href='/proyectos-ar'
      >
        LISTA DE PROYECTOS
      </Link>
    </>
  );
}
