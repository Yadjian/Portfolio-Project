export declare class CreateUserDto {
    email: string;
    password: string;
    role: 'candidate' | 'recruiter' | 'admin';
    candidateData?: any;
    recruiterData?: any;
}
