import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
    limit: number

    @IsOptional()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    page: number
}