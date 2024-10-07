// @mui
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  Tooltip,
  Typography,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
// _mock_
import UserData from '../../../../_mock/data';

// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

export default function BankingContacts() {
  const [summary, setSummary] = useState([]);
  const [organisedData, setOrganisedData] = useState({});
  const [Numbers, setNumber] = useState(0);

  const { data: userData } = UserData();

  const userDataInfo = userData;

  useEffect(() => {
    if (userDataInfo) {
      const via = userDataInfo.summary || [];
      setNumber(via.length || 0);
      setSummary(via);

      // Assuming userDataInfo.organisedData is structured as { "Stocks": [{}, {}], "Real estate": [{}] }
      setOrganisedData(userDataInfo.organisedData || {});
    }
  }, [userData, userDataInfo]);

  // Define the table headers in the correct order
  const tableHeaders = [
    'Opening Balance (UGX)',
    'Deposit Amount (UGX)',
    'Interest (%)',
    'Management Fee (UGX)',
    'Performance Fee (UGX)',
    'Withdraw Amount (UGX)',
    'Closing Balance (UGX)',
    'Created Date',
  ];

  return (
    <Card>
      <CardHeader
        title="Investor Summary"
        subheader={`Made ${Numbers} investment(s)`}
        action={
          <Tooltip title="Add Contact">
            <IconButton color="primary" size="large">
              <Iconify icon={'eva:plus-fill'} width={20} height={20} />
            </IconButton>
          </Tooltip>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* Render summary cards */}
        {summary.map((contact, index) => (
          <Stack direction="row" alignItems="center" key={index}>
            <Box sx={{ flexGrow: 1, ml: 2, minWidth: 100 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} noWrap>
                {contact.investmentoption}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                Deposit: UGX {contact.total_investment}
              </Typography>
            </Box>

            <Tooltip title="Quick Transfer">
              <IconButton size="small">
                <Iconify icon={'eva:flash-fill'} width={22} height={22} />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}

        {/* Render dynamic tables for each investment class */}
        {Object.keys(organisedData).map((option, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {option} Investments
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organisedData[option].map((item, itemIndex) => (
                    <TableRow key={itemIndex}>
                      <TableCell>{item.opening_balance}</TableCell>
                      <TableCell>{item.deposit_amount}</TableCell>
                      <TableCell>{item.interest}</TableCell>
                      <TableCell>{item.management_fee}</TableCell>
                      <TableCell>{item.performance_fee}</TableCell>
                      <TableCell>{item.withdraw_amount}</TableCell>
                      <TableCell>{item.closing_balance}</TableCell>
                      <TableCell>{item.created}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}