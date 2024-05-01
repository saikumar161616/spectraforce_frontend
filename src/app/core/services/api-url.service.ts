import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlsService {
  constructor() {}
}

export const domain = environment.apiUrl;

export const ApiUrls = {
  users: `${domain}/users/`,
  upload: `${domain}/public/`
};
