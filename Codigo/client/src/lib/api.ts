import axios from "axios";
import Cookies from "js-cookie";

export const TOKEN_KEY = "xp_token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "STUDENT" | "PARTNER_COMPANY" | "PROFESSOR" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
}

export interface StudentProfile {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  displayName: string;
  document: string;
  documentType: "CPF";
  rg: string;
  address: string;
  cep: string;
  course: string;
  institutionId: string;
}

export interface PartnerCompanyProfile {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  displayName: string;
  document: string;
  documentType: "CNPJ";
  address: string;
  contactPhone: string | null;
}

export interface ProfessorProfile {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  displayName: string;
  document: string;
  documentType: "CPF";
  department: string;
  institutionId: string;
}

export type UserProfile =
  | StudentProfile
  | PartnerCompanyProfile
  | ProfessorProfile;

export interface Institution {
  id: string;
  name: string;
}

export interface ProfessorModel {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  name: string;
  cpf: string;
  department: string;
  institutionId: string;
}

export interface StudentModel {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  name: string;
  cpf: string;
  rg: string;
  address: string;
  cep: string;
  course: string;
  institutionId: string;
}

export interface PartnerCompanyModel {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  tradeName: string;
  cnpj: string;
  address: string;
  contactPhone: string | null;
}

export interface UserModel {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CoinStatementEntry {
  id: string;
  amount: number;
  message: string;
  createdAt: string;
  direction: "IN" | "OUT";
  counterpartId: string;
  counterpartName: string;
  counterpartEmail: string;
}

export interface CoinStatement {
  role: UserRole;
  balance: number;
  entries: CoinStatementEntry[];
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
    "/auth/login",
    { email, password }
  );
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/users/me/profile");
  return data;
}

// Coins
export async function sendCoins(payload: {
  studentId: string;
  amount: number;
  message: string;
}): Promise<{ message: string; balance: number }> {
  const { data } = await api.post<{ message: string; balance: number }>(
    "/coins/transfers",
    payload,
  );
  return data;
}

export async function getMyCoinStatement(): Promise<CoinStatement> {
  const { data } = await api.get<CoinStatement>("/coins/statement/me");
  return data;
}

// ── Institutions ──────────────────────────────────────────────────────────────

export async function getInstitutions(): Promise<Institution[]> {
  const { data } = await api.get<Institution[]>("/institutions");
  return data;
}

export async function createInstitution(name: string): Promise<Institution> {
  const { data } = await api.post<Institution>("/institutions", { name });
  return data;
}

export async function updateInstitution(
  id: string,
  name: string,
): Promise<Institution> {
  const { data } = await api.patch<Institution>(`/institutions/${id}`, {
    name,
  });
  return data;
}

export async function deleteInstitution(id: string): Promise<void> {
  await api.delete(`/institutions/${id}`);
}

// ── Students ──────────────────────────────────────────────────────────────────

export async function createStudent(payload: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  rg: string;
  address: string;
  cep: string;
  institutionId: string;
  course: string;
}) {
  const { data } = await api.post("/students", payload);
  return data;
}

export async function getStudents(): Promise<StudentModel[]> {
  const { data } = await api.get<StudentModel[]>("/students");
  return data;
}

// ── Partner Companies ─────────────────────────────────────────────────────────

export async function createPartnerCompany(payload: {
  email: string;
  password: string;
  cnpj: string;
  tradeName: string;
  address: string;
  contactPhone?: string;
}) {
  const { data } = await api.post("/partner-companies", payload);
  return data;
}

export async function getPartnerCompanies(): Promise<PartnerCompanyModel[]> {
  const { data } = await api.get<PartnerCompanyModel[]>("/partner-companies");
  return data;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function updateMyProfile(payload: {
  displayName?: string;
  document?: string;
  rg?: string;
  address?: string;
  cep?: string;
  course?: string;
  department?: string;
  institutionId?: string;
  contactPhone?: string;
}) {
  const { data } = await api.patch<UserProfile>("/users/me/profile", payload);
  return data;
}

export async function deleteMyAccount() {
  await api.delete("/users/me");
}

// ── Reset Password ────────────────────────────────────────────────────────────

export async function forgotPassword(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erro ao solicitar redefinição de senha");
  }
  return res.json() as Promise<{ message: string }>;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erro ao redefinir senha");
  }
  return res.json() as Promise<{ message: string }>;
}

// ── Professors (Admin) ────────────────────────────────────────────────────────

export async function getProfessors(): Promise<ProfessorModel[]> {
  const { data } = await api.get<ProfessorModel[]>("/professors");
  return data;
}

export async function createProfessor(payload: {
  name: string;
  email: string;
  cpf: string;
  department: string;
  institutionId: string;
}): Promise<ProfessorModel> {
  const { data } = await api.post<ProfessorModel>("/professors", payload);
  return data;
}

export async function updateProfessor(
  id: string,
  payload: {
    displayName?: string;
    department?: string;
    institutionId?: string;
  },
): Promise<ProfessorModel> {
  const { data } = await api.patch<ProfessorModel>(`/professors/${id}`, payload);
  return data;
}

// ── Users (Admin) ─────────────────────────────────────────────────────────────

export async function getUsers(): Promise<UserModel[]> {
  const { data } = await api.get<UserModel[]>("/users");
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

