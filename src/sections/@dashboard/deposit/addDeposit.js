import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Stepper, Step, StepLabel, Typography, TextField, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import { checkUrl, optionsUrl, DepositAPI } from "../../../components/Url";

const AddDeposit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact: '',
    deposit_amount: 0,
    investment_class: '',
    ic_id: '' // Store ic_id
  });
  const [investmentClasses, setInvestmentClasses] = useState([]);

  const steps = ['Enter user Phone/Email', 'Select Investment Class', 'Enter Amount'];

  const { user, logout } = useAuth();
  const userData = user.user;

  // Step 1: Check if user exists
  const checkUserExists = async () => {
    setLoading(true);
    try {
      const response = await axios.post(checkUrl, { contact: formData.contact });
      setLoading(false);

      if (response.data.exists) {
        await fetchInvestmentClasses(); // Fetch investment classes if user exists
        handleNext(); // Go to the next step
      } else {
        alert('User does not exist');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('Error checking user existence');
    }
  };

  // Fetch available investment classes from the API
  const fetchInvestmentClasses = async () => {
    try {
      const response = await axios.post(optionsUrl, {
        email: userData?.email,
      });
      console.log(response.data.myclasses);
      setInvestmentClasses(response.data.myclasses); // Assuming the API response contains investment classes
    } catch (error) {
      console.error('Error fetching investment classes', error);
    }
  };

  // Step 3: Submit the form
  const submitForm = async () => {
    const postData = {
      payment_means: 'online',
      deposit_amount: formData.deposit_amount,
      investment_id: formData.ic_id, // Use ic_id for the investment
      currency: getCurrency(),
      investment_option: formData.investment_class,
      investment_class: formData.ic_id, // Use the selected investment class
      deposit_category: 'personal',
      account_type: 'personal',
      reference: 'cyanase-fund',
      reference_id: 0,
      tx_ref: 'CYANASE-TEST-001',
    };

    const token = '00a65091db77d45551ca88581e44b79c684c1c28';

    try {
      const resp = await axios.post(DepositAPI, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
          "Authorization": `Token ${token}`, // Include the token in the headers
        },
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
      alert('Error submitting deposit');
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle investment class and ic_id selection
  const handleInvestmentChange = (e) => {
    const selectedOption = investmentClasses.find(option => option.id === e.target.value);
    setFormData({
      ...formData,
      investment_class: selectedOption.id,  // Set the investment class
      ic_id: selectedOption.ic_id           // Set the corresponding ic_id
    });
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <TextField
              label="Phone or Email"
              variant="outlined"
              name="contact"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={checkUserExists}
              disabled={loading || !formData.contact}
            >
              {loading ? <CircularProgress size={24} /> : 'Next'}
            </Button>
          </div>
        );
      case 1:
        return (
          <div>
            <FormControl fullWidth margin="normal">
              <InputLabel>Investment Class</InputLabel>
              <Select
                name="investment_class"
                value={formData.investment_class}
                onChange={handleInvestmentChange} // Use updated change handler
              >
                {investmentClasses.map((investmentClass, index) => (
                  <MenuItem key={index} value={investmentClass.id}>
                    {investmentClass.oname} - {investmentClass.cname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!formData.investment_class}
              style={{ marginLeft: '10px' }}
            >
              Next
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <TextField
              label="Deposit Amount"
              variant="outlined"
              name="deposit_amount"
              type="number"
              fullWidth
              margin="normal"
              onChange={handleChange}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={submitForm}
              style={{ marginLeft: '10px' }}
              disabled={!formData.deposit_amount}
            >
              Submit
            </Button>
          </div>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <div>
      {!showForm && (
        <Button variant="contained" color="primary" onClick={handleShowForm}>
          Add deposit
        </Button>
      )}

      {showForm && (
        <div>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            {activeStep === steps.length ? (
              <Typography>Process Completed</Typography>
            ) : (
              renderStepContent(activeStep)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Function to get currency
const getCurrency = () => {
  return 'USD'; // Replace with your actual currency function logic
};

export default AddDeposit;
