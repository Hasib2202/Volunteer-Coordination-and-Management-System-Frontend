import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSponsorDtoByUserId {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  nickName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  //   @IsDecimal({ decimal_digits: '4', force_decimal: true })
  // @IsNumber()
  // @IsOptional()
  @IsNotEmpty()
  sponsorshipAmount?: number;

  @IsString()
  // @IsOptional()
  @IsNotEmpty()
  sponsorshipType?: string;

  @IsDateString()
  // @IsOptional()
  @IsNotEmpty()
  startDate?: string;

  @IsDateString()
  // @IsOptional()
  @IsNotEmpty()
  endDate?: string;

  // @IsString()
  // @IsOptional()
  @IsNotEmpty()
  contractUrl?: string;
}

export class CreateSponsorsDtoSid {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  nickName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  //   @IsDecimal({ decimal_digits: '4', force_decimal: true })
  // @IsNumber()
  // @IsOptional()
  @IsNotEmpty()
  sponsorshipAmount?: number;

  // @IsString()
  // @IsOptional()
  @IsNotEmpty()
  sponsorshipType?: string;

  @IsDateString()
  // @IsOptional()
  @IsNotEmpty()
  startDate?: string;

  @IsDateString()
  // @IsOptional()
  @IsNotEmpty()
  endDate?: string;

  // @IsString()
  // @IsOptional()
  @IsNotEmpty()
  contractUrl?: string;
}

export class CreateSponsorDto {}
