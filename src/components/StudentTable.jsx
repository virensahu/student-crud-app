import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, deleteStudent, updateStudent } from '../api/studentApi';
import { Select, MenuItem, Pagination, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MaterialReactTable } from 'material-react-table';

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

  const totalPages = Math.ceil(students.length / rowsPerPage);
  const paginatedStudents = students.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const allVisibleIds = paginatedStudents.map((s) => s.id);
  const allSelected = allVisibleIds.every((id) => selectedRows.includes(id));

  const toggleSelectAll = (checked) => {
    setSelectedRows((prev) =>
      checked ? [...new Set([...prev, ...allVisibleIds])] : prev.filter((id) => !allVisibleIds.includes(id))
    );
  };

  const handleSaveRow = async ({ values, row }) => {
    const id = row.original.id;
    await updateMutation.mutateAsync({ id, data: values });
  };

  const handleDeleteRow = async (row) => {
    const id = row.original.id;
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Delete ${selectedRows.length} selected students?`)) {
      await Promise.all(selectedRows.map((id) => deleteMutation.mutateAsync(id)));
      setSelectedRows([]);
    }
  };

  const columns = useMemo(() => [
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
              e.target.checked ? [...prev, id] : prev.filter((item) => item !== id)
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
  ], [selectedRows, allSelected]);

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-md">
      {/* Bulk Delete Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
          className={`flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ${
            selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <DeleteIcon fontSize="small" />
          Delete Selected
        </button>
      </div>

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
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
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
    </div>
  );
};

export default StudentTable;
