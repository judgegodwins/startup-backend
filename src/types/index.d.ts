import { Request } from 'express';
import { SpreadsheetFields, UserRole } from '../database/entities/enum';

interface Session {
  userId: string;
  userRole: UserRole;
  user: Omit<User, 'password'>;
  [key: string]: any;
}

interface StudentSession extends Session {
  studentId: string;
  levelId: string;
}

export interface AuthenticatedRequest extends Request {
  session: Session;
}

export interface AuthenticatedStudentRequest extends Request {
  session: StudentSession;
}

export interface ServiceActionResult {
  data: any;
  message?: string;
  statusCode?: number;
}

export interface ResultSpreadSheetEntry<T extends number | '' = ''> {
  [SpreadsheetFields.MATNO]: string;
  [SpreadsheetFields.CA]: T;
  [SpreadsheetFields.EXAM]: T;
}
