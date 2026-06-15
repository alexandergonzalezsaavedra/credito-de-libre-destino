'use client';
import { useEffect, useState } from 'react';
import {
  Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem,
  NavbarMenu, NavbarContent, NavbarItem, Button, Link,
} from '@heroui/react';
import {
  IconCreditCardPay, IconUserPlus, IconUser, IconLogout,
  IconClipboardList, IconLogin,
} from '@tabler/icons-react';
import LogoBrand from './LogoBrand';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { useTheme } from 'next-themes';
import { setThemeSlice } from '@/app/store/commun/selectThemeSlice';
import { cerrarSesion, guardarPerfil, type UsuarioPerfil } from '@/app/store/usuario/usuarioSlice';
import { registrarSesionUsuario } from '@/app/store/sesiones/sesionesSlice';
import { limpiarSolicitud } from '@/app/store/solicitud/solicitudSlice';
import { limpiarAudit } from '@/app/store/audit/auditSlice';
import { useRouter } from 'next/navigation';
import ModalIngreso from './ModalIngreso';

function ThemeButton({ isDark, onPress }: { isDark: boolean; onPress: () => void }) {
  return (
    <Button
      isIconOnly radius='full' color='default' variant='light' size='sm'
      onPress={onPress}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </Button>
  );
}

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const storageTheme = useAppSelector(state => state.themeSlected.themeSelected);
  const usuario = useAppSelector(s => s.usuario);

  useEffect(() => {
    if (storageTheme) setTheme(storageTheme);
  }, [storageTheme, setTheme]);

  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalIngresoOpen, setModalIngresoOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted && theme === 'dark';
  const isLoggedIn = mounted && !!usuario.numeroDocumento;

  const handleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    dispatch(setThemeSlice(newTheme));
    localStorage.setItem('themeSelected', JSON.stringify(newTheme));
  };

  const handleSolicitar = () => {
    dispatch(limpiarSolicitud());
    dispatch(limpiarAudit());
    setIsMenuOpen(false);
    router.push('/solicitar-credito');
  };

  const handleCerrarSesion = () => {
    dispatch(cerrarSesion());
    setIsMenuOpen(false);
    router.push('/');
  };

  function handleLoginSuccess(perfil: UsuarioPerfil) {
    dispatch(guardarPerfil(perfil));
    dispatch(registrarSesionUsuario(perfil));
    setModalIngresoOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className='sticky top-0 z-50 shadow-sm'>
        <Navbar
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className='bg-white dark:bg-black'
          position='static'
        >
          {/* Logo */}
          <NavbarContent justify='start'>
            <NavbarBrand><LogoBrand /></NavbarBrand>
          </NavbarContent>

          {/* Desktop actions */}
          <NavbarContent className='hidden sm:flex gap-1' justify='end'>
            {isLoggedIn ? (
              <>
                <NavbarItem>
                  <Button
                    as={Link} href='/perfil'
                    color='default' variant='light' radius='full' size='sm'
                    startContent={<IconUser size={15} />}
                  >
                    {usuario.nombres.split(' ')[0]}
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={Link} href='/historial'
                    color='default' variant='light' radius='full' size='sm'
                    startContent={<IconClipboardList size={15} />}
                  >
                    Mis solicitudes
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    color='danger' variant='light' radius='full' size='sm'
                    onPress={handleCerrarSesion}
                    startContent={<IconLogout size={15} />}
                  >
                    Cerrar sesión
                  </Button>
                </NavbarItem>
              </>
            ) : (
              <>
                <NavbarItem>
                  <Button
                    color='default' variant='light' radius='full' size='sm'
                    startContent={<IconLogin size={15} />}
                    onPress={() => setModalIngresoOpen(true)}
                  >
                    Iniciar sesión
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={Link} href='/perfil'
                    color='primary' variant='light' radius='full' size='sm'
                    startContent={<IconUserPlus size={15} />}
                  >
                    Registrate
                  </Button>
                </NavbarItem>
              </>
            )}
            <NavbarItem>
              <Button
                color='primary' variant='flat' radius='full' size='sm'
                endContent={<IconCreditCardPay size={15} />}
                onPress={handleSolicitar}
              >
                Solicitar ahora
              </Button>
            </NavbarItem>
            <NavbarItem>
              <ThemeButton isDark={isDark} onPress={handleTheme} />
            </NavbarItem>
          </NavbarContent>

          {/* Móvil: solicitar ahora + tema + hamburguesa */}
          <NavbarContent className='sm:hidden' justify='end'>
            <Button
              color='primary' variant='flat' radius='full' size='sm'
              endContent={<IconCreditCardPay size={14} />}
              onPress={handleSolicitar}
            >
              Solicitar
            </Button>
            <ThemeButton isDark={isDark} onPress={handleTheme} />
            <NavbarMenuToggle aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} />
          </NavbarContent>

          {/* Menú desplegable móvil */}
          <NavbarMenu className='pt-2'>
            {isLoggedIn ? (
              <>
                <NavbarMenuItem>
                  <Link
                    href='/perfil'
                    className='flex items-center gap-3 w-full py-3 text-base font-medium border-b border-gray-100 dark:border-white/10'
                    color='foreground'
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <IconUser size={18} className='text-primary/70' />
                    {usuario.nombres} {usuario.apellidos}
                  </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link
                    href='/historial'
                    className='flex items-center gap-3 w-full py-3 text-base font-medium border-b border-gray-100 dark:border-white/10'
                    color='foreground'
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <IconClipboardList size={18} className='text-primary/70' />
                    Mis solicitudes
                  </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <button
                    className='flex items-center gap-3 w-full py-3 text-base font-medium text-danger'
                    onClick={handleCerrarSesion}
                  >
                    <IconLogout size={18} />
                    Cerrar sesión
                  </button>
                </NavbarMenuItem>
              </>
            ) : (
              <>
                <NavbarMenuItem>
                  <button
                    className='flex items-center gap-3 w-full py-3 text-base font-medium border-b border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200'
                    onClick={() => { setIsMenuOpen(false); setModalIngresoOpen(true); }}
                  >
                    <IconLogin size={18} className='text-primary/70' />
                    Iniciar sesión
                  </button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Link
                    href='/perfil'
                    className='flex items-center gap-3 w-full py-3 text-base font-medium border-b border-gray-100 dark:border-white/10'
                    color='foreground'
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <IconUserPlus size={18} className='text-primary/70' />
                    Registrate
                  </Link>
                </NavbarMenuItem>
              </>
            )}
            <NavbarMenuItem>
              <button
                className='flex items-center gap-3 w-full py-3 text-base font-semibold text-primary'
                onClick={handleSolicitar}
              >
                <IconCreditCardPay size={18} />
                Solicitar ahora
              </button>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </header>

      <ModalIngreso
        isOpen={modalIngresoOpen}
        onClose={() => setModalIngresoOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
