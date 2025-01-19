import {

    IsEmail, IsNotEmpty
} from 'class-validator';

export class JobAssignDto {
    @IsNotEmpty()
    @IsEmail()
    companyEmail: string;
}


