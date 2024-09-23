import { useState } from 'react';
import axios from 'axios'; // Import axios

import { Modal, Typography, Box, Input, Slide, Button, InputAdornment, ClickAwayListener, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
// @mui
// utils
import cssStyles from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
import { SearchUrl } from "../../../components/Url";
import useAuth from '../../../hooks/useAuth';
// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#ffffff !important', // Force the background to white
  border: '2px solid #000',
  boxShadow: theme.customShadows.z8,
  padding: theme.spacing(4),
  outline: 'none',
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [isOpen, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    // Make a POST request to search for users
    axios.post(SearchUrl, {
      search: query,
      email: user.user.email,
    })
      .then(response => {
        setSearchResults(response.data.search); // Use response.data.search
        setOpen(false); // Close the slide
        setIsModalOpen(true); // Open the modal
        console.log(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchResults([]);
    setQuery('');
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon={'eva:search-fill'} width={20} height={20} />
          </IconButtonAnimate>

          <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
            <SearchbarStyle>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon={'eva:search-fill'}
                      sx={{ color: 'text.disabled', width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </SearchbarStyle>
          </Slide>
        </div>
      </ClickAwayListener>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <ListItem key={result.user_id}>
                  <Avatar 
                    alt={`${result.first_name} ${result.last_name}`}
                    src={`/path/to/profile/pictures/${result.profile_picture}`} // Adjust the path as needed
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText
                    primary={`${result.first_name} ${result.last_name}`}
                    secondary={`User ID: ${result.user_id}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No results found.</Typography>
            )}
          </List>
        </ModalContent>
      </Modal>
    </>
  );
}