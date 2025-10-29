export declare enum UserRole {
    CANDIDATE = "CANDIDATE",
    RECRUITER = "RECRUITER"
}
export declare class SignupDto {
    email: string;
    password: string;
    role: UserRole;
}
