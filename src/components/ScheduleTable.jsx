import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

const ScheduleTable = ({ schedule, onCellClick }) => {
  return (
    <Table>
      <TableBody>
        {schedule.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, colIndex) => (
              <TableCell
                key={colIndex}
                onClick={() => onCellClick(cell.day, cell.time)} // При клике на ячейку, передаем день и время
                style={{ cursor: 'pointer' }}
              >
                {cell.subject}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduleTable;