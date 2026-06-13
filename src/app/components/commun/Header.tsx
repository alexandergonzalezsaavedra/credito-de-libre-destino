'use client';
import { useState } from 'react';
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
} from '@heroui/react';

import { IconPasswordUser } from '@tabler/icons-react';
import LogoBrand from './LogoBrand';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className='mb-6'>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
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
              href='/registro'
              variant='light'
              radius='full'
            >
              Regístrate
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
