'use client';
import { addToast, Button } from '@heroui/react';

const ButtonToast = () => {
  return (
    <div className='flex flex-wrap gap-2'>
      <Button
        color='success'
        variant={'flat'}
        onPress={() =>
          addToast({
            title: 'Clic creado',
            description: 'Felicidades',
            color: 'success',
          })
        }
      >
        TOAST
      </Button>
    </div>
  );
};

export default ButtonToast;
