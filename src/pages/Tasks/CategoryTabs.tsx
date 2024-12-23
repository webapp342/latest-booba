
import { Box, Typography, Badge } from '@mui/material';
import { categories } from './categories';

interface CategoryTabsProps {
  selectedCategory: number;
  onSelectCategory: (id: number) => void;
}

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        marginTop: 4,
        padding: 2,
        ml: -3,
        width: '100%',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {categories.map((category) => (
        <Badge
          key={category.id}
          color="success"
          badgeContent=" "
          invisible={![1, 2, 3].includes(category.id)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            margin: '0 15px',
            '& .MuiBadge-badge': {
              height: '12px',
              minWidth: '12px',
              borderRadius: '6px',
            },
          }}
        >
          <Typography
            onClick={() => onSelectCategory(category.id)}
            sx={{
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: selectedCategory === category.id ? 'black' : 'gray',
              fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
              textDecoration: 'none',
            }}
          >
            {category.name}
          </Typography>
        </Badge>
      ))}
    </Box>
  );
}