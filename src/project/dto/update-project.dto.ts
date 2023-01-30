import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsString()
  @IsOptional()
  when: string;
  @IsString()
  @IsOptional()
  where: string;
  @IsString()
  @IsOptional()
  who: string;
  @IsString()
  @IsOptional()
  what: string;
  @IsString()
  @IsOptional()
  why: string;
  @IsString()
  @IsOptional()
  how: string;
}
