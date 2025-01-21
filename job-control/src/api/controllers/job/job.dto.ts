import {
    IsNotEmpty,
    Length,
    IsArray,
    IsOptional,
    IsNumber,
    IsPositive,
    ArrayMinSize,
    IsEmail
} from 'class-validator';

export class JobDto {

    @IsNotEmpty()
    @IsEmail()
    customerEmail: string;

    @IsOptional()
    @IsEmail()
    companyEmail: string;

    @IsNotEmpty()
    @Length(3, 50)
    title: string;

    @IsNotEmpty()
    @Length(3, 5000)
    description: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    categories: string[];

    @IsOptional()
    @IsArray()
    subcategories: string[];

    @IsOptional()
    images: File[];

    @IsOptional()
    @IsNumber()
    @IsPositive()
    budget: number;
}


