import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudents, deleteStudent } from '../api/studentApi';

const StudentTable = ({ onEdit }) => {
  const queryClient = useQueryClient();
  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Sort students by name (ascending)
  const sortedStudents = [...students].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
      queryClient.invalidateQueries(['students']);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError) return <p className="text-center mt-4 text-red-500">Error loading students.</p>;

  return (
    <div className="w-full md:w-[80vw] mx-auto mt-10">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">SNo.</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Age</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, idx) => (
            <tr key={student.id} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{indexOfFirstStudent + idx + 1}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.age}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">{student.course}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(student)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Prev
        </button>

        {[1, 2, 3].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            {page}
          </button>
        ))}

        {currentPage > 3 && (
          <>
            <span className="px-2">...</span>
            <button
              onClick={() => setCurrentPage(currentPage)}
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              {currentPage}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded ${currentPage === totalPages || totalPages === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTable;
