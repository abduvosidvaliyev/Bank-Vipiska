import axios from "axios";
import type { Statement } from "../mock/MockData"; 

// Asosiy URL
const BASE_URL = "http://localhost:8000/api/document";

export const getBankStatements = () =>
    axios.get(`${BASE_URL}/bank-statement/`).then(res => res.data);

export const getBankStatementById = (id: string | number) =>
    axios.get(`${BASE_URL}/bank-statement/${id}/`).then(res => res.data);

export const createBankStatement = (data: Statement | any) =>
    axios.post(`${BASE_URL}/bank-statement/`, data).then(res => res.data);

export const updateBankStatement = (id: string | number, data: Statement | any) =>
    axios.put(`${BASE_URL}/bank-statement/${id}/`, data).then(res => res.data);

export const patchBankStatement = (id: string | number, data: any) =>
    axios.patch(`${BASE_URL}/bank-statement/${id}/`, data).then(res => res.data);

export const deleteBankStatement = (id: string | number) =>
    axios.delete(`${BASE_URL}/bank-statement/${id}/`).then(res => res.data);
