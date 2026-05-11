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

// ── Institutions ──────────────────────────────────────────────────────────────

export async function getInstitutions(): Promise<Institution[]> {
  const { data } = await api.get<Institution[]>("/institutions");
  return data;
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
