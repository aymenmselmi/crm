import React from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  format?: (value: any) => string;
}

interface ListViewProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onViewDetails?: (item: any) => void;
  onDelete?: (item: any) => void;
  total?: number;
  onPageChange?: (offset: number, limit: number) => void;
}

const ListView: React.FC<ListViewProps> = ({
  data,
  columns,
  loading = false,
  onAdd,
  onEdit,
  onViewDetails,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ backgroundColor: '#0070d2' }}
          >
            New
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredData.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No records found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f3f3f3' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      minWidth: column.minWidth,
                      fontWeight: 600,
                      color: '#111',
                      borderBottom: '2px solid #ddd',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid #ddd', width: 200 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child td': { borderBottom: 'none' },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ borderBottom: '1px solid #eee' }}>
                      {column.format
                        ? column.format(row[column.id])
                        : row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell sx={{ borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {onViewDetails && (
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onViewDetails(row)}
                          sx={{ color: '#0070d2', textTransform: 'none' }}
                        >
                          View
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(row)}
                          sx={{ color: '#0070d2', textTransform: 'none' }}
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => onDelete(row)}
                          sx={{ color: '#c23934', textTransform: 'none' }}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ListView;
