import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Grid,
} from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import AddDeposit from '../../sections/@dashboard/deposit/addDeposit';
import { getDepositUrl, SingleInvestMoneyUrl } from '../../components/Url';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { FundHead } from '../../sections/@dashboard/user/list';
import { EcommerceLatestProducts } from '../../sections/@dashboard/general/e-commerce';

const TABLE_HEAD = [
  { id: 'name', label: 'Full name', alignRight: false },
  { id: 'company', label: 'Investment option', alignRight: false },
  { id: 'role', label: 'Amount', alignRight: false },
  { id: 'isVerified', label: 'Invest', alignRight: false },

];

const Deposit = () => {
  const { user } = useAuth();
  const { themeStretch } = useSettings();

  const [Option, setOption] = useState([]);
  const [OptionUsers, setOptionUsers] = useState([]);
  const [authorizeStates, setAuthorizeStates] = useState({});
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // State to track how many users to show

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(getDepositUrl, {
          email: user.user.email,
        });
        setOptionUsers(response.data.fundData);
      
        setOption(response.data.depositData);
      } catch (error) {
        console.error('Error making POST request:', error.message);
      }
    };
    fetchData();
  }, [user.user.email]);

  const handleWithdraw = (itemId, amountz, classz) => {
    setAuthorizeStates((prevState) => ({
      ...prevState,
      [itemId]: true,
    }));

    axios
      .post(SingleInvestMoneyUrl, {
        class_id: classz,
      amount: amountz,
      deposit_id: itemId,
      })
      .then((response) => {
        setAuthorizeStates((prevState) => ({
          ...prevState,
          [itemId]: false,
        }));
       
       window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
        setAuthorizeStates((prevState) => ({
          ...prevState,
          [itemId]: false,
        }));
      });
  };

  const handleOpenModalz = (rowId) => {
    const filteredData = OptionUsers.filter((item) => item.investment_option_id === rowId);
    setOptionUsers(filteredData);
    setOpen(!open);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const loadMoreUsers = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Load 10 more users
  };

  const isNotFound = !Option.length;

  return (
    <Page title="Funds: withdraw list">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h5" component="h1" gutterBottom>
        Incoming  deposits
        </Typography>
        <AddDeposit />
        <Card>
          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts />
          </Grid>
          <br />
          <br />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <FundHead order="asc" orderBy="name" headLabel={TABLE_HEAD} rowCount={Option.length} />
                <TableBody>
                  {Option.slice(0, visibleCount).map((item, index) => (
                    <TableRow hover key={index}>
                      <TableCell align="left">{item.first_name} {item.last_name}</TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="left">{item.currency} {item.deposit_amount}</TableCell>
                      <TableCell align="left">
                        <Button
                          onClick={() => handleWithdraw(item.id, item.deposit_amount, item.class)}
                          variant="contained"
                          color="primary"
                          disabled={authorizeStates[item.id] || false}
                        >
                          {authorizeStates[item.id] ? 'Processing...' : 'Authorize'}
                        </Button>
                      </TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery="" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          {Option.length > visibleCount && (
            <Button onClick={loadMoreUsers} sx={{ margin: '20px auto', display: 'block' }}>
              See More
            </Button>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default Deposit;