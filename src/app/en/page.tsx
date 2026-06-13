import Link from 'next/link';
export default function HomePageEn() {
  return (
    <>
      INICIO INGLES - ENTRO UN GRINGO MI PERRO
      <br />
      <br />
      <Link
        className='text-blue-600 font-bold'
        href='/en/projects-ar'
      >
        LISTA DE PROYECTOS INGLES
      </Link>
    </>
  );
}
