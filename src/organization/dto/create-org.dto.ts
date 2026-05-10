import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens',
  })
  slug!: string;
}
