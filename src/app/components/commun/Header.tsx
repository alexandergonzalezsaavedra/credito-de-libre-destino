'use client';
import { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  useDisclosure,
} from '@heroui/react';

import { IconPasswordUser } from '@tabler/icons-react';
import LogoBrand from './LogoBrand';
import { Moon, Sun } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../store';
import { useTheme } from 'next-themes';
import { setThemeSlice } from '@/app/store/commun/selectThemeSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const storageTheme = useAppSelector(
    (state) => state.themeSlected.themeSelected,
  );

  useEffect(() => {
    if (storageTheme) {
      setTheme(storageTheme);
    }
  }, [storageTheme, setTheme]);

  const isDark = theme === 'dark';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isOpen, onOpenChange } = useDisclosure();
  const handleCloseMenus = () => {
    setIsMenuOpen(false);
    if (isOpen) {
      onOpenChange();
    }
  };

  const handleClick = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    dispatch(setThemeSlice(newTheme));
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeSelected', JSON.stringify(newTheme));
    }
    handleCloseMenus();
  };

  return (
    <header className='sticky top-0 z-50 shadow-sm'>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className='bg-white dark:bg-black'
        position='static'
      >
        <NavbarContent
          className='sm:hidden pr-3'
          justify='center'
        >
          <NavbarBrand>
            <LogoBrand />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className='hidden sm:flex gap-4'
          justify='center'
        >
          <NavbarBrand>
            <LogoBrand />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify='center'>
          <NavbarItem>
            <Button
              as={Link}
              color='primary'
              href='/solicitar-credito'
              variant='light'
              radius='full'
            >
              Solicitalo ahora
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              color='primary'
              href='/ingreso'
              variant='flat'
              radius='full'
            >
              Ingresar
              <IconPasswordUser size={16} />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              isIconOnly
              radius='full'
              color='default'
              variant='light'
              onPress={handleClick}
              aria-label={
                isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
              }
              size='sm'
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          className='sm:hidden'
          justify='end'
        >
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent>

        {/* Menu desplegable móviles */}
        <NavbarMenu>
          <NavbarMenuItem>
            <Link
              className='w-full'
              color='primary'
              href='#'
              size='lg'
            >
              Inicio
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </header>
  );
};

export default Header;
