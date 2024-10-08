import { Badge, useColorModeValue } from '@chakra-ui/react';

const RenderBadge = ({ label, value, colorScheme, onClick }: { label: string, value: string, colorScheme: string, onClick: (value: string) => void }) => {
  return (
    <Badge
      key={`${label}-${value}`}
      variant='outline'
      colorScheme={colorScheme}
      px={2}
      py={1}
      ml={1}
      my={1}
      borderRadius='full'
      bg={useColorModeValue('gray.50', 'gray.800')}
      fontWeight='400'
      _hover={{ cursor: 'pointer' }}
      onClick={() => onClick(value)}
    >
      {value ? value : 'Unknown'}
    </Badge>
  );
};

export default RenderBadge;
