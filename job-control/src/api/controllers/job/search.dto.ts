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

export class SearchDto {
    @Length(2, 50)
    @IsNotEmpty()
    text: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    fields: string[];

}


