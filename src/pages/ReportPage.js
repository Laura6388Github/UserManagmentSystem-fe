import React from "react";
import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material"
import AddIcon from "@mui/icons-material/Add";
import {Link} from "react-router-dom";
import { useSelector } from "react-redux";
import { apis } from "../apis";


const ReportPage = () => {

  const {user} = useSelector((state) => state.auth);

  const getReport = React.useCallback(async () => {
    try {
      var res;
      if(user?.role === "admin") res = await apis
    } catch (error) {
      
    }
  })
  return (
      <Card>
        <CardContent>
          <Box sx = {{
            display: "flex",
            justifyContent:"space-between",
            alignItems: "center",
            mb: 2,
            gap: 1,
          }}>
            <Typography variant="h5">Report Page</Typography>
            <Box gap={1} display='flex'>
              <Button
                component={Link}
                to="/createReport"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Report
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table TableBarOutlined>
              <TableHead>
                <TableRow >
                  <TableCell style={{textAlign: 'center'}}>Getting Job</TableCell>
                  <TableCell style={{textAlign: 'center'}}>Project Status</TableCell>
                  <TableCell style={{textAlign: 'center'}}>Account hunting && Skill Development</TableCell>
                  <TableCell style={{textAlign: 'center'}}>Team work</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {

                }
                <TableRow>
                  <TableCell>Row1, Column 1</TableCell>
                  <TableCell>Row1, Column 2</TableCell>
                  <TableCell>Row1, Column 3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row2, Column 1</TableCell>
                  <TableCell>Row2, Column 2</TableCell>
                  <TableCell>Row2, Column 3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
  )
}

export default ReportPage;