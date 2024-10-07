import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Table,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  TextField,Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';
import { Country } from '../../components/Country';
import { addUserUrl } from '../../components/Url';
// @mui hg
// import { useTheme } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { useUserListed } from '../../_mock/_user';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'Phone', label: 'Phone number', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },

  { id: 'in', label: 'Investment class', alignRight: false },
    { id: 'op', label: 'opening balance', alignRight: false },
    { id: 'od', label: 'Deposit', alignRight: false },
     { id: 'int', label: 'Interest', alignRight: false },
     { id: 'pn', label: 'Performance fees', alignRight: false },
     { id: 'in', label: 'Managment fees', alignRight: false },
     { id: 'ip', label: 'Withdraws', alignRight: false },
     { id: 'in', label: 'Closing balance', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  // const theme = useTheme();
  const { themeStretch } = useSettings();
  const userListed = useUserListed();
  const [userList, setUserList] = useState(userListed);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
const steps = ['Personal Information', 'Contact Information', 'Other Details'];
  /* const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  }; */

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

 /*  const handleDeleteUser = (userId) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  }; */

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userList.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUserList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  useEffect(() => {
    const filteredData = applySortFilter(userListed, getComparator(order, orderBy), filterName);
    setFilteredUsers(filteredData);
    setIsDataLoaded(true);
  }, [userListed, filterName, orderBy, order]);

  const isNotFound = !filteredUsers.length && Boolean(filterName);
  
 const seeUser = (id) => {
   
   localStorage.setItem('userid', id);
   window.location.href="/dashboard/user/profile";
   
 }
   const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
 const [loading, setLoading] = useState(false); // For button loading state
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    gender: '',
    email: '',
    phone: '',
    countryCode: '+256', // Default country code
    selectedCountry: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };
    const handleSubmit = async () => {
    setLoading(true); // Set loading state to true
    try {
      const data = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        dob: `${formValues.year}-${formValues.month}-${formValues.day}`,
        gender: formValues.gender,
        email: formValues.email,
        selectedCountry: formValues.selectedCountry,
        password:formValues.password,
        phone: `${formValues.countryCode}${formValues.phone}`, // Combine country code and phone number
      };

    const response =  await axios.post(addUserUrl, data); // Make POST request
      handleClose(); // Close the dialog on success
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
     {/* Fancy Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ fontWeight: 'bold', textTransform: 'uppercase', mt: 2 }}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Add Users
        </Button>

        {/* Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 1: Personal Information */}
            {activeStep === 0 && (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 3 }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 3 }}
                />
<br/>
                <Typography>
                Day, Month, Year 
                </Typography> 
                <TextField
                  label="Day"
                  name="day"
                  value={formValues.day}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  sx={{ mt: 3 }}
                />
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    label="Month"
                    name="month"
                    value={formValues.month}
                    onChange={handleChange}
                  >
                    <MenuItem value="01">January</MenuItem>
                    <MenuItem value="02">February</MenuItem>
                    <MenuItem value="03">March</MenuItem>
                    <MenuItem value="04">April</MenuItem>
                    <MenuItem value="05">May</MenuItem>
                    <MenuItem value="06">June</MenuItem>
                    <MenuItem value="07">July</MenuItem>
                    <MenuItem value="08">August</MenuItem>
                    <MenuItem value="09">September</MenuItem>
                    <MenuItem value="10">October</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">December</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Year"
                  name="year"
                  value={formValues.year}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  sx={{ mt: 3 }}
                />

                {/* Gender */}
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    value={formValues.gender}
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {/* Step 2: Contact Information */}
            {activeStep === 1 && (
              <>
                        <TextField 
          select
          value={formValues.selectedCountry}
          onChange={handleChange}
          name="selectedCountry" 
          label="Country" 
          fullWidth
        >
          {Country.map(country => (
            <MenuItem key={country.countryCode} value={country.country}>{country.country}</MenuItem>
          ))}
        </TextField>
                <TextField
                  label="Email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 3 }}
                />

                {/* Phone Number Input with Country Code */}
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formValues.countryCode}
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter phone number without country code"
                />
              </>
            )}

            {/* Step 3: Review */}
            {activeStep === 2 && (
              <Typography sx={{ mt: 3 }}>
                <strong>Review the details:</strong>
                <br />
                Name: {formValues.firstName} {formValues.lastName}
                <br />
                Date of Birth: {formValues.day}-{formValues.month}-{formValues.year}
                <br />
                Gender: {formValues.gender}
                <br />
                Email: {formValues.email}
                <br />
                Phone: {formValues.countryCode} {formValues.phone}
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Finish'}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </DialogActions>
        </Dialog>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                {isDataLoaded && (
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      const isItemSelected = selected.indexOf(row.last_name) !== -1;

                      return (
                      
                        <TableRow
                          hover
                          key={index}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={() => seeUser(row.user_id)} // Attach click event handler here
  style={{ cursor: 'pointer' }}
                        >
                       
                          <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar alt={row.name} src={`https://server.cyanase.app/media/profile/${row.profile_picture}`} sx={{ mr: 2 }}  />
                            <Typography variant="subtitle2" noWrap>
      {row.first_name}    {row.last_name} 
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{row.phoneno}</TableCell>
                          <TableCell align="left">
                         { row.email}
</TableCell>
                          <TableCell align="left">
                         { row.name}
</TableCell>
                          <TableCell align="left">
                         { row.opening_balance}
</TableCell>
                          <TableCell align="left">
                         { row.deposit_amount}
</TableCell>
                          <TableCell align="left">
                         { row.interest}
</TableCell>
                          <TableCell align="left">
                         { row.performance_fee}
</TableCell>
                          <TableCell align="left">
                         { row.management_fee}
</TableCell>
                          <TableCell align="left">
                         { row.withdraw_amount}
</TableCell>
                          <TableCell align="left">
                         { row.closing_balance}
</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                )}
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.last_name && _user.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}