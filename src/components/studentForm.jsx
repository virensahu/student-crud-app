import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createStudent, updateStudent, getStudents } from '../api/studentApi';

const StudentForm = ({ selectedStudent, clearSelection }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    course: '',
  });

  const queryClient = useQueryClient();

  // Fetch all students for duplicate check
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  useEffect(() => {
    if (selectedStudent) {
      setFormData(selectedStudent);
    } else {
      setFormData({ name: '', age: '', email: '', course: '' });
    }
  }, [selectedStudent]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (selectedStudent) {
        return await updateStudent(selectedStudent.id, formData);
      } else {
        return await createStudent(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      clearSelection();
      setFormData({ name: '', age: '', email: '', course: '' });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Something went wrong');
    },
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side duplicate check
    const isDuplicate = students.some(
      (student) =>
        student.email === formData.email &&
        student.id !== selectedStudent?.id
    );

    if (isDuplicate) {
      alert('A student with this email already exists.');
      return;
    }

    mutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl w-full md:w-[80vw] mx-auto bg-white shadow-md rounded-lg p-4 space-y-4 mt-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        {selectedStudent ? 'Update Student' : 'Create Student'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['name', 'age', 'email', 'course'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field}
            </label>
            <input
              type={field === 'age' ? 'number' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        {selectedStudent && (
          <button
            type="button"
            onClick={clearSelection}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
