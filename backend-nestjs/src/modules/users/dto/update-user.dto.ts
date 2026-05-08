// File: src/modules/vehicles/DTO/update-vehicle.dto.ts
// PartialType = all fields optional (perfect for update)

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {} // This will make all fields from CreateUsersDto optional, which is perfect for update operations.