// File: src/module/auth/jwt-auth.guard.ts

// JwtAuthGuard looks empty, but it is NOT empty. It is inheriting everything from AuthGuard('jwt')

/*
🔥 What does AuthGuard('jwt') do?

It comes from Passport.js strategy system.

It automatically:

--Extracts token from request
--Calls JWT strategy
--Validates token
--Attaches user to request
--Allows or blocks request

*/

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}