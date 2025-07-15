import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export const getStudents = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const createStudent = async (data) => {
  const res = await axios.post(API_BASE_URL, data);
  return res.data;
};

export const getStudentById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const updateStudent = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};
