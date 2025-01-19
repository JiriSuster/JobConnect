import { IsNotEmpty, Length, IsArray, IsOptional, IsNumber, IsPositive, ArrayMinSize } from 'class-validator';

export class JobDto {
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
