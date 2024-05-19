import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
  } from '@chakra-ui/react';
  import React, { useRef } from 'react';
  
  interface DeletePetConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    pet: { _id: string; name: string };
    handleDeletePet: (id: string) => void;
  }
  
  const DeletePetConfirmation: React.FC<DeletePetConfirmationProps> = ({
    isOpen,
    onClose,
    pet,
    handleDeletePet,
  }) => {
    const cancelRef = useRef<HTMLButtonElement>(null);
  
    return (
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
  
        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete the following pet? <br />
            Pet name: {pet.name} <br />
            Pet id: {pet._id}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='red' ml={3} onClick={() => handleDeletePet(pet._id)}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default DeletePetConfirmation;
  