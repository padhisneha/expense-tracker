'use client'

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Stack, Typography, Divider, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import Link from 'next/link';

export default function ViewOnly() {
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('all');

  const updateExpenses = async () => {
    const snapshot = query(collection(firestore, 'Expense'));
    const docs = await getDocs(snapshot);
    const expenseList = [];
    docs.forEach((doc) => {
      expenseList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    // Sort expenses by Date in descending order
    expenseList.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    setExpenses(expenseList);
  };

  useEffect(() => {
    updateExpenses();
  }, []);

  const incomeTotal = expenses
    .filter(expense => expense.Amount > 0)
    .reduce((acc, expense) => acc + Number(expense.Amount), 0);
  
  const expenseTotal = expenses
    .filter(expense => expense.Amount < 0)
    .reduce((acc, expense) => acc + Number(expense.Amount), 0);

    // Filtered expenses based on the selected view
  const filteredExpenses = expenses.filter(expense => {
    if (view === 'income') return expense.Amount > 0;
    if (view === 'expense') return expense.Amount < 0;
    return true; // 'all' view shows both income and expenses
  });


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f7f7f7"
      sx={{ scrollBehavior: 'smooth' }} // Add smooth scrolling
    >
      <p>&nbsp;</p>
      <Box width="500px">
        <Typography variant="h4" align="center" color="#192bc2" gutterBottom>
        JPNV Block 1 Cultural Fund
        </Typography>
        
        {/* Balance Section */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h6">Your Balance</Typography>
          <Typography variant="h5">₹{incomeTotal + expenseTotal}</Typography>
          <Stack direction="row" justifyContent="space-around" mt={2}>
            <Box textAlign="center">
              <Typography variant="body1">INCOME</Typography>
              <Typography variant="h6" color="green">₹{incomeTotal}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box textAlign="center">
              <Typography variant="body1">EXPENSE</Typography>
              <Typography variant="h6" color="red">₹{Math.abs(expenseTotal)}</Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
        <Link href="/report">
        <Button variant="contained">View Flat-Wise Contributions</Button>
        </Link>
        </Box>

        {/* History Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            History
          </Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => setView(newView)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="income">Income</ToggleButton>
            <ToggleButton value="expense">Expense</ToggleButton>
          </ToggleButtonGroup>
          <Divider />
          <Stack mt={2} spacing={1}>
            {filteredExpenses.map(({ id, Category, Amount, Date, Note, Reference }) => (
              <Box
                key={id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#fff"
                border="1px solid #ddd"
                borderRadius={1}
                padding={2}
              >
                <Box>
                  <Typography variant="body2">{Date}</Typography>
                  <Typography variant="body1">{Category}</Typography>
                  <Typography variant="body2">Reference: {Reference}</Typography>
                  <Typography variant="body2">Note: {Note}</Typography>
                </Box>
                <Typography variant="h6" color={Amount > 0 ? "green" : "red"}>
                  {Amount > 0 ? `+ ₹${Amount}` : `- ₹${Math.abs(Amount)}`}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
