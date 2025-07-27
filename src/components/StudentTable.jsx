import React, { useMemo, useState, forwardRef } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getStudents,
  deleteStudent,
  updateStudent,
} from '../api/studentApi';
import {
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slide,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { MaterialReactTable } from 'material-react-table';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


// Slide transition for dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StudentTable = ({ onEdit }) => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries(['students']),
  });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const totalPages = Math.ceil(students.length / rowsPerPage);
  const paginatedStudents = students.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const allVisibleIds = paginatedStudents.map((s) => s.id);
  const allSelected = allVisibleIds.every((id) =>
    selectedRows.includes(id)
  );

  const toggleSelectAll = (checked) => {
    setSelectedRows((prev) =>
      checked
        ? [...new Set([...prev, ...allVisibleIds])]
        : prev.filter((id) => !allVisibleIds.includes(id))
    );
  };

  const handleSaveRow = async ({ values, row }) => {
    const id = row.original.id;
    await updateMutation.mutateAsync({ id, data: values });
  };

  const handleDeleteRow = (row) => {
    setStudentToDelete(row.original);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      await deleteMutation.mutateAsync(studentToDelete.id);
      setConfirmDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    setStudentToDelete({ id: selectedRows, bulk: true });
    setConfirmDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (studentToDelete?.bulk) {
      await Promise.all(
        studentToDelete.id.map((id) => deleteMutation.mutateAsync(id))
      );
      setSelectedRows([]);
    }
    setConfirmDialogOpen(false);
    setStudentToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: (
          <Checkbox
            checked={allSelected}
            onChange={(e) => toggleSelectAll(e.target.checked)}
          />
        ),
        Cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.id)}
            onChange={(e) => {
              const id = row.original.id;
              setSelectedRows((prev) =>
                e.target.checked
                  ? [...prev, id]
                  : prev.filter((item) => item !== id)
              );
            }}
          />
        ),
        enableSorting: false,
        size: 50,
      },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'age', header: 'Age' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'course', header: 'Course' },
    ],
    [selectedRows, allSelected]
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Age', 'Email', 'Course'];
    const rows = paginatedStudents.map((student) => [
      student.name,
      student.age,
      student.email,
      student.course,
    ]);
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(paginatedStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, 'students.xlsx');
  };

  // UI 
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-red-100 rounded-lg shadow-md mt-10 mb-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        {/* Export Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={exportToCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Export to CSV
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Export to Excel
          </button>
        </div>
        {/* Bulk Delete Button */}
        <button
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-1200 transition ${selectedRows.length === 0 ? 'opacity-80 cursor-not-allowed' : ''
            }`}
        >
          <DeleteIcon fontSize="small" />
          Delete Selected
        </button>
      </div>
      {/* Table */}
      <MaterialReactTable
        columns={columns}
        data={paginatedStudents}
        editingMode="row"
        enableEditing
        onEditingRowSave={handleSaveRow}
        enablePagination={false}
        state={{ isLoading, showAlertBanner: isError }}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <div className="flex gap-2 justify-start">
            <IconButton onClick={() => onEdit(row.original)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteRow(row)} color="error">
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      />
      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page:</span>
          <Select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setPage(1);
            }}
            size="small"
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          color="primary"
        />
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={cancelDelete}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            backgroundColor: '#fff',
            boxShadow: 6,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberIcon color="warning" />
            <Typography variant="h6" color="text.primary">
              Confirm Deletion
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" color="text.secondary" mt={1}>
            {studentToDelete?.bulk
              ? `Are you sure you want to delete ${studentToDelete.id.length} selected students?`
              : `Are you sure you want to delete "${studentToDelete?.name}"?`}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={cancelDelete} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              studentToDelete?.bulk ? confirmBulkDelete : confirmDelete
            }
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentTable;
