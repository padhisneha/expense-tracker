'use client'

import { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Contributions() {
  const [contributions1, setContributions1] = useState([]);
  const [contributions2, setContributions2] = useState([]);
  const [contributions3, setContributions3] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const generateFlatNumbers1 = () => {
    const flats = [];
    for (let i = 11; i <= 19; i++) {
      for (let j = 1; j <= 4; j++) {
        flats.push(`${i}0${j}`);
      }
    }
    return flats;
  };

  const generateFlatNumbers2 = () => {
    const flats = [];
    for (let i = 11; i <= 19; i++) {
      for (let j = 5; j <= 8; j++) {
        flats.push(`${i}0${j}`);
      }
    }
    return flats;
  };

  const generateFlatNumbers3 = () => {
    const flats = [];
    for (let i = 11; i <= 19; i++) {
      for (let j = 9; j <= 9; j++) {
        flats.push(`${i}0${j}`);
      }
      for (let j = 10; j <= 12; j++) {
        flats.push(`${i}${j}`);
      }
    }
    return flats;
  };

  useEffect(() => {
    const fetchContributions = async () => {
      const q = query(collection(firestore, 'Expense'), where('Type', '==', 'Income'));
      const querySnapshot = await getDocs(q);
      const flatContributions = {};

      querySnapshot.forEach((doc) => {
        const { Reference, Amount } = doc.data();
        if (flatContributions[Reference]) {
          flatContributions[Reference] += Amount;
        } else {
          flatContributions[Reference] = Amount;
        }
      });

      const allFlats1 = generateFlatNumbers1();
      const allFlats2 = generateFlatNumbers2();
      const allFlats3 = generateFlatNumbers3();

      const contributionList1 = allFlats1.map((flatNo) => ({
        flatNo,
        totalContribution: flatContributions[flatNo] || "",
      }));
      const contributionList2 = allFlats2.map((flatNo) => ({
        flatNo,
        totalContribution: flatContributions[flatNo] || "",
      }));
      const contributionList3 = allFlats3.map((flatNo) => ({
        flatNo,
        totalContribution: flatContributions[flatNo] || "",
      }));

      setContributions1(contributionList1);
      setContributions2(contributionList2);
      setContributions3(contributionList3);
    };

    fetchContributions();
  }, []);

  const calculateTotal = (contributions) => {
    return contributions.reduce((acc, curr) => acc + (curr.totalContribution || 0), 0);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderTable = (contributions) => (
    <TableContainer component={Paper}>
      <Table aria-label="contributions table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Flat</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contributions.map(({ flatNo, totalContribution }) => (
            <TableRow key={flatNo}>
              <TableCell>{flatNo}</TableCell>
              <TableCell>{totalContribution}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      width="100vw"
      minHeight="100vh"  // Changed from height to minHeight
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ paddingTop: 4, overflow: "auto" }}  // Ensure overflow is set
    >
      <Typography variant="h4" color="#192bc2" gutterBottom>
        Flat-Wise Contributions
      </Typography>
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange} 
        aria-label="block tabs"
      >
        <Tab label="Block 1A" />
        <Tab label="Block 1B" />
        <Tab label="Block 1C" />
      </Tabs>

      <Box mt={2} width="400">
        {selectedTab === 0 && (
          <>
            {renderTable(contributions1)}
            <Typography variant="subtitle1" marginTop={1}>
              Total: ₹{calculateTotal(contributions1)}
            </Typography>
          </>
        )}
        {selectedTab === 1 && (
          <>
            {renderTable(contributions2)}
            <Typography variant="subtitle1" marginTop={1}>
              Total: ₹{calculateTotal(contributions2)}
            </Typography>
          </>
        )}
        {selectedTab === 2 && (
          <>
            {renderTable(contributions3)}
            <Typography variant="subtitle1" marginTop={1}>
              Total: ₹{calculateTotal(contributions3)}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
